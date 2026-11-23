import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { atkinsonDither, luminance, paintDots } from '../app/lib/dither.ts';
import { OG_IMAGE_SIZE, PHOTO_FORMATS, PHOTO_ROOT, PHOTO_WIDTHS, ogImagePath, photoPath, type PhotoFormat } from '../app/lib/photoPaths.ts';
import { readBlogIndex } from '../vite/blog-index.ts';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const blogDir = path.join(root, 'app/content/blog');
const originalsDir = path.join(root, 'private/photos');
const outputDir = path.join(root, 'public', PHOTO_ROOT);
const manifestPath = path.join(root, 'app/content/photos.json');

const QUALITY: Record<PhotoFormat, string> = { avif: '55', webp: '80' };
const OG_DOT_SIZE = 2;
const OG_CONTRAST = 1.4;
const OG_DOT_COLOUR = [235, 235, 235];
const OG_BACKGROUND = '#0a0a0a';
const PHOTO_TAG = /<Photo\b[^>]*?\bsrc=['"]([^'"]+)['"]/g;
const NO_PNG_TEXT = ['-define', 'png:exclude-chunks=date,time,text,zTXt,iTXt,eXIf'];

type Size = { width: number; height: number };
type PhotoEntry = Size & { widths: number[] };

const MAGICK_LOCATIONS = ['/opt/homebrew/bin/magick', '/usr/local/bin/magick', '/usr/bin/magick'];

function magickBinary(): string {
  const found = MAGICK_LOCATIONS.find(location => fs.existsSync(location));
  if (!found) throw new Error(`ImageMagick 7 not found in ${MAGICK_LOCATIONS.join(', ')}: brew install imagemagick`);
  return found;
}

const magick = (args: string[], input?: Buffer) => execFileSync(magickBinary(), args, { input, maxBuffer: 1 << 28 });

const firstFrame = (file: string) => [`${file}[0]`, '-auto-orient'];

const publicFile = (urlPath: string) => path.join(root, 'public', urlPath);

const isFresh = (output: string, original: string) => fs.existsSync(output) && fs.statSync(output).mtimeMs >= fs.statSync(original).mtimeMs;

function bodyPhotoKeys(): string[] {
  return fs
    .readdirSync(blogDir)
    .filter(file => file.endsWith('.mdx'))
    .flatMap(file => [...fs.readFileSync(path.join(blogDir, file), 'utf8').matchAll(PHOTO_TAG)].map(match => match[1]));
}

const coverKeys = () => readBlogIndex(blogDir).flatMap(post => (post.cover ? [post.cover] : []));

function originalOf(key: string): string {
  const dir = path.join(originalsDir, path.dirname(key));
  const name = path.basename(key);
  const file = fs.existsSync(dir) ? fs.readdirSync(dir).find(candidate => path.parse(candidate).name === name) : undefined;
  if (!file) throw new Error(`No original for ${key}: expected private/photos/${key}.<jpg|heic|png|webp>`);
  return path.join(dir, file);
}

function sizeOf(original: string, resize: string[] = []): Size {
  const [width, height] = magick([...firstFrame(original), ...resize, '-format', '%w %h', 'info:'])
    .toString()
    .split(' ')
    .map(Number);
  return { width, height };
}

function widthsFor(naturalWidth: number): number[] {
  const fitting = PHOTO_WIDTHS.filter(width => width < naturalWidth);
  return fitting.length < PHOTO_WIDTHS.length ? [...fitting, naturalWidth] : fitting;
}

function writeVariant(original: string, output: string, width: number, format: PhotoFormat): void {
  if (isFresh(output, original)) return;
  fs.mkdirSync(path.dirname(output), { recursive: true });
  magick([...firstFrame(original), '-strip', '-resize', `${width}x`, '-quality', QUALITY[format], output]);
}

function renderPhoto(key: string): { entry: PhotoEntry; files: string[] } {
  const original = originalOf(key);
  const natural = sizeOf(original);
  const widths = widthsFor(natural.width);
  const files = widths.flatMap(width =>
    PHOTO_FORMATS.map(format => {
      const output = publicFile(photoPath(key, width, format));
      writeVariant(original, output, width, format);
      return output;
    })
  );
  const largest = widths[widths.length - 1];
  const height = Math.round((natural.height * largest) / natural.width);
  return { entry: { width: largest, height, widths }, files };
}

function ditheredPixels(original: string, fit: string[], grid: Size): Buffer {
  const rgba = new Uint8ClampedArray(magick([...firstFrame(original), ...fit, '-depth', '8', 'RGBA:-']));
  const dots = atkinsonDither(luminance(rgba, OG_CONTRAST), { cols: grid.width, rows: grid.height });
  paintDots(rgba, dots, OG_DOT_COLOUR, false);
  return Buffer.from(rgba.buffer, rgba.byteOffset, rgba.byteLength);
}

function renderShareImage(key: string): string {
  const original = originalOf(key);
  const output = publicFile(ogImagePath(key));
  if (isFresh(output, original)) return output;
  const fit = ['-resize', `${OG_IMAGE_SIZE.width / OG_DOT_SIZE}x${OG_IMAGE_SIZE.height / OG_DOT_SIZE}`];
  const grid = sizeOf(original, fit);
  const canvas = `${OG_IMAGE_SIZE.width}x${OG_IMAGE_SIZE.height}`;
  magick(
    [
      ...['-size', `${grid.width}x${grid.height}`, '-depth', '8', 'RGBA:-'],
      ...['-filter', 'point', '-resize', `${OG_DOT_SIZE * 100}%`],
      ...['-background', OG_BACKGROUND, '-flatten', '-gravity', 'center', '-extent', canvas],
      ...['-strip', ...NO_PNG_TEXT, output]
    ],
    ditheredPixels(original, fit, grid)
  );
  return output;
}

function removeUnreferenced(keep: Set<string>): void {
  if (!fs.existsSync(outputDir)) return;
  const entries = fs.readdirSync(outputDir, { recursive: true, encoding: 'utf8' }).map(entry => path.join(outputDir, entry));
  for (const file of entries.filter(entry => fs.statSync(entry).isFile() && !keep.has(entry))) fs.rmSync(file);
  const directories = entries.filter(entry => fs.existsSync(entry) && fs.statSync(entry).isDirectory());
  for (const dir of directories.reverse().filter(entry => fs.readdirSync(entry).length === 0)) fs.rmdirSync(dir);
}

function main(): void {
  const covers = coverKeys();
  const keys = [...new Set([...bodyPhotoKeys(), ...covers])].sort();
  const manifest: Record<string, PhotoEntry> = {};
  const keep = new Set<string>();
  for (const key of keys) {
    const { entry, files } = renderPhoto(key);
    manifest[key] = entry;
    files.forEach(file => keep.add(file));
  }
  covers.forEach(key => keep.add(renderShareImage(key)));
  removeUnreferenced(keep);
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`${keys.length} photos (${covers.length} covers) in public${PHOTO_ROOT}`);
}

main();
