import type { ReactNode } from 'react';
import { getPhoto, inlineWidth, largestWidth, middleWidth, PHOTO_FORMATS, photoSrcSet, sideWidth, type PhotoEntry } from '@/lib/photos';
import { photoPath } from '@/lib/photoPaths';

type PictureProps = { src: string; alt: string; photo: PhotoEntry; width: number };

const LinkedPicture = ({ src, alt, photo, width }: PictureProps) => (
  <a href={photoPath(src, largestWidth(photo), 'webp')} className='block w-fit max-w-full'>
    <picture>
      {PHOTO_FORMATS.map(format => (
        <source key={format} type={`image/${format}`} srcSet={photoSrcSet(src, photo, format)} sizes={`${width}px`} />
      ))}
      <img
        className='post-photo block h-auto max-w-full border border-border'
        style={{ width }}
        src={photoPath(src, middleWidth(photo), 'webp')}
        width={photo.width}
        height={photo.height}
        alt={alt}
        loading='lazy'
        decoding='async'
      />
    </picture>
  </a>
);

type PhotoProps = { src: string; alt: string; children?: ReactNode };

export const Photo = ({ src, alt, children }: PhotoProps) => {
  const photo = getPhoto(src);
  if (!children) {
    return (
      <figure className='my-6'>
        <LinkedPicture src={src} alt={alt} photo={photo} width={inlineWidth(photo)} />
      </figure>
    );
  }
  return (
    <div className='flex flex-col sm:flex-row sm:items-start sm:gap-6'>
      <div className='min-w-0 flex-1'>{children}</div>
      <figure className='mb-6 self-end sm:mt-1 sm:mb-4 sm:self-start'>
        <LinkedPicture src={src} alt={alt} photo={photo} width={sideWidth(photo)} />
      </figure>
    </div>
  );
};
