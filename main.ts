// main.ts — Tuesday 24 November 2026 Front Page (Node 22, stdlib only).
//
// Copies the finished front page (frontpage.png, drawn programmatically
// with PIL and system fonts) to $MAKEFUN_OUTPUT_DIR/entry.png, after
// checking that it is a whole 1024x1024 PNG under the 1 MiB cap.
// Runs twice, writes the same bytes twice: the file is only copied,
// never redrawn, so the output is deterministic by construction.
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_MAGIC = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const MAX_BYTES = 1048576;
const WIDTH = 1024;
const HEIGHT = 1024;

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "frontpage.png");

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const bytes = readFileSync(source);
if (bytes.length > MAX_BYTES) {
  throw new Error(`frontpage.png is ${bytes.length} bytes, over the 1 MiB cap`);
}
if (!bytes.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error("frontpage.png does not start with the PNG signature");
}
// IHDR chunk: width at bytes 16..20, height at bytes 20..24 (big-endian).
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width !== WIDTH || height !== HEIGHT) {
  throw new Error(`frontpage.png is ${width}x${height}, expected 1024x1024`);
}
// A whole PNG ends with the 12-byte IEND chunk: zero length, the
// letters IEND, and the fixed CRC 0xAE426082. Refuse a truncated file.
const tail = bytes.subarray(bytes.length - 12);
if (
  tail.readUInt32BE(0) !== 0 ||
  tail.toString("ascii", 4, 8) !== "IEND" ||
  tail.readUInt32BE(8) !== 0xae426082
) {
  throw new Error("frontpage.png does not end with a whole IEND chunk");
}

mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.png");
copyFileSync(source, target);

// Confirm the copy is byte-for-byte the source before reporting it.
const written = readFileSync(target);
if (!written.equals(bytes)) {
  throw new Error("entry.png differs from frontpage.png after copying");
}
const digest = createHash("sha256").update(written).digest("hex");
const size = statSync(target).size;
console.log(`wrote entry.png (${size} bytes, sha256 ${digest})`);
