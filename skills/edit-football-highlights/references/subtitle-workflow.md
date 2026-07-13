# Chinese subtitle workflow

## Contents

1. Install and pin dependencies
2. Prepare audio
3. Transcribe locally
4. Correct and translate
5. Caption JSON
6. Layout and QA
7. Network fallback

## Install and pin dependencies

Keep every Remotion package on one exact version:

```powershell
npm.cmd install @remotion/captions@<version> @remotion/install-whisper-cpp@<version> @remotion/media@<version> --save-exact
```

Use `small.en` for noisy historic English commentary. Use `base.en` only when speed or download size is more important than names and football terminology.

## Prepare audio

Transcribe the finished base cut so timestamps already match the final timeline:

```powershell
npx.cmd remotion ffmpeg -i out/base-master.mp4 -vn -ar 16000 -ac 1 -c:a pcm_s16le analysis/final-16k.wav
```

The source commentary stays in the video; the WAV is only for recognition.

For exact-range work, create the precisely trimmed continuous base before extracting audio. For preserve-length work, extract from the preserved source or its normalized base. Do not transcribe the untrimmed original and then shift every caption by hand.

## Transcribe locally

Use `@remotion/install-whisper-cpp` with token-level timestamps and language `en`. Store both raw Whisper output and normalized captions in `analysis/`.

Recommended parameters:

- model: `small.en`
- `tokenLevelTimestamps: true`
- `splitOnWord: true`
- `translateToEnglish: false`

Do not upload footage to a third-party transcription site without explicit authorization.

Reuse one verified model and Whisper.cpp runtime across projects whenever their versions are compatible. Keep models in a shared local cache outside Git-tracked project folders; never commit the model, runtime binaries, extracted WAV, or raw match video.

## Correct and translate

Machine output from archive commentary is a draft. Check every named entity against lineups and the picture.

Common corrections include:

- player surnames and diacritics
- `sent off`, `booked`, `free kick`, `injury time`
- commentary jokes that speech recognition renders literally
- clipped phrases created by the edit

Write Chinese for viewing speed:

- Prefer 8–24 Chinese characters per subtitle.
- Use at most two lines.
- Keep most subtitles visible for 1.5–5 seconds.
- Condense repeated commentary.
- Omit crowd-only segments and isolated player names unless they clarify the action.
- Translate meaning faithfully, but do not preserve awkward English syntax.

## Caption JSON

Use the Remotion `Caption` shape:

```json
{
  "text": "阿根廷队长被罚下！",
  "startMs": 167500,
  "endMs": 171500,
  "timestampMs": null,
  "confidence": null
}
```

Validate before rendering:

```powershell
node <skill-dir>/scripts/validate-captions.mjs public/captions-zh.json --duration-ms 387500 --max-chars 28
```

Create an optional sidecar:

```powershell
node <skill-dir>/scripts/captions-to-srt.mjs public/captions-zh.json out/captions-zh.srt
```

## Layout and QA

- Use white, bold Simplified Chinese with a dark translucent backing.
- Default to the bottom center, inside the safe area.
- Move subtitles upward during chapter cards or score graphics.
- Avoid covering the ball, goalkeeper, referee signal, and goal line.
- Preview a two-line caption, the goal call, the dismissal call, and the final result.
- Burn subtitles into the share version so Chinese viewers do not depend on player support.

## Network fallback

If the official Hugging Face model download resets, try a compatible mirror while preserving the exact expected model filename. On Windows, a resumable example is:

```powershell
curl.exe -L --retry 20 --retry-all-errors --retry-delay 2 -C - -o tools/whisper.cpp/ggml-small.en.bin https://hf-mirror.com/ggerganov/whisper.cpp/resolve/main/ggml-small.en.bin
```

Check the downloaded file size before transcribing. Never accept a zero-byte or partial model.
