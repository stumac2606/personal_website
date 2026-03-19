#!/usr/bin/env node
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const ROOT_DIR = process.cwd();
const TEMP_MEDIA_DIR = path.join(ROOT_DIR, "temp_media");
const MANIFEST_PATH = path.join(TEMP_MEDIA_DIR, "manifest.json");
const RESULTS_PATH = path.join(TEMP_MEDIA_DIR, "process-results.json");
const MEDIA_TS_PATH = path.join(ROOT_DIR, "content", "media.ts");
const TIMELINE_TS_PATH = path.join(ROOT_DIR, "content", "timeline.ts");
const HIGHLIGHTS_TS_PATH = path.join(ROOT_DIR, "content", "highlights.ts");
const PAGE_SECTIONS_TS_PATH = path.join(ROOT_DIR, "content", "pageSections.ts");
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
  "Life in Motion",
  "none",
];
const TIMELINE_AREA_VALUES = [
  "Squash",
  "Motion Dynamics",
  "Snowboarding",
  "Paragliding",
  "Life in Motion",
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
const FEATURE_FLAG_VALUES = ["yes", "no"];
const PAGE_KEY_VALUES = [
  "home",
  "work",
  "sport",
  "snowboard",
  "about",
  "contact",
  "none",
];
const STYLE_GUIDE =
  "Write in a concise, polished voice that blends elite sport, coaching, and practical engineering. Favor short to mid-length sentences, concrete nouns, and repeatable-systems language over hype. Use occasional dry, self-aware wit when it feels natural, but keep the tone controlled and credible. Prefer compact blurbs with contextual dates when useful, and frame progress as measurable performance, judgment, and craft.";
const BRAND_GUIDE =
  "Stuart MacGregor's brand sits at the intersection of elite sport, practical engineering, and coaching clarity. Position him as a credible operator: former professional athlete, founder-engineer, and instructor who turns movement into measurable, repeatable systems. Keep the voice lean, commercially credible, and grounded in lived performance, biomechanics, feedback loops, and useful insight rather than generic inspiration or startup hype. When the subject is Motion Dynamics, connect the copy to coaches, athletes, movement data, product proof, and better decisions.";
const SYSTEM_PROMPT = `You are the autonomous content manager for Stuart MacGregor's website.\n\n${STYLE_GUIDE}\n\n${BRAND_GUIDE}\n\nUse first-person website voice. For personal sport, instruction, and life updates, prefer "I" and "my". For Motion Dynamics, product, and company updates, prefer "we" and "our". Never describe Stuart or Motion Dynamics in detached third-person language such as "they", "their", "the company", or "the team" unless another team is explicitly shown in the source context.\n\nEditorial rules:\n- Write publishable website copy, not notes or captions for internal review.\n- Titles must be specific, human, and commercially credible. Prefer 2 to 8 words.\n- Never reuse a raw filename, UUID, hash, or a generic label such as "Team photo", "Image", "Video", "Presentation", or "Update" unless the source context clearly justifies it.\n- If a folder or relative path contains a meaningful event, place, competition, product, or clip title, use that as context for the title and copy.\n- Avoid vague or inflated phrases such as "key performance indicator", "outreach and networking strategy", "cutting-edge", "game-changing", "world-class", "revolutionary", or empty motivational language.\n- Business copy should sound like product proof and operator judgement, not startup theatre.\n- Personal copy should sound like lived experience, progression, craft, and clear standards.\n- content_text must usually be a single sentence.\n- Keep content_text short: target 8 to 18 words, and do not exceed 24 words unless absolutely necessary.\n- Do not repeat the full event name, date, or location in content_text if it already appears in the title or metadata.\n- If multiple assets come from the same folder, treat them as one event or story beat and keep naming consistent across the batch.\n\nFolder names, relative paths, and sidecar text files are context hints. Use them aggressively when they are meaningful, especially for videos and batched uploads. Do not mention internal folder names unless they improve the public website copy.\n\nFor each item:\n1. Analyze the content and path context.\n2. Write a human title that fits on a website card.\n3. Write concise website copy in the requested voice. Generate SEO alt text for images.\n4. Map the item to the correct site surfaces.\n\nSite mapping rules:\n- Every image or video should normally have a gallery_section so it appears in the media gallery.\n- Business, startup, product, engineering, golf-analysis, or Motion Dynamics content should usually use gallery_section="Tech". Use page_key and page_section_* to place those media items on the work page, even when they do not need any written summary card above the gallery.
- Only set timeline_area or highlight_area when the upload is clearly a noteworthy milestone, launch, pitch, competition result, award, or event that deserves a separate written summary block. Routine gallery additions should return "none" for both fields.
- Use page_key="work" and page_section_key="motion-dynamics" for general company items that do not need a more specific subsection.
- Use a more specific page_section_key such as "golf-analysis" when the upload clearly represents a distinct product or analysis stream, but keep timeline_area and highlight_area as "none" unless the source context explicitly justifies a summary card.
- Return page_key="home" when the content should become a homepage section, page_key="sport" for the sport page, page_key="snowboard" for the snowboard page, page_key="about" for the about page, and page_key="contact" only when the content is genuinely about contact, bookings, or availability.
- Only set feature_on_homepage="yes" when the sidecar note explicitly asks for homepage highlight placement or the source context clearly says it should also be featured on the homepage. Default to "no".
- When feature_on_homepage="yes", provide homepage_feature_title and homepage_feature_text as a tighter homepage summary than the main page version.
- Personal life updates should usually use gallery_section="Life in Motion" and timeline_area="Life in Motion" only when they are notable milestones; otherwise return "none" for timeline_area and highlight_area.
- Squash updates should use gallery_section="Squash" and timeline_area="Squash" only when they are notable milestones.
- Snowboard updates should use gallery_section="Snowboard". Use timeline_area="Snowboarding" for milestones, and highlight_area="Snowboarding" only for qualifications or standout credentials.
- Paragliding or flight updates should use gallery_section="Flight" and timeline_area="Paragliding" for milestones.
- For items that do not need a dynamic page section, return "none" for page_key, page_section_key, page_section_title, and page_section_intro.
- When feature_on_homepage="no", return "none" for homepage_feature_title and homepage_feature_text.
- If a placement does not apply, return "none" for that placement field.\n\nYou MUST return your analysis as a strict JSON object matching this schema exactly. Do not output markdown code blocks, only raw, valid JSON:\n{\n  "updates": [\n    {\n      "filename": "original_filename.jpg",\n      "title": "Human website title",\n      "alt_text": "...",\n      "content_text": "Your website copy here",\n      "date": "YYYY-MM-DD",\n      "gallery_section": "Squash" | "Tech" | "Flight" | "Snowboard" | "Life in Motion" | "none",\n      "timeline_area": "Squash" | "Motion Dynamics" | "Snowboarding" | "Paragliding" | "Life in Motion" | "none",\n      "highlight_area": "Squash" | "Motion Dynamics" | "Snowboarding" | "Paragliding" | "Hobbies" | "none",\n      "highlight_tag": "qualification" | "award" | "project" | "moment" | "none",\n      "feature_on_homepage": "yes" | "no",\n      "homepage_feature_title": "Short homepage title" | "none",\n      "homepage_feature_text": "Short homepage summary" | "none",\n      "page_key": "home" | "work" | "sport" | "snowboard" | "about" | "contact" | "none",\n      "page_section_key": "motion-dynamics" | "golf-analysis" | "other-slug" | "none",\n      "page_section_title": "Motion Dynamics" | "Golf Analysis" | "Other Title" | "none",\n      "page_section_intro": "Short section intro" | "none"\n    }\n  ]\n}`;
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
          feature_on_homepage: {
            type: "string",
            enum: FEATURE_FLAG_VALUES,
          },
          homepage_feature_title: { type: "string" },
          homepage_feature_text: { type: "string" },
          page_key: {
            type: "string",
            enum: PAGE_KEY_VALUES,
          },
          page_section_key: { type: "string" },
          page_section_title: { type: "string" },
          page_section_intro: { type: "string" },
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
          "feature_on_homepage",
          "homepage_feature_title",
          "homepage_feature_text",
          "page_key",
          "page_section_key",
          "page_section_title",
          "page_section_intro",
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
  }).sort((left, right) => left.localRelativePath.localeCompare(right.localRelativePath));

  const batchContext = buildBatchContext(batchFiles);
  const processableFiles = batchFiles.filter(
    (file) => !batchContext.contextOnlyFiles.has(file.localRelativePath),
  );

  const duplicateNames = findDuplicateNames(
    processableFiles.map((file) => file.filename),
  );
  if (duplicateNames.length > 0) {
    throw new Error(
      `Duplicate filenames in batch are not supported: ${duplicateNames.join(", ")}`,
    );
  }

  if (processableFiles.length === 0) {
    const summary = {
      model: GEMINI_MODEL,
      appended: [],
      skipped: [],
      copiedAssets: [],
      items: [],
      modifiedFiles: [],
    };
    fs.writeFileSync(RESULTS_PATH, `${JSON.stringify(summary, null, 2)}\n`);
    console.log("No processable files remained after applying folder note context.");
    return;
  }

  console.log(`Sending ${processableFiles.length} files to Gemini.`);
  console.log("Dispatching Gemini API request...");
  const rawGeminiResponse = await sendGeminiRequest(processableFiles, batchContext);
  console.log("Received Gemini API response.");
  console.log(
    "Raw Gemini response JSON:",
    JSON.stringify(rawGeminiResponse, null, 2),
  );

  const responseText = extractGeminiText(rawGeminiResponse);
  const parsedResponse = JSON.parse(responseText);
  validateGeminiResponse(parsedResponse, processableFiles);

  const mediaState = fs.readFileSync(MEDIA_TS_PATH, "utf8");
  const timelineState = fs.readFileSync(TIMELINE_TS_PATH, "utf8");
  const highlightsState = fs.readFileSync(HIGHLIGHTS_TS_PATH, "utf8");
  const pageSectionsState = fs.readFileSync(PAGE_SECTIONS_TS_PATH, "utf8");
  const fileStates = new Map([
    [MEDIA_TS_PATH, mediaState],
    [TIMELINE_TS_PATH, timelineState],
    [HIGHLIGHTS_TS_PATH, highlightsState],
    [PAGE_SECTIONS_TS_PATH, pageSectionsState],
  ]);
  const touchedFiles = new Set();
  const appended = [];
  const skipped = [];
  const copiedAssets = [];
  const itemSummaries = new Map();
  const createdTimelineEvents = new Set();
  const createdHighlightEvents = new Set();
  const createdHomepageFeatureEvents = new Set();
  const manifestByFilename = new Map(
    processableFiles.map((file) => [file.filename, file]),
  );

  for (const update of parsedResponse.updates) {
    const sourceFile = manifestByFilename.get(update.filename);
    const stableId = buildStableId(update.filename, update.date);
    const inferredContext = inferContextFromPath(sourceFile);
    const sourceFolder = getSourceFolder(sourceFile);
    const brandContext = getBrandContext(inferredContext);
    const title = sanitizeGeneratedTitle(
      update.title,
      sourceFile?.filename,
      sourceFile?.localRelativePath,
    );
    const contentText = normalizeGeneratedCopy(
      update.content_text,
      brandContext,
      title,
    );
    const altText = normalizeAltText(update.alt_text, title, brandContext);
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
    const pageKey = resolvePageKey(
      update.page_key,
      sourceFile,
      gallerySection,
      timelineArea,
      highlightArea,
    );
    const pageSectionKey = resolvePageSectionKey(
      update.page_section_key,
      pageKey,
      sourceFile,
      gallerySection,
      highlightArea,
    );
    const pageSectionTitle = resolvePageSectionTitle(
      update.page_section_title,
      pageSectionKey,
      title,
    );
    const pageSectionIntro = resolvePageSectionIntro(
      update.page_section_intro,
      pageSectionKey,
      pageSectionTitle,
      brandContext,
    );
    const featureOnHomepage = update.feature_on_homepage === "yes";
    const homepageFeatureTitle = sanitizeHomepageFeatureTitle(
      update.homepage_feature_title,
      title,
    );
    const homepageFeatureText = normalizeHomepageFeatureText(
      update.homepage_feature_text,
      contentText,
      brandContext,
      homepageFeatureTitle,
    );

    if (!sourceFile) {
      throw new Error(`Gemini returned unknown filename: ${update.filename}`);
    }

    if (pageKey !== "none" && pageSectionKey !== "none") {
      const currentPageSections = fileStates.get(PAGE_SECTIONS_TS_PATH);
      if (!hasPageSection(currentPageSections, pageKey, pageSectionKey)) {
        const nextPageSections = insertIntoExportedArray(
          currentPageSections,
          "dynamicPageSections",
          {
            page: pageKey,
            key: pageSectionKey,
            title: pageSectionTitle,
            intro: pageSectionIntro,
            order: 50,
          },
        );

        fileStates.set(PAGE_SECTIONS_TS_PATH, nextPageSections);
        touchedFiles.add(PAGE_SECTIONS_TS_PATH);
        console.log(
          `Successfully appended ${pageSectionKey} to content/pageSections.ts`,
        );
      }
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
            alt: altText,
            section: gallerySection,
            pageKey: pageKey !== "none" ? pageKey : undefined,
            pageSectionKey: pageSectionKey !== "none" ? pageSectionKey : undefined,
            pageSectionTitle:
              pageSectionKey !== "none" ? pageSectionTitle : undefined,
            pageSectionIntro:
              pageSectionKey !== "none" ? pageSectionIntro : undefined,
            caption: contentText,
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
          pages: getMediaPages(gallerySection, mediaAsset.type, pageKey),
        });
        recordItemSummary(itemSummaries, {
          filename: sourceFile.filename,
          title,
          pages: getMediaPages(gallerySection, mediaAsset.type, pageKey),
          placements: [
            `Media gallery (${gallerySection})`,
            ...(pageSectionKey !== "none"
              ? [`${pageKey} section (${pageSectionTitle})`]
              : []),
          ],
        });
        console.log(
          `Successfully appended ${sourceFile.filename} to content/media.ts`,
        );
      }
    }

    if (timelineArea !== "none") {
      const currentTimeline = fileStates.get(TIMELINE_TS_PATH);
      const timelineEventKey = buildPlacementEventKey(
        "timeline",
        timelineArea,
        update.date,
        sourceFolder,
        sourceFile,
      );

      if (
        hasSourceDateMarker(currentTimeline, sourceFile.filename, update.date) ||
        hasExistingFolderEvent(currentTimeline, sourceFolder, update.date) ||
        createdTimelineEvents.has(timelineEventKey)
      ) {
        skipped.push({
          destination: "timeline",
          filename: sourceFile.filename,
          reason: "Duplicate timeline entry detected for this event.",
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
            description: contentText,
            pageKey: pageKey !== "none" ? pageKey : undefined,
            pageSectionKey: pageSectionKey !== "none" ? pageSectionKey : undefined,
            pageSectionTitle:
              pageSectionKey !== "none" ? pageSectionTitle : undefined,
            pageSectionIntro:
              pageSectionKey !== "none" ? pageSectionIntro : undefined,
            sourceFilename: sourceFile.filename,
            sourceDate: update.date,
            sourceFolder,
          },
        );

        fileStates.set(TIMELINE_TS_PATH, nextTimeline);
        touchedFiles.add(TIMELINE_TS_PATH);
        createdTimelineEvents.add(timelineEventKey);
        appended.push({
          destination: "timeline",
          filename: sourceFile.filename,
          title,
          targetFile: path.relative(ROOT_DIR, TIMELINE_TS_PATH),
          pages: getTimelinePages(pageKey),
        });
        recordItemSummary(itemSummaries, {
          filename: sourceFile.filename,
          title,
          pages: getTimelinePages(pageKey),
          placements: [
            `Timeline (${timelineArea})`,
            ...(pageSectionKey !== "none"
              ? [`${pageKey} section (${pageSectionTitle})`]
              : []),
          ],
        });
        console.log(
          `Successfully appended ${sourceFile.filename} to content/timeline.ts`,
        );
      }
    }

    if (highlightArea !== "none") {
      const currentHighlights = fileStates.get(HIGHLIGHTS_TS_PATH);
      const highlightEventKey = buildPlacementEventKey(
        "highlights",
        highlightArea,
        update.date,
        sourceFolder,
        sourceFile,
      );
      if (
        hasSourceDateMarker(currentHighlights, sourceFile.filename, update.date) ||
        hasExistingFolderEvent(currentHighlights, sourceFolder, update.date) ||
        createdHighlightEvents.has(highlightEventKey)
      ) {
        skipped.push({
          destination: "highlights",
          filename: sourceFile.filename,
          reason: "Duplicate highlight entry detected for this event.",
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
            description: contentText,
            date: update.date,
            tag: highlightTag,
            sourcePlacement: "primary",
            pageKey: pageKey !== "none" ? pageKey : undefined,
            pageSectionKey: pageSectionKey !== "none" ? pageSectionKey : undefined,
            pageSectionTitle:
              pageSectionKey !== "none" ? pageSectionTitle : undefined,
            pageSectionIntro:
              pageSectionKey !== "none" ? pageSectionIntro : undefined,
            sourceFilename: sourceFile.filename,
            sourceDate: update.date,
            sourceFolder,
          },
        );

        fileStates.set(HIGHLIGHTS_TS_PATH, nextHighlights);
        touchedFiles.add(HIGHLIGHTS_TS_PATH);
        createdHighlightEvents.add(highlightEventKey);
        appended.push({
          destination: "highlights",
          filename: sourceFile.filename,
          title,
          targetFile: path.relative(ROOT_DIR, HIGHLIGHTS_TS_PATH),
          pages: getHighlightPages(highlightArea, highlightTag, pageKey),
        });
        recordItemSummary(itemSummaries, {
          filename: sourceFile.filename,
          title,
          pages: getHighlightPages(highlightArea, highlightTag, pageKey),
          placements: [
            `Highlights (${highlightArea})`,
            ...(pageSectionKey !== "none"
              ? [`${pageKey} section (${pageSectionTitle})`]
              : []),
          ],
        });
        console.log(
          `Successfully appended ${sourceFile.filename} to content/highlights.ts`,
        );
      }
    }

    if (highlightArea !== "none" && featureOnHomepage) {
      const currentHighlights = fileStates.get(HIGHLIGHTS_TS_PATH);
      const homepageFeatureKey = buildPlacementEventKey(
        "highlights-home-feature",
        highlightArea,
        update.date,
        sourceFolder,
        sourceFile,
      );

      if (
        hasExistingHighlightPlacement(
          currentHighlights,
          "home-feature",
          sourceFile.filename,
          update.date,
          sourceFolder,
        ) ||
        createdHomepageFeatureEvents.has(homepageFeatureKey)
      ) {
        skipped.push({
          destination: "homepage-highlight",
          filename: sourceFile.filename,
          reason: "Duplicate homepage highlight detected for this event.",
        });
      } else {
        const nextHighlights = insertIntoExportedArray(
          currentHighlights,
          "highlights",
          {
            id: `${stableId}-home`,
            area: highlightArea,
            title: homepageFeatureTitle,
            meta: update.date,
            description: homepageFeatureText,
            date: update.date,
            tag: highlightTag,
            featured: true,
            sourcePlacement: "home-feature",
            sourceFilename: sourceFile.filename,
            sourceDate: update.date,
            sourceFolder,
          },
        );

        fileStates.set(HIGHLIGHTS_TS_PATH, nextHighlights);
        touchedFiles.add(HIGHLIGHTS_TS_PATH);
        createdHomepageFeatureEvents.add(homepageFeatureKey);
        appended.push({
          destination: "homepage-highlight",
          filename: sourceFile.filename,
          title: homepageFeatureTitle,
          targetFile: path.relative(ROOT_DIR, HIGHLIGHTS_TS_PATH),
          pages: ["/"],
        });
        recordItemSummary(itemSummaries, {
          filename: sourceFile.filename,
          title,
          pages: ["/"],
          placements: ["Homepage highlight"],
        });
        console.log(
          `Successfully appended homepage feature for ${sourceFile.filename} to content/highlights.ts`,
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

function buildBatchContext(batchFiles) {
  const folders = new Map();

  for (const file of batchFiles) {
    const folderKey = getSourceFolder(file);
    const current = folders.get(folderKey) || {
      mediaFiles: [],
      textFiles: [],
    };

    if (isTextLike(file)) {
      current.textFiles.push(file);
    } else {
      current.mediaFiles.push(file);
    }

    folders.set(folderKey, current);
  }

  const contextOnlyFiles = new Set();
  const folderNotesByFolder = new Map();

  for (const [folderKey, value] of folders.entries()) {
    if (value.mediaFiles.length === 0 || value.textFiles.length === 0) {
      continue;
    }

    const noteParts = value.textFiles.map((file) => {
      const textContent = readTextLikeFile(file).trim();
      const concise = textContent.length > 2000
        ? `${textContent.slice(0, 2000)}\n[TRUNCATED]`
        : textContent;
      contextOnlyFiles.add(file.localRelativePath);
      return `Note from ${file.filename}:\n${concise}`;
    });

    folderNotesByFolder.set(folderKey, noteParts.join("\n\n"));
  }

  return {
    contextOnlyFiles,
    folderNotesByFolder,
  };
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
    [".txt", ".md", ".markdown", ".json", ".csv", ".docx"].includes(
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

async function sendGeminiRequest(batchFiles, batchContext) {
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
        "If a file is text, use the supplied text content.",
        "If a file is an image, inspect the supplied image data and path context.",
        "If a file is a video, rely on the relative path, folder title, and filename as the primary source of truth. Do not invent frame-level details that are not explicit in that context.",
      ].join("\n"),
    },
  ];

  for (const file of batchFiles) {
    const folderNotes = batchContext.folderNotesByFolder.get(
      getSourceFolder(file),
    );

    if (isTextLike(file)) {
      const textContent = readTextLikeFile(file);
      const normalizedText = textContent.trim();
      const truncatedText = normalizedText.length > 40000
        ? `${normalizedText.slice(0, 40000)}\n[TRUNCATED FOR BATCH LIMITS]`
        : normalizedText;

      parts.push({
        text: `Text file: ${file.filename}\nRelative path: ${file.localRelativePath || file.filename}\nMIME type: ${file.mimeType}\nContents:\n${truncatedText}`,
      });
      continue;
    }

    const folderTitleHint = extractDescriptiveFolderName(file.localRelativePath);

    if (isVideoFile(file)) {
      parts.push({
        text: `Video file: ${file.filename}\nRelative path: ${file.localRelativePath || file.filename}\nFolder title hint: ${folderTitleHint || "none"}\nMIME type: ${file.mimeType}\n${folderNotes ? `Folder notes:\n${folderNotes}\n` : ""}Use the folder title hint, sidecar notes, and relative path as the primary context for title, copy, and placement. Do not rely on unseen video frames.`,
      });
      continue;
    }

    const binary = fs.readFileSync(file.absolutePath);
    parts.push({
      text: `Binary file: ${file.filename}\nRelative path: ${file.localRelativePath || file.filename}\nFolder title hint: ${folderTitleHint || "none"}\nMIME type: ${file.mimeType}\n${folderNotes ? `Folder notes:\n${folderNotes}` : ""}`,
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
        temperature: 0.1,
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
      "feature_on_homepage",
      "homepage_feature_title",
      "homepage_feature_text",
      "page_key",
      "page_section_key",
      "page_section_title",
      "page_section_intro",
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

    if (!FEATURE_FLAG_VALUES.includes(update.feature_on_homepage)) {
      throw new Error(`Invalid feature_on_homepage for ${update.filename}.`);
    }

    if (!PAGE_KEY_VALUES.includes(update.page_key)) {
      throw new Error(`Invalid page_key for ${update.filename}.`);
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

function readTextLikeFile(file) {
  const extension = path.extname(file.absolutePath).toLowerCase();

  if (extension === ".docx") {
    try {
      const xml = execFileSync(
        "unzip",
        ["-p", file.absolutePath, "word/document.xml"],
        { encoding: "utf8" },
      );

      return xml
        .replace(/<w:p[^>]*>/g, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+\n/g, "\n")
        .replace(/\n\s+/g, "\n")
        .replace(/[ \t]+/g, " ")
        .trim();
    } catch {
      return humanizeFilename(file.filename);
    }
  }

  return fs.readFileSync(file.absolutePath, "utf8");
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

function hasPageSection(fileContents, pageKey, pageSectionKey) {
  return hasExistingMarker(
    fileContents,
    `page: ${JSON.stringify(pageKey)}`,
  ) && hasExistingMarker(
    fileContents,
    `key: ${JSON.stringify(pageSectionKey)}`,
  );
}

function hasSourceDateMarker(fileContents, filename, isoDate) {
  return (
    hasExistingMarker(fileContents, `sourceFilename: ${JSON.stringify(filename)}`) &&
    hasExistingMarker(fileContents, `sourceDate: ${JSON.stringify(isoDate)}`)
  );
}

function hasExistingHighlightPlacement(
  fileContents,
  sourcePlacement,
  filename,
  isoDate,
  sourceFolder,
) {
  const hasPlacement = hasExistingMarker(
    fileContents,
    `sourcePlacement: ${JSON.stringify(sourcePlacement)}`,
  );

  if (!hasPlacement) {
    return false;
  }

  if (filename && hasSourceDateMarker(fileContents, filename, isoDate)) {
    return true;
  }

  if (sourceFolder && hasExistingFolderEvent(fileContents, sourceFolder, isoDate)) {
    return true;
  }

  return false;
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

function sanitizeGeneratedTitle(title, fallbackFilename, relativePath) {
  const normalized = (title || "").replace(/\s+/g, " ").trim();
  const fallbackTitle =
    extractDescriptiveFolderName(relativePath) ||
    humanizeFilename(fallbackFilename || "update");

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

  if (
    /^(image|photo|video|clip|presentation|update|team photo|group photo)$/i.test(
      normalized,
    )
  ) {
    return fallbackTitle;
  }

  return normalized;
}

function getSourceFolder(file) {
  if (!file) {
    return "";
  }

  const relativePath = normalizePath(file.localRelativePath || "");
  const directory = path.posix.dirname(relativePath);
  return directory === "." ? "" : directory;
}

function extractDescriptiveFolderName(relativePath) {
  const normalizedPath = normalizePath(relativePath || "");
  const directory = path.posix.dirname(normalizedPath);

  if (!directory || directory === ".") {
    return "";
  }

  const segments = directory
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (!lastSegment || /^(images?|videos?|uploads?|temp_media)$/i.test(lastSegment)) {
    return "";
  }

  return humanizeFilename(lastSegment).replace(/\bAnd\b/g, "and");
}

function getBrandContext(inferredContext) {
  if (
    inferredContext.highlightArea === "Motion Dynamics" ||
    inferredContext.timelineArea === "Motion Dynamics" ||
    inferredContext.gallerySection === "Tech"
  ) {
    return "company";
  }

  return "personal";
}

function normalizeGeneratedCopy(text, brandContext, title) {
  const cleaned = (text || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\.{2,}/g, ".")
    .trim();

  let normalized = cleaned;
  const replacements = [
    [/\bkey performance indicator\b/gi, "useful marker"],
    [/\boutreach and networking strategy\b/gi, "commercial progress"],
    [/\bcutting-edge\b/gi, "practical"],
    [/\bgame-changing\b/gi, "meaningful"],
    [/\bworld-class\b/gi, "high-standard"],
    [/\brevolutionary\b/gi, "useful"],
  ];

  for (const [pattern, value] of replacements) {
    normalized = normalized.replace(pattern, value);
  }

  if (title) {
    const titlePattern = new RegExp(`^${escapeRegex(title)}[:\\-.,\\s]+`, "i");
    normalized = normalized.replace(titlePattern, "");
  }

  if (brandContext === "company") {
    normalized = normalized
      .replace(/\b[Tt]he team\b/g, "our team")
      .replace(/\b[Tt]he company\b/g, "we")
      .replace(/\b[Tt]heir\b/g, "our")
      .replace(/\b[Tt]hem\b/g, "us")
      .replace(/\b[Tt]hey\b/g, "we");
  }

  normalized = normalized
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)[0] || normalized;

  normalized = shortenToWordLimit(normalized, 22);
  normalized = normalized.replace(/\s+/g, " ").trim();

  if (normalized && !/[.!?]$/.test(normalized)) {
    normalized = `${normalized}.`;
  }

  return normalized.trim();
}

function normalizeAltText(text, title, brandContext) {
  const cleaned = normalizeGeneratedCopy(text, brandContext);
  if (!cleaned) {
    return title;
  }
  return cleaned;
}

function sanitizeHomepageFeatureTitle(value, fallbackTitle) {
  const normalized = (value || "").replace(/\s+/g, " ").trim();
  if (!normalized || normalized.toLowerCase() === "none") {
    return fallbackTitle;
  }

  return sanitizeGeneratedTitle(normalized, fallbackTitle, "");
}

function normalizeHomepageFeatureText(value, fallbackText, brandContext, title) {
  const normalized = (value || "").replace(/\s+/g, " ").trim();
  if (!normalized || normalized.toLowerCase() === "none") {
    return shortenToWordLimit(fallbackText, 14);
  }

  return shortenToWordLimit(
    normalizeGeneratedCopy(normalized, brandContext, title),
    14,
  );
}

function inferContextFromPath(file) {
  const haystack = buildContextHaystack(file);

  if (isMotionDynamicsMilestoneContext(file)) {
    return {
      gallerySection: "Tech",
      timelineArea: "Motion Dynamics",
      highlightArea: "Motion Dynamics",
    };
  }

  if (isMotionDynamicsContext(file)) {
    return {
      gallerySection: "Tech",
      timelineArea: "none",
      highlightArea: "none",
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
    gallerySection: isImageOrVideo(file) ? "Life in Motion" : "none",
    timelineArea: "Life in Motion",
    highlightArea: "none",
  };
}

function buildPlacementEventKey(kind, area, isoDate, sourceFolder, sourceFile) {
  return [kind, area, isoDate, sourceFolder || sourceFile.localRelativePath].join("::");
}

function hasExistingFolderEvent(fileContents, sourceFolder, isoDate) {
  if (!sourceFolder) {
    return false;
  }

  return (
    hasExistingMarker(fileContents, `sourceFolder: ${JSON.stringify(sourceFolder)}`) &&
    hasExistingMarker(fileContents, `sourceDate: ${JSON.stringify(isoDate)}`)
  );
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

function resolvePageKey(value, sourceFile, gallerySection, timelineArea, highlightArea) {
  if (value && value !== "none") {
    return value;
  }

  if (highlightArea === "Motion Dynamics" || gallerySection === "Tech") {
    return "work";
  }

  if (timelineArea === "Squash" || gallerySection === "Squash") {
    return "sport";
  }

  if (highlightArea === "Snowboarding" || gallerySection === "Snowboard") {
    return "snowboard";
  }

  return "none";
}

function resolvePageSectionKey(value, pageKey, sourceFile, gallerySection, highlightArea) {
  if (value && value !== "none") {
    return slugifyPageSectionKey(value);
  }

  if (pageKey === "work") {
    if (isGolfAnalysisContext(sourceFile)) {
      return "golf-analysis";
    }

    return "motion-dynamics";
  }

  return "none";
}

function resolvePageSectionTitle(value, pageSectionKey, fallbackTitle) {
  if (pageSectionKey === "none") {
    return "none";
  }

  const normalized = (value || "").replace(/\s+/g, " ").trim();
  if (normalized && normalized.toLowerCase() !== "none") {
    return normalized;
  }

  if (pageSectionKey === "motion-dynamics") {
    return "Motion Dynamics";
  }

  if (pageSectionKey === "golf-analysis") {
    return "Golf Analysis";
  }

  return humanizeFilename(pageSectionKey);
}

function resolvePageSectionIntro(value, pageSectionKey, pageSectionTitle, brandContext) {
  if (pageSectionKey === "none") {
    return "none";
  }

  const normalized = (value || "").replace(/\s+/g, " ").trim();
  if (normalized && normalized.toLowerCase() !== "none") {
    return shortenToWordLimit(normalized, 16);
  }

  if (pageSectionKey === "motion-dynamics") {
    return "Product demos, technical milestones, and commercial proof points.";
  }

  if (pageSectionKey === "golf-analysis") {
    return "We apply our movement-analysis approach to golf, turning swing footage into coach-ready feedback.";
  }

  return brandContext === "company"
    ? `${pageSectionTitle} work, demos, and coaching-facing analysis.`
    : `${pageSectionTitle} updates and supporting media.`;
}

function buildContextHaystack(file) {
  return `${file.localRelativePath || ""} ${file.filename || ""}`.toLowerCase();
}

function isMotionDynamicsMilestoneContext(file) {
  const haystack = buildContextHaystack(file);
  return /(venturefest|pitchup|investment forum|competition|conference|summit|demo day|award|winner|finalist|launch event)/.test(
    haystack,
  );
}

function isMotionDynamicsContext(file) {
  const haystack = buildContextHaystack(file);
  return /(motion dynamics|sport[- ]?tech|biomech|pose|analysis|golf|swing|serve|product|prototype|tech|startup|business|investor|demo)/.test(
    haystack,
  );
}

function isGolfAnalysisContext(file) {
  const haystack = buildContextHaystack(file);
  return /(golf|pga|swing analysis)/.test(haystack);
}

function slugifyPageSectionKey(value) {
  const slug = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "motion-dynamics";
}

function getMediaPages(section, type, pageKey) {
  const pages = new Set(["/media"]);

  if (pageKey !== "none") {
    pages.add(getPageRoute(pageKey));
  } else if (section === "Tech") {
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

function getHighlightPages(area, tag, pageKey) {
  const pages = new Set();

  if (pageKey !== "none") {
    pages.add(getPageRoute(pageKey));
  } else if (area === "Motion Dynamics") {
    pages.add("/work");
  }

  if (area === "Snowboarding" && tag === "qualification") {
    pages.add("/snowboard");
  }

  return [...pages];
}

function getTimelinePages(pageKey) {
  if (pageKey !== "none") {
    return [getPageRoute(pageKey)];
  }

  return ["/about"];
}

function getPageRoute(pageKey) {
  if (pageKey === "home") {
    return "/";
  }

  return `/${pageKey}`;
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

function shortenToWordLimit(text, maxWords) {
  const words = (text || "").trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) {
    return text;
  }

  return words.slice(0, maxWords).join(" ");
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
