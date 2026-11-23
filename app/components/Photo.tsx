import type { CSSProperties } from 'react';
import {
  defaultLayout,
  displayWidth,
  getPhoto,
  largestWidth,
  middleWidth,
  PHOTO_FORMATS,
  photoSizes,
  photoSrcSet,
  sideWidth,
  type PhotoEntry,
  type PhotoLayout
} from '@/lib/photos';
import { photoPath } from '@/lib/photoPaths';

type PhotoProps = { src: string; alt: string; layout?: PhotoLayout };

const FIGURE_CLASS: Record<PhotoLayout, string> = {
  inline: 'my-6',
  side: 'my-6 sm:float-right sm:mt-1 sm:mb-4 sm:ml-6'
};

const IMAGE_CLASS: Record<PhotoLayout, string> = {
  inline: 'w-(--photo-width)',
  side: 'w-(--photo-width) sm:w-(--side-width)'
};

const widthVariables = (photo: PhotoEntry) =>
  ({ '--photo-width': `${displayWidth(photo)}px`, '--side-width': `${sideWidth(photo)}px` }) as CSSProperties;

export const Photo = ({ src, alt, layout }: PhotoProps) => {
  const photo = getPhoto(src);
  const placement = layout ?? defaultLayout(photo);
  return (
    <figure className={FIGURE_CLASS[placement]}>
      <a href={photoPath(src, largestWidth(photo), 'webp')} className='block w-fit max-w-full'>
        <picture>
          {PHOTO_FORMATS.map(format => (
            <source key={format} type={`image/${format}`} srcSet={photoSrcSet(src, photo, format)} sizes={photoSizes(photo, placement)} />
          ))}
          <img
            className={`post-photo block h-auto max-w-full border border-border ${IMAGE_CLASS[placement]}`}
            style={widthVariables(photo)}
            src={photoPath(src, middleWidth(photo), 'webp')}
            width={photo.width}
            height={photo.height}
            alt={alt}
            loading='lazy'
            decoding='async'
          />
        </picture>
      </a>
    </figure>
  );
};
