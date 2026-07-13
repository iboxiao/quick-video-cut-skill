# Fast production workflow

## Contents

1. Choose the edit mode
2. Use the shortest valid pipeline
3. Align captions to the real final timeline
4. Reuse expensive dependencies
5. Apply Windows reliability rules
6. Verify only what matters

## Choose the edit mode

Select the mode from the user's wording before analyzing footage.

### Highlight mode

Use when the user asks for a compilation, recap, best moments, or a shorter story. Build contact sheets and an edit decision list, then render an edited base master before subtitle work.

### Preserve-length mode

Use when the user says the length is acceptable, the video does not need cutting, or only packaging and captions are wanted. Skip event selection and the full contact-sheet pass. Probe the file, inspect only enough frames to design the opening and covers, transcribe the preserved timeline, and render one final Remotion composition with title, archive treatment, and captions.

### Exact-range mode

Use when the user gives a start and end time to remove ads or unwanted material. Create one exact base file first. Interpret the range as `[start, end)` and calculate the output duration as `end - start`. For example, keeping `00:00:03` through `00:10:15` produces a 612-second base timeline.

Encode the base with H.264/AAC when accurate cuts or source compatibility matter. Do not use stream copy when its nearest keyframe could shift the requested boundary.

## Use the shortest valid pipeline

For preserve-length or exact-range work:

1. Probe the source and confirm the requested boundaries.
2. Hard-link the source into `public/` when no media preparation is needed; otherwise create one normalized base MP4.
3. Extract 16 kHz mono audio from that exact base.
4. Transcribe, correct, translate, and validate Chinese captions.
5. Render one final Remotion composition containing the base video, title/effects, and captions.
6. Produce the smaller share version from the verified master with FFmpeg.
7. Render both cover stills from the same project.

Do not render an intermediate Remotion master merely to add subtitles when the timeline contains a single continuous base video and caption timing is already stable.

For highlight mode, keep the two-stage base-master pattern because many trimmed source segments are expensive to seek repeatedly and subtitle changes should not rebuild the edit.

## Align captions to the real final timeline

Always transcribe the exact continuous base that the final composition will play. Never transcribe the original source and then manually subtract an ad trim from hundreds of timestamps.

Finalize the trim or edit before translation. If the base duration changes, regenerate or retime captions before rendering.

## Reuse expensive dependencies

- Reuse one verified Whisper `small.en` model across projects; do not copy it into every repository.
- Keep the model outside Git-tracked folders.
- Reuse the installed Whisper.cpp runtime when it matches the expected package version.
- Keep `node_modules` local and reinstall from pinned package versions instead of committing it.
- Keep source videos, rendered masters, extracted audio, and analysis files out of Git.

## Apply Windows reliability rules

- Run Remotion commands from the project root.
- Pass `--public-dir` explicitly when the public folder is not the default.
- Pin all `remotion` and `@remotion/*` packages to one exact version.
- Normalize troublesome archive footage once instead of debugging repeated distant-frame seek failures.
- Render a representative distant frame before launching a long export.
- Use the browser executable already available on the machine when Remotion cannot discover Chrome automatically.

## Verify only what matters

Before the full render, inspect the opening, one subtitle with two lines, a conflict or decisive event, and the closing frame. Inspect both covers at full size.

After rendering, probe the real output rather than trusting the command exit code. Confirm duration, frame size, frame rate, codecs, audio presence, file size, and the final seconds of picture and sound.
