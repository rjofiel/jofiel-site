import type { MouseEvent, ReactNode } from 'react';
import { PhotoPicture } from '@/components/PhotoPicture';
import { getPhoto, inlineWidth, isLandscape, largestWidth, sideWidth, type PhotoEntry } from '@/lib/photos';
import { photoPath } from '@/lib/photoPaths';
import { isPlainClick, usePhotoViewer } from '@/lib/usePhotoViewer';

type LinkedPictureProps = { src: string; alt: string; photo: PhotoEntry; width: number };

const LoadingPlaceholder = () => (
  <span
    aria-hidden='true'
    className='absolute inset-0 grid place-items-center border border-dashed border-border text-xs text-muted-foreground'>
    <span>
      loading<span className='blink'>_</span>
    </span>
  </span>
);

const LinkedPicture = ({ src, alt, photo, width }: LinkedPictureProps) => {
  const viewer = usePhotoViewer();
  const openInViewer = (event: MouseEvent<HTMLAnchorElement>) => {
    if (viewer && isPlainClick(event) && viewer.open(src)) event.preventDefault();
  };
  return (
    <a
      href={photoPath(src, largestWidth(photo), 'webp')}
      className='relative mx-auto block w-fit max-w-full cursor-zoom-in sm:mx-0'
      onClick={openInViewer}>
      <LoadingPlaceholder />
      <PhotoPicture
        src={src}
        alt={alt}
        photo={photo}
        sizes={`${width}px`}
        className='post-photo relative block h-auto max-w-full border border-border'
        style={{ width }}
      />
    </a>
  );
};

type PhotoProps = { src: string; alt: string; children?: ReactNode };

const InlinePhoto = ({ src, alt, photo }: Omit<LinkedPictureProps, 'width'>) => (
  <figure className='my-6'>
    <LinkedPicture src={src} alt={alt} photo={photo} width={inlineWidth(photo)} />
  </figure>
);

export const Photo = ({ src, alt, children }: PhotoProps) => {
  const photo = getPhoto(src);
  if (!children) return <InlinePhoto src={src} alt={alt} photo={photo} />;
  if (isLandscape(photo)) {
    return (
      <>
        {children}
        <InlinePhoto src={src} alt={alt} photo={photo} />
      </>
    );
  }
  return (
    <div className='flex flex-col sm:flex-row sm:items-start sm:gap-6'>
      <div className='min-w-0 flex-1'>{children}</div>
      <figure className='mb-6 self-center sm:mt-1 sm:mb-4 sm:self-start'>
        <LinkedPicture src={src} alt={alt} photo={photo} width={sideWidth(photo)} />
      </figure>
    </div>
  );
};
