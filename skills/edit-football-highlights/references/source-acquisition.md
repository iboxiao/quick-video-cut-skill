# Public source acquisition

Use this workflow only when the user supplies a public video URL or explicitly asks Codex to locate a public copy of the same match. Do not bypass DRM, paywalls, access controls, or copyright restrictions.

## Protect credentials and session data

- Treat browser cookie files as secrets.
- Use the cookie file only for the requested download.
- Never display its contents, include it in logs, copy it into the skill, or add it to Git.
- Do not download remote executable components while authenticated cookies are attached. Prefer a trusted local JavaScript runtime and the downloader's built-in components.
- Ensure project ignore rules exclude cookie files, downloaded media, partial fragments, and metadata that contains sensitive request headers.

## Inspect before downloading

Use a current official `yt-dlp` release. Query metadata first and record:

- title and uploader;
- duration, language, and upload date;
- available dimensions and codecs;
- automatic or creator-provided subtitle languages.

For a 1280×720 final composition, prefer a 720p H.264/AAC-compatible source. Higher resolution adds download and render time without improving the delivered frame size unless a tighter crop needs the extra pixels.

## Download and normalize

1. Download the selected video and English captions when available.
2. Preserve the untouched download under `analysis/media/`.
3. Remux or normalize once when the container, timestamps, frame rate, or seeking is unstable.
4. Put only the final editing base, caption JSON, and cover frames in `public/`.
5. Remove downloader fragment files and failed partial downloads only after verifying their resolved paths stay inside the project.

Automatic captions can accelerate the workflow, but treat them as a draft. Group phrase fragments, align them to the final trimmed base, correct football names and event meaning, then translate and validate them like Whisper output.

## Handle an unavailable URL

If the exact URL is private, removed, region-blocked, or unavailable:

1. Report the limitation clearly.
2. Search for a legitimate public upload of the same match.
3. Verify both teams, year, competition, score, event sequence, approximate duration, and uploader before substituting it.
4. Prefer an official broadcaster, federation, competition organizer, or club channel.
5. Never misrepresent the replacement as the original upload.

If no trustworthy public substitute exists, stop acquisition and ask the user for another source rather than using a mismatched match.
