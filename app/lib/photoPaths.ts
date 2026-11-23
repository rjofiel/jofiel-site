export const PHOTO_ROOT = '/images/blog';

export const PHOTO_WIDTHS = [480, 960, 1440];

export const PHOTO_FORMATS = ['avif', 'webp'] as const;

export type PhotoFormat = (typeof PHOTO_FORMATS)[number];

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export const photoPath = (key: string, width: number, format: PhotoFormat) => `${PHOTO_ROOT}/${key}-${width}.${format}`;

export const ogImagePath = (key: string) => `${PHOTO_ROOT}/${key}-og.png`;
