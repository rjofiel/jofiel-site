import type { CSSProperties } from 'react';
import { PHOTO_FORMATS, photoSrcSet, middleWidth, type PhotoEntry } from '@/lib/photos';
import { photoPath } from '@/lib/photoPaths';

type PhotoPictureProps = {
  src: string;
  alt: string;
  photo: PhotoEntry;
  sizes: string;
  className: string;
  style?: CSSProperties;
  loading?: 'lazy' | 'eager';
};

export const PhotoPicture = ({ src, alt, photo, sizes, className, style, loading = 'lazy' }: PhotoPictureProps) => (
  <picture>
    {PHOTO_FORMATS.map(format => (
      <source key={format} type={`image/${format}`} srcSet={photoSrcSet(src, photo, format)} sizes={sizes} />
    ))}
    <img
      className={className}
      style={style}
      src={photoPath(src, middleWidth(photo), 'webp')}
      width={photo.width}
      height={photo.height}
      alt={alt}
      loading={loading}
      decoding='async'
    />
  </picture>
);
