#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const ROOT_DIR = process.cwd();
const TEMP_MEDIA_DIR = path.join(ROOT_DIR, "temp_media");
const MANIFEST_PATH = path.join(TEMP_MEDIA_DIR, "manifest.json");
const RESULTS_PATH = path.join(TEMP_MEDIA_DIR, "process-results.json");
const MEDIA_TS_PATH = path.join(ROOT_DIR, "content", "media.ts");
const TIMELINE_TS_PATH = path.join(ROOT_DIR, "content", "timeline.ts");
const HIGHLIGHTS_TS_PATH = path.join(ROOT_DIR, "content", "highlights.ts");
const PUBLIC_MEDIA_DIR = path.join(ROOT_DIR, "public", "media");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
  GEMINI_MODEL,
)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY || "")}`;
const STYLE_GUIDE =
  "Write in a concise, polished voice that blends elite sport, coaching, and practical engineering. Favor short to mid-length sentences, concrete nouns, and repeatable-systems language over hype. Use occasional dry, self-aware wit when it feels natural, but keep the tone controlled and credible. Prefer compact blurbs with contextual dates when useful, and frame progress as measurable performance, judgment, and craft.";
const SYSTEM_PROMPT = `You are the autonomous content manager for my website.\n\n${STYLE_GUIDE}\n\nI am providing you with a batch of new images and text files. For each item:\n1. Analyze the content.\n2. Write a short paragraph or sentence interpreting the content in the exact style requested above. Generate SEO alt-text for images.\n3. Decide where this content belongs. The ONLY valid destinations are: media (for general photos/videos), events (for highlights/milestones), or tech (for coding/hardware stuff).\n\nYou MUST return your analysis as a strict JSON object matching this schema exactly. Do not output markdown code blocks, only raw, valid JSON:\n{\n  "updates": [\n    {\n      "destination": "media" | "events" | "tech",\n      "filename": "original_filename.jpg",\n      "alt_text": "...",\n      "content_text": "Your stylized interpretation here",\n      "date": "YYYY-MM-DD"\n    }\n  ]\n}`;
const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    updates: {
      type: "array",
      items: {
        type: "object",
        properties: {
          destination: {
            type: "string",
            enum: ["media", "events", "tech"],
          },
          filename: { type: "string" },
          alt_text: { type: "string" },
          content_text: { type: "string" },
          date: { type: "string" },
        },
        required: [
          "destination",
          "filename",
          "alt_text",
          "content_text",
          "date",
        ],
      },
    },
  },
  required: ["updates"],
};

async function main() {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is required.");
  }

  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Missing manifest: ${MANIFEST_PATH}`);
  }

  const localFiles = walkDirectory(TEMP_MEDIA_DIR).filter((file) => {
    return !["manifest.json", "process-results.json"].includes(file.relativePath);
  });

  console.log("Successfully read ./temp_media directory.");
  console.log(`Found ${localFiles.length} files in ./temp_media.`);

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const manifestFiles = manifest.files || [];

  if (manifestFiles.length !== localFiles.length) {
    throw new Error(
      `Manifest count (${manifestFiles.length}) does not match directory count (${localFiles.length}).`,
    );
  }

  const manifestByRelativePath = new Map(
    manifestFiles.map((file) => [normalizePath(file.localRelativePath), file]),
  );
  const batchFiles = localFiles.map((file) => {
    const manifestEntry = manifestByRelativePath.get(file.relativePath);
    if (!manifestEntry) {
      throw new Error(`File ${file.relativePath} is missing from manifest.json.`);
    }
    return { ...manifestEntry, absolutePath: file.absolutePath };
  });

  const duplicateNames = findDuplicateNames(batchFiles.map((file) => file.filename));
  if (duplicateNames.length > 0) {
    throw new Error(
      `Duplicate filenames in batch are not supported: ${duplicateNames.join(", ")}`,
    );
  }

  console.log(`Sending ${batchFiles.length} files to Gemini.`);
  console.log("Dispatching Gemini API request...");
  const rawGeminiResponse = await sendGeminiRequest(batchFiles);
  console.log("Received Gemini API response.");
  console.log(
    "Raw Gemini response JSON:",
    JSON.stringify(rawGeminiResponse, null, 2),
  );

  const responseText = extractGeminiText(rawGeminiResponse);
  const parsedResponse = JSON.parse(responseText);
  validateGeminiResponse(parsedResponse, batchFiles);

  const mediaState = fs.readFileSync(MEDIA_TS_PATH, "utf8");
  const timelineState = fs.readFileSync(TIMELINE_TS_PATH, "utf8");
  const highlightsState = fs.readFileSync(HIGHLIGHTS_TS_PATH, "utf8");
  const fileStates = new Map([
    [MEDIA_TS_PATH, mediaState],
    [TIMELINE_TS_PATH, timelineState],
    [HIGHLIGHTS_TS_PATH, highlightsState],
  ]);
  const touchedFiles = new Set();
  const appended = [];
  const skipped = [];
  const copiedAssets = [];
  const manifestByFilename = new Map(
    batchFiles.map((file) => [file.filename, file]),
  );

  for (const update of parsedResponse.updates) {
    const sourceFile = manifestByFilename.get(update.filename);
    const stableId = buildStableId(update.filename, update.date);

    if (!sourceFile) {
      throw new Error(`Gemini returned unknown filename: ${update.filename}`);
    }

    if (update.destination === "media") {
      if (!isImageOrVideo(sourceFile)) {
        throw new Error(
          `Gemini classified ${sourceFile.filename} as media, but it is not an image or video.`,
        );
      }

      const mediaAsset = buildMediaAsset(sourceFile, stableId);
      const currentMedia = fileStates.get(MEDIA_TS_PATH);

      if (
        hasExistingMarker(currentMedia, `id: ${JSON.stringify(stableId)}`) ||
        hasExistingMarker(
          currentMedia,
          `sourceFilename: ${JSON.stringify(sourceFile.filename)}`,
        ) &&
          hasExistingMarker(
            currentMedia,
            `sourceDate: ${JSON.stringify(update.date)}`,
          ) ||
        hasExistingMarker(currentMedia, `src: ${JSON.stringify(mediaAsset.sitePath)}`)
      ) {
        skipped.push({
          destination: update.destination,
          filename: sourceFile.filename,
          reason: "Duplicate media entry detected.",
        });
        continue;
      }

      fs.mkdirSync(mediaAsset.absoluteDir, { recursive: true });
      fs.copyFileSync(sourceFile.absolutePath, mediaAsset.absolutePath);
      copiedAssets.push(mediaAsset.sitePath);

      const nextMedia = insertIntoExportedArray(
        currentMedia,
        "media",
        {
          id: stableId,
          type: mediaAsset.type,
          src: mediaAsset.sitePath,
          title: humanizeFilename(sourceFile.filename),
          alt: update.alt_text,
          section: "Life events",
          caption: update.content_text,
          sourceFilename: sourceFile.filename,
          sourceDate: update.date,
          sourceMimeType: sourceFile.mimeType,
        },
      );

      fileStates.set(MEDIA_TS_PATH, nextMedia);
      touchedFiles.add(MEDIA_TS_PATH);
      appended.push({
        destination: update.destination,
        filename: sourceFile.filename,
        targetFile: path.relative(ROOT_DIR, MEDIA_TS_PATH),
      });
      console.log(
        `Successfully appended ${sourceFile.filename} to content/media.ts`,
      );
      continue;
    }

    if (update.destination === "events") {
      const currentTimeline = fileStates.get(TIMELINE_TS_PATH);

      if (
        hasExistingMarker(currentTimeline, `sourceFilename: ${JSON.stringify(sourceFile.filename)}`) &&
        hasExistingMarker(currentTimeline, `sourceDate: ${JSON.stringify(update.date)}`)
      ) {
        skipped.push({
          destination: update.destination,
          filename: sourceFile.filename,
          reason: "Duplicate event entry detected.",
        });
        continue;
      }

      const nextTimeline = insertIntoExportedArray(
        currentTimeline,
        "timeline",
        {
          year: update.date.slice(0, 4),
          area: "Life events",
          title: humanizeFilename(sourceFile.filename),
          meta: update.date,
          description: update.content_text,
          sourceFilename: sourceFile.filename,
          sourceDate: update.date,
        },
      );

      fileStates.set(TIMELINE_TS_PATH, nextTimeline);
      touchedFiles.add(TIMELINE_TS_PATH);
      appended.push({
        destination: update.destination,
        filename: sourceFile.filename,
        targetFile: path.relative(ROOT_DIR, TIMELINE_TS_PATH),
      });
      console.log(
        `Successfully appended ${sourceFile.filename} to content/timeline.ts`,
      );
      continue;
    }

    const currentHighlights = fileStates.get(HIGHLIGHTS_TS_PATH);
    if (
      hasExistingMarker(
        currentHighlights,
        `id: ${JSON.stringify(stableId)}`,
      ) ||
      hasExistingMarker(
        currentHighlights,
        `sourceFilename: ${JSON.stringify(sourceFile.filename)}`,
      ) &&
        hasExistingMarker(
          currentHighlights,
          `sourceDate: ${JSON.stringify(update.date)}`,
        )
    ) {
      skipped.push({
        destination: update.destination,
        filename: sourceFile.filename,
        reason: "Duplicate tech entry detected.",
      });
      continue;
    }

    const nextHighlights = insertIntoExportedArray(
      currentHighlights,
      "highlights",
      {
        id: stableId,
        area: "Motion Dynamics",
        title: humanizeFilename(sourceFile.filename),
        meta: update.date,
        description: update.content_text,
        date: update.date,
        tag: isTextLike(sourceFile) ? "project" : "moment",
        sourceFilename: sourceFile.filename,
        sourceDate: update.date,
      },
    );

    fileStates.set(HIGHLIGHTS_TS_PATH, nextHighlights);
    touchedFiles.add(HIGHLIGHTS_TS_PATH);
    appended.push({
      destination: update.destination,
      filename: sourceFile.filename,
      targetFile: path.relative(ROOT_DIR, HIGHLIGHTS_TS_PATH),
    });
    console.log(
      `Successfully appended ${sourceFile.filename} to content/highlights.ts`,
    );
  }

  for (const filePath of touchedFiles) {
    fs.writeFileSync(filePath, fileStates.get(filePath));
  }

  const summary = {
    model: GEMINI_MODEL,
    appended,
    skipped,
    copiedAssets,
    modifiedFiles: [...touchedFiles].map((filePath) =>
      path.relative(ROOT_DIR, filePath),
    ),
  };

  fs.writeFileSync(RESULTS_PATH, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`Wrote processing summary to ${RESULTS_PATH}`);
}

function walkDirectory(startDir, rootDir = startDir) {
  const results = [];
  const entries = fs.readdirSync(startDir, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(startDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDirectory(absolutePath, rootDir));
      continue;
    }

    results.push({
      absolutePath,
      relativePath: normalizePath(path.relative(rootDir, absolutePath)),
    });
  }

  return results;
}

function normalizePath(value) {
  return value.split(path.sep).join("/");
}

function findDuplicateNames(values) {
  const seen = new Set();
  const duplicates = new Set();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }

  return [...duplicates];
}

function isTextLike(file) {
  return (
    file.mimeType.startsWith("text/") ||
    [".txt", ".md", ".markdown", ".json", ".csv"].includes(
      path.extname(file.absolutePath).toLowerCase(),
    )
  );
}

function isImageOrVideo(file) {
  return isImageFile(file) || isVideoFile(file);
}

function isImageFile(file) {
  return (
    file.mimeType.startsWith("image/") ||
    [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"].includes(
      path.extname(file.absolutePath).toLowerCase(),
    )
  );
}

function isVideoFile(file) {
  return (
    file.mimeType.startsWith("video/") ||
    [".mp4", ".mov", ".m4v", ".webm"].includes(
      path.extname(file.absolutePath).toLowerCase(),
    )
  );
}

function buildMediaAsset(file, stableId) {
  const extension = getPreferredExtension(file.absolutePath, file.mimeType);
  const type = isVideoFile(file) ? "video" : "image";
  const directory = type === "video" ? "videos" : "images";
  const absoluteDir = path.join(PUBLIC_MEDIA_DIR, directory);
  const filename = `${stableId}${extension}`;

  return {
    type,
    absoluteDir,
    absolutePath: path.join(absoluteDir, filename),
    sitePath: `/media/${directory}/${filename}`,
  };
}

function getPreferredExtension(absolutePath, mimeType) {
  const existingExtension = path.extname(absolutePath).toLowerCase();
  if (existingExtension) {
    return existingExtension;
  }

  const extensionMap = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "video/mp4": ".mp4",
    "video/quicktime": ".mov",
    "text/plain": ".txt",
    "text/csv": ".csv",
  };

  return extensionMap[mimeType] || ".bin";
}

async function sendGeminiRequest(batchFiles) {
  const parts = [
    {
      text: [
        "Batch manifest:",
        ...batchFiles.map((file, index) => {
          const sourceDate = file.modifiedTime
            ? String(file.modifiedTime).slice(0, 10)
            : "unknown";
          return `${index + 1}. filename=\"${file.filename}\", mimeType=\"${file.mimeType}\", originalMimeType=\"${file.originalMimeType}\", sourceDate=\"${sourceDate}\"`;
        }),
        "",
        "Return one update object for every file above.",
        "The filename in each update must exactly match one of the filenames listed in the manifest.",
        "If a file is text, use the supplied text content. If it is binary, inspect the supplied asset data.",
      ].join("\n"),
    },
  ];

  for (const file of batchFiles) {
    if (isTextLike(file)) {
      const textContent = fs.readFileSync(file.absolutePath, "utf8");
      const normalizedText = textContent.trim();
      const truncatedText = normalizedText.length > 40000
        ? `${normalizedText.slice(0, 40000)}\n[TRUNCATED FOR BATCH LIMITS]`
        : normalizedText;

      parts.push({
        text: `Text file: ${file.filename}\nMIME type: ${file.mimeType}\nContents:\n${truncatedText}`,
      });
      continue;
    }

    const binary = fs.readFileSync(file.absolutePath);
    parts.push({
      text: `Binary file: ${file.filename}\nMIME type: ${file.mimeType}`,
    });
    parts.push({
      inlineData: {
        mimeType: file.mimeType,
        data: binary.toString("base64"),
      },
    });
  }

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: "user",
          parts,
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${body}`);
  }

  return response.json();
}

function extractGeminiText(responseJson) {
  const candidates = responseJson.candidates || [];

  for (const candidate of candidates) {
    const parts = candidate.content?.parts || [];
    for (const part of parts) {
      if (typeof part.text === "string" && part.text.trim()) {
        return part.text.trim();
      }
    }
  }

  if (responseJson.promptFeedback?.blockReason) {
    throw new Error(
      `Gemini blocked the request: ${responseJson.promptFeedback.blockReason}`,
    );
  }

  throw new Error("Gemini returned no text payload.");
}

function validateGeminiResponse(payload, batchFiles) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Gemini response is not a JSON object.");
  }

  if (!Array.isArray(payload.updates)) {
    throw new Error("Gemini response is missing the updates array.");
  }

  if (payload.updates.length !== batchFiles.length) {
    throw new Error(
      `Gemini returned ${payload.updates.length} updates for ${batchFiles.length} files.`,
    );
  }

  const validDestinations = new Set(["media", "events", "tech"]);
  const knownFilenames = new Set(batchFiles.map((file) => file.filename));
  const seenFilenames = new Set();

  for (const update of payload.updates) {
    if (!update || typeof update !== "object" || Array.isArray(update)) {
      throw new Error("Each update must be an object.");
    }

    if (!validDestinations.has(update.destination)) {
      throw new Error(`Invalid destination: ${update.destination}`);
    }

    for (const field of ["filename", "alt_text", "content_text", "date"]) {
      if (typeof update[field] !== "string") {
        throw new Error(`Field ${field} must be a string.`);
      }
    }

    if (!knownFilenames.has(update.filename)) {
      throw new Error(`Gemini returned unexpected filename: ${update.filename}`);
    }

    if (seenFilenames.has(update.filename)) {
      throw new Error(`Gemini returned duplicate filename: ${update.filename}`);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(update.date)) {
      throw new Error(`Invalid date format for ${update.filename}: ${update.date}`);
    }

    seenFilenames.add(update.filename);
  }
}

function buildStableId(filename, isoDate) {
  const stem = path.basename(filename, path.extname(filename));
  const slug = stem
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "update";

  return `${slug}-${isoDate}`.replace(/-+/g, "-");
}

function humanizeFilename(filename) {
  const stem = path.basename(filename, path.extname(filename));
  const spaced = stem.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  if (!spaced) {
    return "Untitled Update";
  }

  return spaced.replace(/\b\w/g, (character) => character.toUpperCase());
}

function hasExistingMarker(fileContents, marker) {
  return fileContents.includes(marker);
}

function insertIntoExportedArray(fileContents, exportName, objectValue) {
  const marker = `export const ${exportName}`;
  const markerIndex = fileContents.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Could not find export ${exportName}.`);
  }

  const arrayStart = fileContents.indexOf("[", markerIndex);
  if (arrayStart === -1) {
    throw new Error(`Could not locate array start for export ${exportName}.`);
  }

  const arrayEnd = findMatchingBracket(fileContents, arrayStart, "[", "]");
  const insertion = `${formatObjectLiteral(objectValue, "  ")},\n`;
  return `${fileContents.slice(0, arrayEnd)}${insertion}${fileContents.slice(arrayEnd)}`;
}

function findMatchingBracket(fileContents, startIndex, openChar, closeChar) {
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = startIndex; index < fileContents.length; index += 1) {
    const char = fileContents[index];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === openChar) {
      depth += 1;
      continue;
    }

    if (char === closeChar) {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  throw new Error(`Could not find matching ${closeChar} for export array.`);
}

function formatObjectLiteral(objectValue, indent) {
  const entries = Object.entries(objectValue).filter(([, value]) => {
    return value !== undefined && value !== null && value !== "";
  });

  const lines = [`${indent}{`];
  for (const [key, value] of entries) {
    lines.push(`${indent}  ${key}: ${formatValue(value)},`);
  }
  lines.push(`${indent}}`);
  return lines.join("\n");
}

function formatValue(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => formatValue(item)).join(", ")}]`;
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  throw new Error(`Unsupported value type in object literal: ${typeof value}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
});
