import manifest from '../content/photos.json';
import { PHOTO_FORMATS, photoPath, type PhotoFormat } from './photoPaths';

export type PhotoEntry = { width: number; height: number; widths: number[] };

const photos: Record<string, PhotoEntry> = manifest;

export const PHOTO_SIZES = '(min-width: 720px) 672px, calc(100vw - 3rem)';

export { PHOTO_FORMATS };

export function getPhoto(key: string): PhotoEntry {
  const photo = photos[key];
  if (!photo) throw new Error(`No photo ${key}: put it in private/photos and run npm run photos`);
  return photo;
}

export const photoSrcSet = (key: string, photo: PhotoEntry, format: PhotoFormat) =>
  photo.widths.map(width => `${photoPath(key, width, format)} ${width}w`).join(', ');

export const middleWidth = (photo: PhotoEntry) => photo.widths[Math.floor((photo.widths.length - 1) / 2)];
