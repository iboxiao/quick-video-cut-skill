#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const usage = () => {
  console.log('Usage: node validate-captions.mjs <captions.json> [--duration-ms N] [--max-chars N]');
};

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help')) {
  usage();
  process.exit(args.length === 0 ? 1 : 0);
}

const input = path.resolve(args[0]);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : Number(args[index + 1]);
};

const durationMs = option('--duration-ms', Number.POSITIVE_INFINITY);
const maxChars = option('--max-chars', 28);
const captions = JSON.parse(fs.readFileSync(input, 'utf8'));
const errors = [];
const warnings = [];

if (!Array.isArray(captions)) {
  throw new Error('Caption file must contain a JSON array.');
}

captions.forEach((caption, index) => {
  const label = `Caption ${index + 1}`;
  if (typeof caption.text !== 'string' || caption.text.trim() === '') {
    errors.push(`${label}: text must be a non-empty string.`);
  }
  if (!Number.isFinite(caption.startMs) || !Number.isFinite(caption.endMs)) {
    errors.push(`${label}: startMs and endMs must be finite numbers.`);
    return;
  }
  if (caption.startMs < 0 || caption.endMs <= caption.startMs) {
    errors.push(`${label}: invalid range ${caption.startMs}-${caption.endMs}.`);
  }
  if (caption.endMs > durationMs) {
    errors.push(`${label}: ends after the video duration.`);
  }
  if (index > 0 && caption.startMs < captions[index - 1].endMs) {
    errors.push(`${label}: overlaps caption ${index}.`);
  }

  const visibleMs = caption.endMs - caption.startMs;
  if (visibleMs < 700) warnings.push(`${label}: visible for less than 700 ms.`);
  if (visibleMs > 8000) warnings.push(`${label}: visible for more than 8 seconds.`);

  String(caption.text)
    .split('\n')
    .forEach((line, lineIndex) => {
      const length = [...line].length;
      if (length > maxChars) {
        warnings.push(`${label}, line ${lineIndex + 1}: ${length} characters (max ${maxChars}).`);
      }
    });
});

warnings.forEach((warning) => console.warn(`WARN: ${warning}`));
errors.forEach((error) => console.error(`ERROR: ${error}`));

if (errors.length > 0) {
  process.exit(1);
}

const first = captions[0]?.startMs ?? null;
const last = captions.at(-1)?.endMs ?? null;
console.log(JSON.stringify({valid: true, count: captions.length, firstStartMs: first, lastEndMs: last, warnings: warnings.length}));
