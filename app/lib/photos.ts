import manifest from '../content/photos.json';
import { PHOTO_FORMATS, photoPath, type PhotoFormat } from './photoPaths';

export type PhotoEntry = { width: number; height: number; widths: number[] };

type Box = { width: number; height: number };

const photos: Record<string, PhotoEntry> = manifest;

const INLINE_BOX: Box = { width: 272, height: 192 };

const SIDE_BOX: Box = { width: 185, height: 252 };

const COVER_BOX: Box = { width: 256, height: 256 };

const fitWidth = (photo: PhotoEntry, box: Box) => Math.min(box.width, Math.round((box.height * photo.width) / photo.height));

export const isPortrait = (photo: PhotoEntry) => photo.height > photo.width;

export const inlineWidth = (photo: PhotoEntry) => fitWidth(photo, INLINE_BOX);

export const sideWidth = (photo: PhotoEntry) => fitWidth(photo, SIDE_BOX);

export const coverWidth = (photo: PhotoEntry) => fitWidth(photo, COVER_BOX);

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
