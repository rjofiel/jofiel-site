import fs from 'node:fs';
import path from 'node:path';

type Chunk = { type: string; body: number; end: number };
type ChunkReader = (bytes: Buffer, offset: number) => Chunk;

const JPEG_METADATA_MARKERS = new Map([
  [0xe1, 'APP1 (exif/xmp)'],
  [0xed, 'APP13 (iptc)'],
  [0xfe, 'COM (comment)']
]);
const JPEG_START_OF_SCAN = 0xda;
const PNG_SIGNATURE_LENGTH = 8;
const PNG_METADATA = new Set(['eXIf', 'tEXt', 'zTXt', 'iTXt', 'tIME']);
const RIFF_HEADER_LENGTH = 12;
const WEBP_METADATA = new Set(['EXIF', 'XMP ']);
const HEIF_METADATA = new Set(['Exif', 'mime']);
const FULL_BOX_HEADER = 4;

const ascii = (bytes: Buffer, start: number) => bytes.toString('latin1', start, start + 4);

const pngChunk: ChunkReader = (bytes, offset) => {
  const length = bytes.readUInt32BE(offset);
  return { type: ascii(bytes, offset + 4), body: offset + 8, end: offset + 12 + length };
};

const riffChunk: ChunkReader = (bytes, offset) => {
  const length = bytes.readUInt32LE(offset + 4);
  return { type: ascii(bytes, offset), body: offset + 8, end: offset + 8 + length + (length % 2) };
};

function boxSize(bytes: Buffer, offset: number): { size: number; header: number } {
  const size = bytes.readUInt32BE(offset);
  if (size === 1) return { size: Number(bytes.readBigUInt64BE(offset + 8)), header: 16 };
  if (size === 0) return { size: bytes.length - offset, header: 8 };
  return { size, header: 8 };
}

const isoBox: ChunkReader = (bytes, offset) => {
  const { size, header } = boxSize(bytes, offset);
  return { type: ascii(bytes, offset + 4), body: offset + header, end: offset + size };
};

function chunksBetween(bytes: Buffer, start: number, end: number, read: ChunkReader): Chunk[] {
  const chunks: Chunk[] = [];
  let offset = start;
  while (offset + 8 <= Math.min(end, bytes.length)) {
    const chunk = read(bytes, offset);
    if (chunk.end <= offset) break;
    chunks.push(chunk);
    offset = chunk.end;
  }
  return chunks;
}

function jpegMetadata(bytes: Buffer): string[] {
  const found: string[] = [];
  let offset = 2;
  while (offset + 4 <= bytes.length && bytes[offset] === 0xff && bytes[offset + 1] !== JPEG_START_OF_SCAN) {
    const label = JPEG_METADATA_MARKERS.get(bytes[offset + 1]);
    if (label) found.push(label);
    offset += 2 + bytes.readUInt16BE(offset + 2);
  }
  return found;
}

const typesIn = (chunks: Chunk[], wanted: Set<string>) => chunks.map(chunk => chunk.type).filter(type => wanted.has(type));

const pngMetadata = (bytes: Buffer) => typesIn(chunksBetween(bytes, PNG_SIGNATURE_LENGTH, bytes.length, pngChunk), PNG_METADATA);

const webpMetadata = (bytes: Buffer) => typesIn(chunksBetween(bytes, RIFF_HEADER_LENGTH, bytes.length, riffChunk), WEBP_METADATA);

function heifItemType(bytes: Buffer, infe: Chunk): string {
  const version = bytes[infe.body];
  if (version < 2) return '';
  const itemIdLength = version === 2 ? 2 : 4;
  return ascii(bytes, infe.body + FULL_BOX_HEADER + itemIdLength + 2);
}

const childBox = (bytes: Buffer, parent: Chunk | undefined, start: number, type: string) =>
  parent ? chunksBetween(bytes, start, parent.end, isoBox).find(box => box.type === type) : undefined;

function heifMetadata(bytes: Buffer): string[] {
  const meta = chunksBetween(bytes, 0, bytes.length, isoBox).find(box => box.type === 'meta');
  const itemInfo = childBox(bytes, meta, (meta?.body ?? 0) + FULL_BOX_HEADER, 'iinf');
  if (!itemInfo) return [];
  const entryCountLength = bytes[itemInfo.body] === 0 ? 2 : 4;
  const entries = chunksBetween(bytes, itemInfo.body + FULL_BOX_HEADER + entryCountLength, itemInfo.end, isoBox);
  return entries.map(infe => heifItemType(bytes, infe)).filter(type => HEIF_METADATA.has(type));
}

const finders: Record<string, (bytes: Buffer) => string[]> = {
  '.jpg': jpegMetadata,
  '.jpeg': jpegMetadata,
  '.png': pngMetadata,
  '.webp': webpMetadata,
  '.avif': heifMetadata
};

const filesToCheck = () => {
  const given = process.argv.slice(2);
  return given.length > 0 ? given : fs.globSync('public/**/*.{jpg,jpeg,png,webp,avif}');
};

function metadataIn(file: string): string[] {
  const find = finders[path.extname(file).toLowerCase()];
  return find ? [...new Set(find(fs.readFileSync(file)))].map(kind => `${file}: ${kind}`) : [];
}

const found = filesToCheck().flatMap(metadataIn);
if (found.length > 0) {
  console.error(`Images must carry no metadata (strip them, or run npm run photos):\n${found.join('\n')}`);
  process.exit(1);
}
