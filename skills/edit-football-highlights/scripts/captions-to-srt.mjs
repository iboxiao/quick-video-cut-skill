#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
if (args.length < 2 || args.includes('--help')) {
  console.log('Usage: node captions-to-srt.mjs <captions.json> <output.srt>');
  process.exit(args.includes('--help') ? 0 : 1);
}

const formatTime = (milliseconds) => {
  const value = Math.max(0, Math.round(milliseconds));
  const hours = Math.floor(value / 3_600_000);
  const minutes = Math.floor((value % 3_600_000) / 60_000);
  const seconds = Math.floor((value % 60_000) / 1000);
  const millis = value % 1000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
};

const input = path.resolve(args[0]);
const output = path.resolve(args[1]);
const captions = JSON.parse(fs.readFileSync(input, 'utf8'));

if (!Array.isArray(captions)) {
  throw new Error('Caption file must contain a JSON array.');
}

const srt = captions
  .map((caption, index) => [
    index + 1,
    `${formatTime(caption.startMs)} --> ${formatTime(caption.endMs)}`,
    String(caption.text).trim(),
    '',
  ].join('\n'))
  .join('\n');

fs.mkdirSync(path.dirname(output), {recursive: true});
fs.writeFileSync(output, `${srt}\n`, 'utf8');
console.log(JSON.stringify({written: output, count: captions.length}));
