# Google Drive Upload Guide

This guide explains how to add content through `Site_Updates` in Google Drive so the GitHub Action and Gemini place it correctly on the website.

## How The System Works

1. Put files inside the Google Drive folder named `Site_Updates`.
2. The workflow scans that folder and all subfolders.
3. Files are downloaded into a temporary batch.
4. Gemini analyses the batch and decides:
   - title
   - short website copy
   - alt text
   - which page or section it belongs to
5. If the site builds successfully, the changes are committed and the Drive files are moved to `Site_Updates_Processed`.
6. If processing or build fails, the Drive files stay in `Site_Updates`.

## Core Rule

Treat each subfolder inside `Site_Updates` as one story or one update.

Good:

```text
Site_Updates/
  2026-04-10 Golf Analysis Session/
    clip1.mov
    image1.jpg
    notes.txt
```

Bad:

```text
Site_Updates/
  Random Uploads/
    golf.mov
    snowboard.mov
    pitch_photo.jpg
```

If you mix unrelated content in one folder, Gemini is encouraged to treat it as one event.

## Best Practice

Every upload folder should contain:

- the media files
- one `notes.txt` or Google Doc with instructions

The note file is used as context for the media in that same folder. It is not normally published as a separate visible item when media is present.

## Supported Input Types

Best supported:

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`
- `.mp4`
- `.mov`
- `.txt`
- `.md`
- Google Docs
- `.docx`

Also supported:

- Google Sheets export to CSV
- Google Drawings export to PNG

## Current Website Placement Rules

### Work Page

Used for:

- Motion Dynamics
- product demos
- golf analysis
- technical media
- startup / pitch / engineering content

You can:

- add media to the existing `Motion Dynamics` section
- add media to the existing `Golf Analysis` section
- create a new Work section if you explicitly ask for one

### Homepage

Used for:

- featured highlights
- selected milestone cards
- explicitly promoted updates

Do not rely on homepage placement unless you say so clearly in the note.

### Sport Page

Used for:

- squash content
- squash gallery media
- squash results and milestones

### Snowboard Page

Used for:

- snowboard clips in the `Featured Clips` rail
- qualifications and important snowboard milestones

Ordinary snowboard clips should stay in the clip rail and should not create a new dynamic section.

### About Page

Used for:

- timeline items
- broader story / milestone updates

### Contact Page

Used for:

- bookings
- availability
- contact-related updates

## Golden Rules For Accurate Placement

- Use meaningful folder names.
- Put one story per folder.
- Always include a note file when placement matters.
- Say explicitly if something is `gallery only`.
- Say explicitly if something is a `milestone`.
- Say explicitly if something should be `featured on homepage`.
- Say explicitly if something should go into an `existing section`.
- Say explicitly if something should create a `new section`.
- If you do not want extra cards or timeline items, write that clearly.

## Copy-Paste Templates

Below are safe templates for the main scenarios.

---

## Scenario 1: Add Media To Existing Golf Analysis Section

Use this when you want new golf images or videos added to the existing Golf Analysis area on the Work page.

Folder example:

```text
Site_Updates/
  2026-04-10 Golf Analysis Session/
    swing.mov
    bay-photo.jpg
    notes.txt
```

`notes.txt`

```text
This is one website update.

Publish date: 2026-04-10.

Place this in the existing Work page section: Golf Analysis.

Add the media to the gallery only.
Do not create a new section.
Do not create a highlight card.
Do not create a timeline entry.
Do not feature this on the homepage.

This is a normal gallery update, not a milestone.
```

---

## Scenario 2: Add Media To Existing Motion Dynamics Section

Use this for normal company or product media that belongs in the main Work section.

Folder example:

```text
Site_Updates/
  2026-04-12 Motion Dynamics Demo/
    demo.mov
    screenshot.jpg
    notes.txt
```

`notes.txt`

```text
This is one website update.

Publish date: 2026-04-12.

Place this in the existing Work page section: Motion Dynamics.

Add the media to the gallery only.
Do not create a new section.
Do not create a highlight card.
Do not create a timeline entry.
Do not feature this on the homepage.

This is a normal gallery update, not a milestone.
```

---

## Scenario 3: Add A New Work Section

Use this only when you genuinely want a brand new section on the Work page.

Folder example:

```text
Site_Updates/
  2026-04-15 Tennis Analysis Product/
    analysis-demo.mov
    still.jpg
    notes.txt
```

`notes.txt`

```text
This is one website update.

Publish date: 2026-04-15.

Create a new Work page section.
Section title: Tennis Analysis.

Place these files in that new section.
Do not create a highlight card unless this is a genuine milestone.
Do not create a timeline entry unless this is a genuine milestone.
Do not feature this on the homepage unless explicitly stated.

This section is for ongoing media and product examples.
```

---

## Scenario 4: Add A Homepage Feature

Use this when an update should appear in the homepage featured highlights.

Folder example:

```text
Site_Updates/
  2026-04-20 Homepage Feature VentureFest/
    stage-photo.jpg
    notes.txt
```

`notes.txt`

```text
This is one website update.

Publish date: 2026-04-20.

Feature this on the homepage.
Also place it in the existing Work page section: Motion Dynamics.

This is a real milestone.
Create a highlight card.
Create a timeline entry if appropriate.
```

If homepage only:

```text
This is one website update.

Publish date: 2026-04-20.

Feature this on the homepage only.
Do not create a new section.
Do not create extra page sections.
```

---

## Scenario 5: Add A Squash Gallery Update

Use this for normal squash images or videos.

Folder example:

```text
Site_Updates/
  2026-04-18 Squash Training/
    photo1.jpg
    photo2.jpg
    notes.txt
```

`notes.txt`

```text
This is one squash media update.

Publish date: 2026-04-18.

Place this in the existing Squash gallery.

Gallery only.
Do not create a new section.
Do not create a homepage feature.
Do not create a highlight card unless this is a genuine result or milestone.
Do not create a timeline entry unless this is a genuine result or milestone.
```

---

## Scenario 6: Add A Squash Result Or Milestone

Use this for tournament wins, rankings, awards, or notable career moments.

Folder example:

```text
Site_Updates/
  2026-04-22 Squash Result/
    trophy-photo.jpg
    notes.txt
```

`notes.txt`

```text
This is one squash milestone update.

Publish date: 2026-04-22.

Place this with squash-related content.
Create a highlight card.
Create a timeline entry.

Do not create a new page section unless explicitly stated.
Only feature it on the homepage if you judge it strong enough, otherwise no homepage feature.
```

---

## Scenario 7: Add A Snowboard Clip To Featured Clips

Use this for normal snowboard videos.

Folder example:

```text
Site_Updates/
  2026-04-25 Snowboard Tree Run/
    tree-run.mov
    notes.txt
```

`notes.txt`

```text
This is one snowboard media update.

Publish date: 2026-04-25.

Place this in Snowboard Featured Clips.
Gallery or clip rail only.

Do not create a new section.
Do not create a highlight card.
Do not create a timeline entry.
Do not feature this on the homepage.

This is a normal snowboard clip, not a qualification or milestone.
```

---

## Scenario 8: Add A Snowboard Qualification Or Milestone

Use this for qualifications, certifications, standout achievements, or major moments.

Folder example:

```text
Site_Updates/
  2026-04-28 Snowboard Qualification/
    certificate.jpg
    notes.txt
```

`notes.txt`

```text
This is one snowboard milestone update.

Publish date: 2026-04-28.

This is a qualification or standout milestone.
Create a highlight card.
Create a timeline entry if appropriate.

Do not create a new page section unless explicitly stated.
Do not feature this on the homepage unless explicitly stated.
```

---

## Scenario 9: Add A Text-Only Work Update

Use this when there is no media and you want a written update.

Folder example:

```text
Site_Updates/
  2026-05-01 Motion Dynamics Text Update/
    notes.txt
```

`notes.txt`

```text
This is a text-only website update.

Publish date: 2026-05-01.

Place this in the existing Work page section: Motion Dynamics.
This should be a written update, not a gallery item.

Create a highlight card.
Create a timeline entry only if it is a genuine milestone.
Do not create a new section.
Do not feature this on the homepage.
```

---

## Scenario 10: Add A Timeline / About Milestone

Use this for broad life milestones, awards, launches, or notable personal updates.

Folder example:

```text
Site_Updates/
  2026-05-05 About Milestone/
    photo.jpg
    notes.txt
```

`notes.txt`

```text
This is one milestone update.

Publish date: 2026-05-05.

This belongs in the About / timeline story of the site.
Create a timeline entry.
Create a highlight card only if it should be emphasized.
Do not create a new page section unless explicitly stated.
Do not feature it on the homepage unless explicitly stated.
```

---

## Scenario 11: Add Contact / Availability Content

Use this only for real contact-page updates.

Folder example:

```text
Site_Updates/
  2026-05-10 Contact Update/
    notes.txt
```

`notes.txt`

```text
This is a contact page update.

Publish date: 2026-05-10.

Place this on the contact page.
This is about bookings, availability, or ways to get in touch.

Do not create a gallery item unless there is a real supporting image.
Do not create a homepage feature unless explicitly stated.
```

---

## Scenario 12: Add Flight / Paragliding Content

Folder example:

```text
Site_Updates/
  2026-05-12 Paragliding Session/
    launch.mov
    notes.txt
```

`notes.txt`

```text
This is one personal media update.

Publish date: 2026-05-12.

Place this in the Flight gallery.

Gallery only.
Do not create a new section.
Do not create a highlight card unless this is a genuine milestone.
Do not create a timeline entry unless this is a genuine milestone.
Do not feature this on the homepage.
```

---

## Scenario 13: Add General Life In Motion Content

Folder example:

```text
Site_Updates/
  2026-05-15 Travel Update/
    image1.jpg
    notes.txt
```

`notes.txt`

```text
This is one personal media update.

Publish date: 2026-05-15.

Place this in Life in Motion.

Gallery only.
Do not create a new section.
Do not create a highlight card.
Do not create a timeline entry.
Do not feature this on the homepage.
```

## Safest Default Template

If you are unsure, use this:

```text
This is one website update.

Publish date: YYYY-MM-DD.

Use the existing section: [SECTION NAME].

Gallery only.
Do not create a new section.
Do not create a highlight card.
Do not create a timeline entry.
Do not feature this on the homepage.
```

## What To Avoid

- Do not upload unrelated topics in one folder.
- Do not rely on raw filenames such as `IMG_4432.jpg`.
- Do not mix a homepage feature request and a gallery-only request in the same folder.
- Do not assume Google Photos is being scanned; use Google Drive `Site_Updates`.
- Do not expect a text file in a media folder to become a separate visible post.
- Do not ask snowboard clips to create sections; they should stay in `Featured Clips`.

## Recommended Folder Naming

Use this pattern:

```text
YYYY-MM-DD Clear Story Name
```

Examples:

- `2026-04-10 Golf Analysis Session`
- `2026-04-20 Homepage Feature VentureFest`
- `2026-04-25 Snowboard Tree Run`
- `2026-05-05 About Milestone`

## If You Want Maximum Reliability

For every folder, always include:

1. a clear folder name
2. media files that belong to one story
3. a `notes.txt` with:
   - publish date
   - exact destination
   - gallery only vs milestone
   - homepage yes/no
   - new section yes/no

