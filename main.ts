// main.ts — Tuesday 24 November 2026 Front Page (Node 22, stdlib only).
//
// The front page is drawn ahead of time (frontpage.png, PIL + system
// fonts) and this program only puts it where the grader looks:
// $MAKEFUN_OUTPUT_DIR/entry.png. Before copying, it checks the file
// is a complete 1024x1024 PNG under the 1 MiB limit, then confirms
// the copy matches the source byte for byte. Copying a fixed file
// means two runs always produce identical bytes.
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const LIMIT_BYTES = 1024 * 1024;
const SIDE_PX = 1024;
const PNG_HEAD = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const IEND_CRC = 0xae426082;

function die(message) {
  throw new Error(message);
}

function checkPng(bytes) {
  if (bytes.length < 33) {
    die(`frontpage.png is only ${bytes.length} bytes, too small for a PNG`);
  }
  if (bytes.length > LIMIT_BYTES) {
    die(`frontpage.png is ${bytes.length} bytes, over the 1 MiB limit`);
  }
  if (!bytes.subarray(0, PNG_HEAD.length).equals(PNG_HEAD)) {
    die("frontpage.png does not begin with the PNG signature");
  }
  // The IHDR chunk stores width at bytes 16..20 and height at 20..24.
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width !== SIDE_PX || height !== SIDE_PX) {
    die(`frontpage.png is ${width}x${height}, expected 1024x1024`);
  }
  // A whole PNG ends in a 12-byte IEND chunk: zero length, the
  // letters IEND, and the fixed CRC 0xAE426082. Reject a cut-off file.
  const tail = bytes.subarray(bytes.length - 12);
  if (tail.readUInt32BE(0) !== 0 || tail.toString("ascii", 4, 8) !== "IEND" ||
      tail.readUInt32BE(8) !== IEND_CRC) {
    die("frontpage.png does not end with a whole IEND chunk");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  die("MAKEFUN_OUTPUT_DIR is not set");
}

const source = new URL("./frontpage.png", import.meta.url);
const bytes = readFileSync(source);
checkPng(bytes);

mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.png");
copyFileSync(source, target);

const written = readFileSync(target);
if (!written.equals(bytes)) {
  die("entry.png differs from frontpage.png after copying");
}
const digest = createHash("sha256").update(written).digest("hex");
console.log(`wrote entry.png (${written.length} bytes, sha256 ${digest})`);
