---
name: sync-drive
description: Syncs assets from a specific Google Drive folder to the local repo.
allowed-tools: ["gws", "git", "bash", "next", "magick"]
---

# Sync Drive Logic
1. Run `gws drive list --folder "Site_Updates"` to find un-synced IDs.
2. Download new files to `./temp_updates/`.
3. For each file:
   - If image (`.jpg`, `.png`): 
     - Use `magick` (or `image-magick` skill) to convert to `.webp`.
     - Move to `public/media/images/` and rename to `YYYY-MM-DD-filename.webp`.
     - Append a new entry to the `media` array in `content/media.ts`.
   - If video (`.mp4`, `.mov`): 
     - Move to `public/media/videos/` and rename to `YYYY-MM-DD-filename.mp4` (if `.mov`, convert to `.mp4` using `ffmpeg` if available).
     - Append a new entry to the `media` array in `content/media.ts`.
   - If text (`.txt`): 
     - Extract `title`, `section`, `caption`, and `year` for the website update.
     - If it's a timeline event, append a new entry to the `timeline` array in `content/timeline.ts`.
     - Otherwise, use it as metadata for the corresponding media asset.
4. Delete synced files from Google Drive to prevent duplicate syncs in the next run.
5. Trigger a local build check (`npm run build`) to ensure TypeScript types and Next.js static generation are still valid.
