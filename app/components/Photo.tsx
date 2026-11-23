import { getPhoto, middleWidth, PHOTO_FORMATS, PHOTO_SIZES, photoSrcSet } from '@/lib/photos';
import { photoPath } from '@/lib/photoPaths';

const MAX_VIEWPORT_HEIGHT = '75svh';

type PhotoProps = { src: string; alt: string };

export const Photo = ({ src, alt }: PhotoProps) => {
  const photo = getPhoto(src);
  return (
    <figure className='my-6'>
      <picture>
        {PHOTO_FORMATS.map(format => (
          <source key={format} type={`image/${format}`} srcSet={photoSrcSet(src, photo, format)} sizes={PHOTO_SIZES} />
        ))}
        <img
          className='post-photo block h-auto border border-border'
          style={{ maxWidth: `min(100%, calc(${MAX_VIEWPORT_HEIGHT} * ${photo.width} / ${photo.height}))` }}
          src={photoPath(src, middleWidth(photo), 'webp')}
          width={photo.width}
          height={photo.height}
          alt={alt}
          loading='lazy'
          decoding='async'
        />
      </picture>
    </figure>
  );
};
