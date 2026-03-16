name: sync-drive
description: Syncs assets from a specific Google Drive folder (including subdirectories) to the local repo.
allowed-tools: ["gws", "git", "bash", "next", "magick"]

# Sync Drive Logic
1. Resolve the folder ID for `Site_Updates` and list its child files without `--folder-path`.
2. For each item:
   - Use `gws drive files list` with an auth-valid query filter, then fetch by ID.
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
3. Delete synced files from Google Drive (after successful sync) to prevent duplicates.
4. Trigger a local build check (`npm run build`).

# Recommended supported command flow for `gws`
- Detect supported query flag once: use `--query` or fallback to `--q`.
- Discover folder ID:
  - `FOLDER_ID=$(gws drive files <QUERY_FLAG> "name = 'Site_Updates' and mimeType = 'application/vnd.google-apps.folder' and trashed = false" --fields "files(id,name)" --format json | jq -r '.files[0].id')`
- List children:
  - `gws drive files <QUERY_FLAG> "'${FOLDER_ID}' in parents and trashed = false" --fields "files(id,name,mimeType,size)" --format json`
- Download:
  - `gws drive files get <FILE_ID> --output temp_updates/<NAME>`
