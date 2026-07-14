---
name: edit-football-highlights
description: Create polished football/soccer match recap videos from local footage or a user-supplied public video URL, using yt-dlp for authorized acquisition, FFmpeg for analysis, and Remotion for the creative timeline. Includes event selection, historical-documentary packaging, original commentary, Chinese translation subtitles, 3:4 and 4:3 covers, master/share exports, and Chinese social publishing copy with a formatted title, summary, and five player hashtags. Use whenever Codex is asked to download and cut a football match, make a match recap or World Cup/Euro history video, translate English commentary for Chinese viewers, add burned-in Chinese captions, generate football thumbnails or social titles, or independently turn match footage into finished media.
---

# Edit Football Highlights

Produce the finished MP4, not merely a script. Use code as the editable timeline, then preview, inspect, revise, render, and verify.

## Non-negotiable approach

- Use Remotion as the primary creative editor. Load the `remotion-best-practices` skill when available.
- Use FFmpeg only for probing, exact media preparation, audio extraction, and final compression.
- Do not use generic Python/OpenCV as the main editing engine. Small analysis utilities are acceptable.
- Preserve the source files. Work in a new sibling project directory.
- Keep original commentary unless the user requests replacement narration.
- Treat transcription as a draft. Correct names, football terms, and event meaning against the picture before translation.
- Render representative frames and inspect them visually before the full export.

## Default deliverable

When the user does not specify otherwise, make a 16:9 historical-documentary recap:

- 1280×720, 30 fps
- original match audio
- restrained title, chapter cards, archive texture, and hard editorial cuts
- burned-in Simplified Chinese subtitles when the audience is Chinese or the established series uses them
- H.264/AAC high-quality master plus a smaller share version
- 1200×1600 (3:4) vertical and 1600×1200 (4:3) horizontal covers for a recurring social series
- a Chinese publishing package: formatted main title, one-paragraph summary, and exactly five player hashtags

Use reasonable judgment instead of blocking on stylistic questions. Ask only when the requested platform, aspect ratio, or language would materially change the result.

## Choose the edit mode first

Read [references/fast-workflow.md](references/fast-workflow.md) before starting. Select exactly one mode from the user's wording:

- **Highlight mode**: shorten the match into an event-led story. A 10–20 minute source commonly yields a 4–7 minute recap.
- **Preserve-length mode**: keep the duration and action intact; add the title, historical treatment, subtitles, and covers without unnecessary event selection.
- **Exact-range mode**: keep only the supplied start-to-end range, then treat that continuous result as the subtitle and effects timeline.

When the user says “same as before,” “next chapter,” or similar, preserve the established series title style, Chinese subtitle treatment, and both cover aspect ratios unless explicitly changed.

## Workflow

### 0. Acquire a public source when the user supplies a URL

Read [references/source-acquisition.md](references/source-acquisition.md), then:

1. Use the user's supplied cookies only for the requested download and never print, copy, or commit them.
2. Save metadata and automatic English captions when available.
3. Download only the quality needed by the final composition; 720p is sufficient for a 1280×720 master unless the user requests higher resolution.
4. If the exact URL is unavailable, explain the reason and use a legitimate public upload of the same match only after verifying teams, year, competition, and content.
5. Preserve the acquired source under `analysis/media/`; keep only the normalized editing base in `public/`.

### 1. Inventory and protect the footage

1. Locate the requested source files and inspect duration, dimensions, frame rate, codecs, and audio streams.
2. Never overwrite or re-encode the source in place.
3. Create a dedicated project folder with `src/`, `public/`, `analysis/`, and `out/`.
4. Prefer hard links for large local assets on the same volume; otherwise copy them.
5. Pin every Remotion package to the exact same version. Remove version ranges such as `^`.

### 2. Build a visual index only when the mode needs it

In highlight mode:

1. Generate a coarse contact sheet every 20–30 seconds.
2. Identify lineups, kickoff, attacks, saves, fouls, disputes, cards, goals, celebrations, and the final whistle.
3. Generate 5–10 second contact sheets around candidate events.
4. Read [references/editorial-workflow.md](references/editorial-workflow.md) before choosing the clips.

In preserve-length or exact-range mode, inspect only representative frames needed for title placement, visual QA, and cover selection. Do not spend time cataloguing events that will not be cut.

On Windows, use `scripts/build-contact-sheet.ps1` when convenient. It works with a normal FFmpeg install or Remotion's bundled FFmpeg/FFprobe.

### 3. Write the edit decision list for highlight mode

For highlight mode, define every kept segment with source `start`, `end`, and optional chapter text before styling. Build a clear arc:

1. identity and stakes
2. early exchanges
3. rising conflict or tactical pressure
4. decisive incident
5. winning action
6. aftermath and result

Cut repeated wide play, dead time, and redundant replays. Preserve enough lead-in to understand each chance and enough reaction to feel it.

For preserve-length mode, use one continuous segment. For exact-range mode, prepare one continuous base file with accurate boundaries before transcription or Remotion styling.

### 4. Build the Remotion timeline

1. Copy only the needed components from `assets/remotion-template/` into the project.
2. Put readable content inside safe areas. Keep text away from the frame edges.
3. Use source audio fades of only a few frames around hard cuts to avoid clicks.
4. Use a small, consistent palette. For historical footage, prefer white, near-black, one team accent, and one opponent accent.
5. Keep action unobstructed. Move chapter cards or captions when they collide with important play.
6. Read [references/remotion-implementation.md](references/remotion-implementation.md) for timeline and export patterns.

### 5. Add Chinese subtitles when requested

Read [references/subtitle-workflow.md](references/subtitle-workflow.md), then:

1. Finalize the exact base timeline first.
2. Extract its final audio as 16 kHz mono WAV.
3. Transcribe locally with Whisper.cpp and token timestamps.
4. Convert the transcript into phrase-level `Caption` JSON.
5. Correct names and mistranscriptions against the footage.
6. Translate for viewing speed, not word-for-word literalism.
7. Omit crowd-only intervals and meaningless clipped fragments.
8. Validate the JSON with `scripts/validate-captions.mjs`.
9. Burn captions into the image with `ChineseSubtitles.tsx` while keeping the original audio.

Use the base-master pattern for highlight mode: render the edit once, then create a second composition with the master video plus subtitles. For preserve-length and exact-range modes, prefer one final Remotion render after caption timing is stable; avoid an unnecessary intermediate Remotion render.

### 6. Create cover art when requested

Read [references/cover-workflow.md](references/cover-workflow.md), then:

1. Select a real source frame with one recognizable player, confrontation, goal, or celebration as the main image.
2. Select a second contextual frame for a restrained documentary inset.
3. Copy `assets/remotion-template/FootballCover.tsx` into the project and set the teams, year, chapter, tournament line, images, and focal point.
4. Render a 1200×1600 PNG for 3:4 vertical use and a 1600×1200 PNG for 4:3 horizontal use.
5. Inspect both at normal size. Fix face crops, unreadable titles, low contrast, and unsafe margins before delivery.

### 7. Inspect before the full render

Render at least these frames:

- title at full opacity
- longest title or chapter card
- key conflict/card moment
- goal or decisive action
- final score/outro
- a two-line Chinese subtitle
- a subtitle while a chapter card is visible

Inspect each image with `view_image`. Fix overlap, unreadable text, bad wrapping, incorrect names, and unsafe margins before rendering the full video.

### 8. Export and verify

1. Render a high-quality H.264/AAC master, normally CRF 18–20.
2. Produce a share version, normally x264 CRF 23–25 with AAC 160 kbps and `faststart`.
3. Probe both outputs and verify duration, 1280×720, 30 fps, H.264 video, AAC stereo audio, and nonzero file size.
4. Deliver clickable paths for the share version, master, editable project, and optionally SRT.
5. Do not call the job complete until the final MP4 exists and metadata checks pass.

### 9. Generate the social publishing package

Read [references/social-publishing.md](references/social-publishing.md) after the match facts and final score have been verified. Deliver:

1. a main title in the user's requested structure;
2. one concise Chinese summary paragraph covering the score arc, decisive moments, and significance;
3. exactly five major-player topics, each beginning with `#`.

Keep the publishing copy separate from technical delivery notes so the user can copy it directly.

## Bundled resources

- `references/editorial-workflow.md`: event selection, pacing, and historical-match story structure.
- `references/fast-workflow.md`: edit-mode selection, exact trimming, single-pass rendering, caching, and Windows reliability.
- `references/subtitle-workflow.md`: local Whisper setup, Chinese translation, timing, and layout.
- `references/remotion-implementation.md`: project structure, version pinning, timeline patterns, and render commands.
- `references/cover-workflow.md`: frame selection, cover hierarchy, aspect ratios, and still-render QA.
- `references/source-acquisition.md`: yt-dlp, supplied cookies, automatic captions, unavailable-link fallback, and source hygiene.
- `references/social-publishing.md`: verified Chinese title, summary, and five-player hashtag format.
- `scripts/build-contact-sheet.ps1`: Windows contact-sheet generator.
- `scripts/validate-captions.mjs`: Caption JSON integrity and readability checks.
- `scripts/captions-to-srt.mjs`: convert Caption JSON to an editable `.srt` file.
- `assets/remotion-template/`: reusable archive overlays, Chinese subtitle renderer, and captioned-master composition.
- `assets/remotion-template/FootballCover.tsx`: parameterized historical football cover component for 3:4 and 4:3 outputs.
