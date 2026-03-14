# AGENTS.md

## Repository Context
- **Project Type:** Personal Portfolio / Professional Athlete & Tech Site
- **Tech Stack:** Next.js 16 (React 19), Tailwind CSS 4, TypeScript
- **Asset Paths:** 
  - Images: `/public/media/images/`
  - Videos: `/public/media/videos/`
- **Data Files:** 
  - Media: `/content/media.ts`
  - Timeline: `/content/timeline.ts`
  - Projects: `/content/projects.ts`

## Automation Routine: "Drive-to-Site Sync"
This routine is powered by the **Gemini 1.5 Flash** model via Google AI Studio. It is triggered when new files are detected in your Google Drive.

### Step 1: Content Extraction
- Call the `$gws-drive-fetch` tool to pull any new `.jpg`, `.png`, `.mp4`, `.mov`, or `.txt` files from your Drive folder.
- Use Gemini's Vision capabilities to analyze new media files for SEO alt-text and categorization.
- Extract any text content from `.txt` files to use for titles, captions, or timeline descriptions.

### Step 2: Implementation Policy
- **Asset Processing:** 
  - Convert all images to `.webp` format for performance.
  - Categorize assets into "Squash", "Tech", "Flight", "Snowboard", or "Life events".
- **Content Updates:** 
  - Dynamically update the `media` array in `content/media.ts`.
  - Append new achievements to the `timeline` array in `content/timeline.ts`.
  - Maintain strict TypeScript formatting and variable names.
- **Optimization:** Follow Next.js 16 conventions, specifically ensuring assets are correctly linked in the public folder.

### Step 3: Verification & Notification
- Before committing changes, run `npm run lint` and `npm run build`.
- Use the Playwright suite to verify that the site still renders correctly.
- **Notification:** After a successful sync and push, use the `Telegram Messaging` skill to send a summary of the updates (e.g., "Added 2 new squash photos and 1 tech project").

## Mandatory Skills
- `$gws-skills` (Google Workspace Bridge)
- `$gemini-vision` (Advanced Image & Video Analysis)
- `$git-agent` (For PR generation)
- `sync-drive` (Local skill defined in `.agents/skills/sync-drive/SKILL.md`)
- `Telegram Messaging` (Global skill for status notifications)
