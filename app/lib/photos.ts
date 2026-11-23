import manifest from '../content/photos.json';
import { PHOTO_FORMATS, photoPath, type PhotoFormat } from './photoPaths';

export type PhotoEntry = { width: number; height: number; widths: number[] };

const photos: Record<string, PhotoEntry> = manifest;

const PHOTO_BOX = { width: 272, height: 192 };

export const displayWidth = (photo: PhotoEntry) => Math.min(PHOTO_BOX.width, Math.round((PHOTO_BOX.height * photo.width) / photo.height));

export const photoSizes = (photo: PhotoEntry) => `${displayWidth(photo)}px`;

export const largestWidth = (photo: PhotoEntry) => photo.widths[photo.widths.length - 1];

export { PHOTO_FORMATS };

export function getPhoto(key: string): PhotoEntry {
  const photo = photos[key];
  if (!photo) throw new Error(`No photo ${key}: put it in private/photos and run npm run photos`);
  return photo;
}

export const photoSrcSet = (key: string, photo: PhotoEntry, format: PhotoFormat) =>
  photo.widths.map(width => `${photoPath(key, width, format)} ${width}w`).join(', ');

export const middleWidth = (photo: PhotoEntry) => photo.widths[Math.floor((photo.widths.length - 1) / 2)];
