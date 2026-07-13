# Remotion implementation

## Contents

1. Project layout
2. Version pinning
3. Timeline model
4. Visual components
5. Base-master subtitle pattern
6. Fast continuous-base pattern
7. Windows reliability
8. Rendering and verification

## Project layout

Use a dedicated project:

```text
match-recap/
  analysis/
  out/
  public/
    match.mp4
    captions-zh.json
  src/
    Root.tsx
    MatchHighlight.tsx
    ChineseSubtitles.tsx
```

Copy only needed files from `assets/remotion-template/`.

## Version pinning

All packages whose names begin with `remotion` or `@remotion/` must resolve to the same exact version. Do not keep `^` or `~` ranges. Run a type check before rendering.

## Timeline model

Define the edit decision list first:

```ts
type HighlightClip = {
  start: number;
  end: number;
  chapter?: string;
  detail?: string;
  accent?: string;
};
```

Convert seconds to frames with the composition FPS. Place each source clip in a `Sequence`, and use `trimBefore` and `trimAfter` on `Video`. Compute the total duration from the clips rather than hard-coding it separately.

Use short volume ramps at clip edges to prevent audio clicks. Preserve natural crowd peaks around important moments.

## Visual components

The bundled `ArchiveOverlays.tsx` provides reusable archive texture, corner marker, and chapter card patterns. Customize:

- team colors
- episode label
- title and competition line
- chapter text
- safe margins

Keep animation frame-driven with `useCurrentFrame()` and `interpolate()`. Do not use CSS transitions or CSS animations.

## Base-master subtitle pattern

Render the edited match first. Then hard-link or copy the master into `public/` and create a second composition:

```tsx
<AbsoluteFill>
  <Video src={staticFile('base-master.mp4')} objectFit="cover" />
  <ChineseSubtitles captionsFile="captions-zh.json" />
</AbsoluteFill>
```

This makes subtitle revisions independent from the source edit and prevents expensive reseeking through many source segments.

Use this pattern for highlight mode, where the timeline contains many source segments or subtitle wording is still changing.

## Fast continuous-base pattern

For preserve-length and exact-range work, use a single continuous base video. Finalize and transcribe that base first, then render the title, archive overlays, and Chinese subtitles together in one Remotion pass. This removes an intermediate full-length render without changing the visible result.

Create a normalized base with FFmpeg only when exact trimming or source compatibility requires it. Otherwise hard-link the source into `public/` and keep the original untouched.

## Windows reliability

- Run the Remotion CLI from the project root.
- Pass `--public-dir` explicitly when using a non-default media directory.
- Point to the available Chrome executable when browser discovery fails.
- Normalize archive footage once if long-distance frame seeking is unstable.
- Render a still near the end of the video before committing to a long full render.
- Verify the final seconds of both video and audio after export.

## Rendering and verification

Representative still:

```powershell
npx.cmd remotion still src/index.ts MatchHighlight out/check.png --frame=300 --browser-executable="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

Master:

```powershell
npx.cmd remotion render src/index.ts MatchHighlight out/master.mp4 --codec=h264 --crf=19 --audio-bitrate=192k
```

Share version:

```powershell
npx.cmd remotion ffmpeg -i out/master.mp4 -c:v libx264 -preset medium -crf 24 -c:a aac -b:a 160k -movflags +faststart out/share.mp4
```

Probe the output and confirm duration, dimensions, frame rate, H.264, AAC stereo, and a reasonable nonzero size. Inspect at least the opening, turning point, goal, and outro frames.
