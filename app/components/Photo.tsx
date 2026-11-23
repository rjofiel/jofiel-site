import { displayWidth, getPhoto, largestWidth, middleWidth, PHOTO_FORMATS, photoSizes, photoSrcSet } from '@/lib/photos';
import { photoPath } from '@/lib/photoPaths';

type PhotoProps = { src: string; alt: string };

export const Photo = ({ src, alt }: PhotoProps) => {
  const photo = getPhoto(src);
  return (
    <figure className='my-6'>
      <a href={photoPath(src, largestWidth(photo), 'webp')} className='block w-fit max-w-full'>
        <picture>
          {PHOTO_FORMATS.map(format => (
            <source key={format} type={`image/${format}`} srcSet={photoSrcSet(src, photo, format)} sizes={photoSizes(photo)} />
          ))}
          <img
            className='post-photo block h-auto max-w-full border border-border'
            style={{ width: displayWidth(photo) }}
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
