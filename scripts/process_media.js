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
const GALLERY_SECTION_VALUES = [
  "Squash",
  "Tech",
  "Flight",
  "Snowboard",
  "Life events",
  "none",
];
const TIMELINE_AREA_VALUES = [
  "Squash",
  "Motion Dynamics",
  "Snowboarding",
  "Paragliding",
  "Life events",
  "none",
];
const HIGHLIGHT_AREA_VALUES = [
  "Squash",
  "Motion Dynamics",
  "Snowboarding",
  "Paragliding",
  "Hobbies",
  "none",
];
const HIGHLIGHT_TAG_VALUES = [
  "qualification",
  "award",
  "project",
  "moment",
  "none",
];
const STYLE_GUIDE =
  "Write in a concise, polished voice that blends elite sport, coaching, and practical engineering. Favor short to mid-length sentences, concrete nouns, and repeatable-systems language over hype. Use occasional dry, self-aware wit when it feels natural, but keep the tone controlled and credible. Prefer compact blurbs with contextual dates when useful, and frame progress as measurable performance, judgment, and craft.";
const SYSTEM_PROMPT = `You are the autonomous content manager for Stuart MacGregor's website.\n\n${STYLE_GUIDE}\n\nUse first-person website voice. For personal sport and life updates, prefer "I" and "my". For Motion Dynamics or company updates, prefer "we" and "our". Never describe Stuart or Motion Dynamics in detached third-person language such as "they", "their", or "the team" unless another team is explicitly shown.\n\nFolder names and relative paths are context hints. Use them to infer what the asset is about when they are helpful, but do not mention internal folder names unless they are genuinely meaningful to the website copy.\n\nFor each item:\n1. Analyze the content.\n2. Write a human title that fits on a website card. Never reuse a raw filename, UUID, or hash as the title.\n3. Write concise website copy in the requested voice. Generate SEO alt text for images.\n4. Map the item to the correct site surfaces.\n\nSite mapping rules:\n- Every image or video should normally have a gallery_section so it appears in the media gallery.\n- Business, startup, pitch, product, engineering, or Motion Dynamics content should usually use gallery_section="Tech". If it marks a milestone or event, also use timeline_area="Motion Dynamics". If it should appear on the Work page, use highlight_area="Motion Dynamics".\n- Personal life updates should usually use gallery_section="Life events" and timeline_area="Life events".\n- Squash updates should use gallery_section="Squash" and timeline_area="Squash" only when they are notable milestones.\n- Snowboard updates should use gallery_section="Snowboard". Use timeline_area="Snowboarding" for milestones, and highlight_area="Snowboarding" only for qualifications or standout credentials.\n- Paragliding or flight updates should use gallery_section="Flight" and timeline_area="Paragliding" for milestones.\n- If a placement does not apply, return "none" for that placement field.\n\nYou MUST return your analysis as a strict JSON object matching this schema exactly. Do not output markdown code blocks, only raw, valid JSON:\n{\n  "updates": [\n    {\n      "filename": "original_filename.jpg",\n      "title": "Human website title",\n      "alt_text": "...",\n      "content_text": "Your website copy here",\n      "date": "YYYY-MM-DD",\n      "gallery_section": "Squash" | "Tech" | "Flight" | "Snowboard" | "Life events" | "none",\n      "timeline_area": "Squash" | "Motion Dynamics" | "Snowboarding" | "Paragliding" | "Life events" | "none",\n      "highlight_area": "Squash" | "Motion Dynamics" | "Snowboarding" | "Paragliding" | "Hobbies" | "none",\n      "highlight_tag": "qualification" | "award" | "project" | "moment" | "none"\n    }\n  ]\n}`;
const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    updates: {
      type: "array",
      items: {
        type: "object",
        properties: {
          filename: { type: "string" },
          title: { type: "string" },
          alt_text: { type: "string" },
          content_text: { type: "string" },
          date: { type: "string" },
          gallery_section: {
            type: "string",
            enum: GALLERY_SECTION_VALUES,
          },
          timeline_area: {
            type: "string",
            enum: TIMELINE_AREA_VALUES,
          },
          highlight_area: {
            type: "string",
            enum: HIGHLIGHT_AREA_VALUES,
          },
          highlight_tag: {
            type: "string",
            enum: HIGHLIGHT_TAG_VALUES,
          },
        },
        required: [
          "filename",
          "title",
          "alt_text",
          "content_text",
          "date",
          "gallery_section",
          "timeline_area",
          "highlight_area",
          "highlight_tag",
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
  const itemSummaries = new Map();
  const manifestByFilename = new Map(
    batchFiles.map((file) => [file.filename, file]),
  );

  for (const update of parsedResponse.updates) {
    const sourceFile = manifestByFilename.get(update.filename);
    const stableId = buildStableId(update.filename, update.date);
    const title = sanitizeGeneratedTitle(update.title, sourceFile?.filename);
    const inferredContext = inferContextFromPath(sourceFile);
    const gallerySection = resolvePlacement(
      update.gallery_section,
      inferredContext.gallerySection,
    );
    const timelineArea = resolvePlacement(
      update.timeline_area,
      inferredContext.timelineArea,
    );
    const highlightArea = resolvePlacement(
      update.highlight_area,
      inferredContext.highlightArea,
    );
    const highlightTag = resolveHighlightTag(
      update.highlight_tag,
      sourceFile,
      highlightArea,
    );

    if (!sourceFile) {
      throw new Error(`Gemini returned unknown filename: ${update.filename}`);
    }

    if (isImageOrVideo(sourceFile) && gallerySection !== "none") {
      const mediaAsset = buildMediaAsset(sourceFile, stableId);
      const currentMedia = fileStates.get(MEDIA_TS_PATH);

      if (
        hasSourceDateMarker(currentMedia, sourceFile.filename, update.date) ||
        hasExistingMarker(currentMedia, `src: ${JSON.stringify(mediaAsset.sitePath)}`)
      ) {
        skipped.push({
          destination: "media",
          filename: sourceFile.filename,
          reason: "Duplicate media entry detected.",
        });
      } else {
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
            title,
            alt: update.alt_text,
            section: gallerySection,
            caption: update.content_text,
            sourceFilename: sourceFile.filename,
            sourceDate: update.date,
            sourceMimeType: sourceFile.mimeType,
          },
        );

        fileStates.set(MEDIA_TS_PATH, nextMedia);
        touchedFiles.add(MEDIA_TS_PATH);
        appended.push({
          destination: "media",
          filename: sourceFile.filename,
          title,
          targetFile: path.relative(ROOT_DIR, MEDIA_TS_PATH),
          pages: getMediaPages(gallerySection, mediaAsset.type),
        });
        recordItemSummary(itemSummaries, {
          filename: sourceFile.filename,
          title,
          pages: getMediaPages(gallerySection, mediaAsset.type),
          placements: [`Media gallery (${gallerySection})`],
        });
        console.log(
          `Successfully appended ${sourceFile.filename} to content/media.ts`,
        );
      }
    }

    if (timelineArea !== "none") {
      const currentTimeline = fileStates.get(TIMELINE_TS_PATH);

      if (
        hasSourceDateMarker(currentTimeline, sourceFile.filename, update.date)
      ) {
        skipped.push({
          destination: "timeline",
          filename: sourceFile.filename,
          reason: "Duplicate timeline entry detected.",
        });
      } else {
        const nextTimeline = insertIntoExportedArray(
          currentTimeline,
          "timeline",
          {
            year: update.date.slice(0, 4),
            area: timelineArea,
            title,
            meta: update.date,
            description: update.content_text,
            sourceFilename: sourceFile.filename,
            sourceDate: update.date,
          },
        );

        fileStates.set(TIMELINE_TS_PATH, nextTimeline);
        touchedFiles.add(TIMELINE_TS_PATH);
        appended.push({
          destination: "timeline",
          filename: sourceFile.filename,
          title,
          targetFile: path.relative(ROOT_DIR, TIMELINE_TS_PATH),
          pages: ["/about"],
        });
        recordItemSummary(itemSummaries, {
          filename: sourceFile.filename,
          title,
          pages: ["/about"],
          placements: [`Timeline (${timelineArea})`],
        });
        console.log(
          `Successfully appended ${sourceFile.filename} to content/timeline.ts`,
        );
      }
    }

    if (highlightArea !== "none") {
      const currentHighlights = fileStates.get(HIGHLIGHTS_TS_PATH);
      if (hasSourceDateMarker(currentHighlights, sourceFile.filename, update.date)) {
        skipped.push({
          destination: "highlights",
          filename: sourceFile.filename,
          reason: "Duplicate highlight entry detected.",
        });
      } else {
        const nextHighlights = insertIntoExportedArray(
          currentHighlights,
          "highlights",
          {
            id: stableId,
            area: highlightArea,
            title,
            meta: update.date,
            description: update.content_text,
            date: update.date,
            tag: highlightTag,
            sourceFilename: sourceFile.filename,
            sourceDate: update.date,
          },
        );

        fileStates.set(HIGHLIGHTS_TS_PATH, nextHighlights);
        touchedFiles.add(HIGHLIGHTS_TS_PATH);
        appended.push({
          destination: "highlights",
          filename: sourceFile.filename,
          title,
          targetFile: path.relative(ROOT_DIR, HIGHLIGHTS_TS_PATH),
          pages: getHighlightPages(highlightArea, highlightTag),
        });
        recordItemSummary(itemSummaries, {
          filename: sourceFile.filename,
          title,
          pages: getHighlightPages(highlightArea, highlightTag),
          placements: [`Highlights (${highlightArea})`],
        });
        console.log(
          `Successfully appended ${sourceFile.filename} to content/highlights.ts`,
        );
      }
    }
  }

  for (const filePath of touchedFiles) {
    fs.writeFileSync(filePath, fileStates.get(filePath));
  }

  const summary = {
    model: GEMINI_MODEL,
    appended,
    skipped,
    copiedAssets,
    items: [...itemSummaries.values()].map((item) => ({
      filename: item.filename,
      title: item.title,
      pages: [...item.pages].sort(),
      placements: [...item.placements],
    })),
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
          const relativePath = file.localRelativePath || file.filename;
          const folderContext = path.posix.dirname(relativePath);
          return `${index + 1}. filename=\"${file.filename}\", relativePath=\"${relativePath}\", folderContext=\"${folderContext === "." ? "" : folderContext}\", mimeType=\"${file.mimeType}\", originalMimeType=\"${file.originalMimeType}\", sourceDate=\"${sourceDate}\"`;
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
        text: `Text file: ${file.filename}\nRelative path: ${file.localRelativePath || file.filename}\nMIME type: ${file.mimeType}\nContents:\n${truncatedText}`,
      });
      continue;
    }

    const binary = fs.readFileSync(file.absolutePath);
    parts.push({
      text: `Binary file: ${file.filename}\nRelative path: ${file.localRelativePath || file.filename}\nMIME type: ${file.mimeType}`,
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

  const knownFilenames = new Set(batchFiles.map((file) => file.filename));
  const seenFilenames = new Set();

  for (const update of payload.updates) {
    if (!update || typeof update !== "object" || Array.isArray(update)) {
      throw new Error("Each update must be an object.");
    }

    for (const field of [
      "filename",
      "title",
      "alt_text",
      "content_text",
      "date",
      "gallery_section",
      "timeline_area",
      "highlight_area",
      "highlight_tag",
    ]) {
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

    if (!GALLERY_SECTION_VALUES.includes(update.gallery_section)) {
      throw new Error(`Invalid gallery_section for ${update.filename}.`);
    }

    if (!TIMELINE_AREA_VALUES.includes(update.timeline_area)) {
      throw new Error(`Invalid timeline_area for ${update.filename}.`);
    }

    if (!HIGHLIGHT_AREA_VALUES.includes(update.highlight_area)) {
      throw new Error(`Invalid highlight_area for ${update.filename}.`);
    }

    if (!HIGHLIGHT_TAG_VALUES.includes(update.highlight_tag)) {
      throw new Error(`Invalid highlight_tag for ${update.filename}.`);
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

function hasSourceDateMarker(fileContents, filename, isoDate) {
  return (
    hasExistingMarker(fileContents, `sourceFilename: ${JSON.stringify(filename)}`) &&
    hasExistingMarker(fileContents, `sourceDate: ${JSON.stringify(isoDate)}`)
  );
}

function insertIntoExportedArray(fileContents, exportName, objectValue) {
  const markerMatch = fileContents.match(
    new RegExp(`export const\\s+${escapeRegex(exportName)}\\s*(?::|=)`),
  );
  if (!markerMatch || markerMatch.index === undefined) {
    throw new Error(`Could not find export ${exportName}.`);
  }
  const markerIndex = markerMatch.index;

  const assignmentIndex = fileContents.indexOf("=", markerIndex);
  if (assignmentIndex === -1) {
    throw new Error(`Could not locate assignment for export ${exportName}.`);
  }

  const arrayStart = fileContents.indexOf("[", assignmentIndex);
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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sanitizeGeneratedTitle(title, fallbackFilename) {
  const normalized = (title || "").replace(/\s+/g, " ").trim();
  const fallbackTitle = humanizeFilename(fallbackFilename || "update");

  if (!normalized) {
    return fallbackTitle;
  }

  const fallbackStem = path.basename(fallbackFilename || "", path.extname(fallbackFilename || ""));
  const looksLikeUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(normalized);
  const looksLikeFallbackStem =
    fallbackStem &&
    normalized.replace(/\s+/g, "-").toLowerCase() === fallbackStem.toLowerCase();

  if (looksLikeUuid || looksLikeFallbackStem) {
    return fallbackTitle;
  }

  return normalized;
}

function inferContextFromPath(file) {
  const haystack = `${file.localRelativePath || ""} ${file.filename || ""}`.toLowerCase();

  if (/(venturefest|pitchup|motion dynamics|pitch|startup|business|investor|product|demo|tech)/.test(haystack)) {
    return {
      gallerySection: "Tech",
      timelineArea: "Motion Dynamics",
      highlightArea: "Motion Dynamics",
    };
  }

  if (/(snow|snowboard|casi|park)/.test(haystack)) {
    return {
      gallerySection: "Snowboard",
      timelineArea: "Snowboarding",
      highlightArea: "none",
    };
  }

  if (/(flight|paraglid|wing|launch)/.test(haystack)) {
    return {
      gallerySection: "Flight",
      timelineArea: "Paragliding",
      highlightArea: "none",
    };
  }

  if (/(squash|psa|tournament|open|match|court)/.test(haystack)) {
    return {
      gallerySection: "Squash",
      timelineArea: "Squash",
      highlightArea: "none",
    };
  }

  return {
    gallerySection: isImageOrVideo(file) ? "Life events" : "none",
    timelineArea: "Life events",
    highlightArea: "none",
  };
}

function resolvePlacement(value, fallback) {
  return value && value !== "none" ? value : fallback || "none";
}

function resolveHighlightTag(value, sourceFile, highlightArea) {
  if (highlightArea === "none") {
    return "none";
  }

  if (value && value !== "none") {
    return value;
  }

  if (highlightArea === "Motion Dynamics") {
    return isTextLike(sourceFile) ? "project" : "moment";
  }

  if (highlightArea === "Snowboarding") {
    return "qualification";
  }

  return isTextLike(sourceFile) ? "project" : "moment";
}

function getMediaPages(section, type) {
  const pages = new Set(["/media"]);

  if (section === "Tech") {
    pages.add("/work");
  }

  if (section === "Snowboard" && type === "video") {
    pages.add("/snowboard");
  }

  if (section === "Squash") {
    pages.add("/sport");
  }

  return [...pages];
}

function getHighlightPages(area, tag) {
  const pages = new Set();

  if (area === "Motion Dynamics") {
    pages.add("/work");
  }

  if (area === "Snowboarding" && tag === "qualification") {
    pages.add("/snowboard");
  }

  return [...pages];
}

function recordItemSummary(store, summary) {
  const existing = store.get(summary.filename) || {
    filename: summary.filename,
    title: summary.title,
    pages: new Set(),
    placements: new Set(),
  };

  existing.title = summary.title;
  for (const page of summary.pages || []) {
    existing.pages.add(page);
  }
  for (const placement of summary.placements || []) {
    existing.placements.add(placement);
  }

  store.set(summary.filename, existing);
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
