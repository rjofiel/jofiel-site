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
const cropsPath = path.join(root, 'app/content/photo-crops.json');

const QUALITY: Record<PhotoFormat, string> = { avif: '64', webp: '82' };
const OG_DOT_SIZE = 2;
const OG_CONTRAST = 1.4;
const OG_DOT_COLOUR = [235, 235, 235];
const OG_BACKGROUND = '#0a0a0a';
const NO_PNG_TEXT = ['-define', 'png:exclude-chunks=date,time,text,zTXt,iTXt,eXIf'];

type Size = { width: number; height: number };
type PhotoEntry = Size & { widths: number[] };
type Crop = { x: number; y: number; width: number; height: number };
type Source = { file: string; args: string[] };

const crops: Record<string, Crop> = JSON.parse(fs.readFileSync(cropsPath, 'utf8'));

const MAGICK_LOCATIONS = ['/opt/homebrew/bin/magick', '/usr/local/bin/magick', '/usr/bin/magick'];

function magickBinary(): string {
  const found = MAGICK_LOCATIONS.find(location => fs.existsSync(location));
  if (!found) throw new Error(`ImageMagick 7 not found in ${MAGICK_LOCATIONS.join(', ')}: brew install imagemagick`);
  return found;
}

const magick = (args: string[], input?: Buffer) => execFileSync(magickBinary(), args, { input, maxBuffer: 1 << 28 });

const firstFrame = (file: string) => [`${file}[0]`, '-auto-orient'];

const publicFile = (urlPath: string) => path.join(root, 'public', urlPath);

const changedAt = (source: Source) => Math.max(fs.statSync(source.file).mtimeMs, fs.statSync(cropsPath).mtimeMs);

const isFresh = (output: string, source: Source) => fs.existsSync(output) && fs.statSync(output).mtimeMs >= changedAt(source);

const bodyPhotoKeys = () => readBlogIndex(blogDir).flatMap(post => post.photos.map(photo => photo.src));

const coverKeys = () => readBlogIndex(blogDir).flatMap(post => (post.cover ? [post.cover] : []));

function originalOf(key: string): string {
  const dir = path.join(originalsDir, path.dirname(key));
  const name = path.basename(key);
  const file = fs.existsSync(dir) ? fs.readdirSync(dir).find(candidate => path.parse(candidate).name === name) : undefined;
  if (!file) throw new Error(`No original for ${key}: expected private/photos/${key}.<jpg|heic|png|webp>`);
  return path.join(dir, file);
}

function sizeOf(args: string[]): Size {
  const [width, height] = magick([...args, '-format', '%w %h', 'info:'])
    .toString()
    .split(' ')
    .map(Number);
  return { width, height };
}

function cropArgs(key: string, file: string): string[] {
  const crop = crops[key];
  if (!crop) return [];
  const whole = sizeOf(firstFrame(file));
  const along = (fraction: number, total: number) => Math.round(fraction * total);
  const box = `${along(crop.width, whole.width)}x${along(crop.height, whole.height)}`;
  return ['-crop', `${box}+${along(crop.x, whole.width)}+${along(crop.y, whole.height)}`, '+repage'];
}

function sourceOf(key: string): Source {
  const file = originalOf(key);
  return { file, args: [...firstFrame(file), ...cropArgs(key, file)] };
}

function widthsFor(naturalWidth: number): number[] {
  const fitting = PHOTO_WIDTHS.filter(width => width < naturalWidth);
  return fitting.length < PHOTO_WIDTHS.length ? [...fitting, naturalWidth] : fitting;
}

function writeVariant(source: Source, output: string, width: number, format: PhotoFormat): void {
  if (isFresh(output, source)) return;
  fs.mkdirSync(path.dirname(output), { recursive: true });
  magick([...source.args, '-strip', '-resize', `${width}x`, '-quality', QUALITY[format], output]);
}

function renderPhoto(key: string): { entry: PhotoEntry; files: string[] } {
  const source = sourceOf(key);
  const natural = sizeOf(source.args);
  const widths = widthsFor(natural.width);
  const files = widths.flatMap(width =>
    PHOTO_FORMATS.map(format => {
      const output = publicFile(photoPath(key, width, format));
      writeVariant(source, output, width, format);
      return output;
    })
  );
  const largest = widths[widths.length - 1];
  const height = Math.round((natural.height * largest) / natural.width);
  return { entry: { width: largest, height, widths }, files };
}

function ditheredPixels(source: Source, fit: string[], grid: Size): Buffer {
  const rgba = new Uint8ClampedArray(magick([...source.args, ...fit, '-depth', '8', 'RGBA:-']));
  const dots = atkinsonDither(luminance(rgba, OG_CONTRAST), { cols: grid.width, rows: grid.height });
  paintDots(rgba, dots, OG_DOT_COLOUR, false);
  return Buffer.from(rgba.buffer, rgba.byteOffset, rgba.byteLength);
}

function renderShareImage(key: string): string {
  const source = sourceOf(key);
  const output = publicFile(ogImagePath(key));
  if (isFresh(output, source)) return output;
  const fit = ['-resize', `${OG_IMAGE_SIZE.width / OG_DOT_SIZE}x${OG_IMAGE_SIZE.height / OG_DOT_SIZE}`];
  const grid = sizeOf([...source.args, ...fit]);
  const canvas = `${OG_IMAGE_SIZE.width}x${OG_IMAGE_SIZE.height}`;
  magick(
    [
      ...['-size', `${grid.width}x${grid.height}`, '-depth', '8', 'RGBA:-'],
      ...['-filter', 'point', '-resize', `${OG_DOT_SIZE * 100}%`],
      ...['-background', OG_BACKGROUND, '-flatten', '-gravity', 'center', '-extent', canvas],
      ...['-strip', ...NO_PNG_TEXT, output]
    ],
    ditheredPixels(source, fit, grid)
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
