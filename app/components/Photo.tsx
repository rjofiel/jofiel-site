import type { MouseEvent, ReactNode } from 'react';
import { PhotoPicture } from '@/components/PhotoPicture';
import { getPhoto, inlineWidth, largestWidth, sideWidth, type PhotoEntry } from '@/lib/photos';
import { photoPath } from '@/lib/photoPaths';
import { isPlainClick, usePhotoViewer } from '@/lib/usePhotoViewer';

type LinkedPictureProps = { src: string; alt: string; photo: PhotoEntry; width: number };

const LinkedPicture = ({ src, alt, photo, width }: LinkedPictureProps) => {
  const viewer = usePhotoViewer();
  const openInViewer = (event: MouseEvent<HTMLAnchorElement>) => {
    if (viewer && isPlainClick(event) && viewer.open(src)) event.preventDefault();
  };
  return (
    <a href={photoPath(src, largestWidth(photo), 'webp')} className='block w-fit max-w-full cursor-zoom-in' onClick={openInViewer}>
      <PhotoPicture
        src={src}
        alt={alt}
        photo={photo}
        sizes={`${width}px`}
        className='post-photo block h-auto max-w-full border border-border'
        style={{ width }}
      />
    </a>
  );
};

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
