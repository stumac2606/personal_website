---
name: sync-drive
description: Syncs assets from a specific Google Drive folder (including subfolders) to the local repo.
allowed-tools: ["gws", "git", "bash", "next", "magick"]
---

# Sync Drive Logic
1. Run `gws drive list --folder "Site_Updates" --recursive` to find all un-synced IDs in the main folder and its subdirectories.
2. Download new files to `./temp_updates/`.
3. For each file:
   - If image (`.jpg`, `.png`): 
     - Use `magick` (or `image-magick` skill) to convert to `.webp`.
     - Move to `public/media/images/` and rename to `YYYY-MM-DD-filename.webp`.
     - Append a new entry to the `media` array in `content/media.ts`.
   - If video (`.mp4`, `.mov`): 
     - Move to `public/media/videos/` and rename to `YYYY-MM-DD-filename.mp4` (if `.mov`, convert to `.mp4`).
     - Append a new entry to the `media` array in `content/media.ts`.
   - If text (`.txt`): 
     - Extract `title`, `section`, `caption`, and `year`.
     - If it's a timeline event, append to `content/timeline.ts`.
     - Otherwise, use as metadata for the corresponding media asset.
4. Delete synced files from Google Drive (after successful sync) to prevent duplicates.
5. Trigger a local build check (`npm run build`).
