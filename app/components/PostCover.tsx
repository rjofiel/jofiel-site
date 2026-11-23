import { DitheredImage } from '@/components/DitheredImage';
import { displayWidth, getPhoto, middleWidth } from '@/lib/photos';
import { photoPath } from '@/lib/photoPaths';

const DOT_SIZE = 1;

type PostCoverProps = { src: string; alt: string };

export const PostCover = ({ src, alt }: PostCoverProps) => {
  const photo = getPhoto(src);
  const width = displayWidth(photo);
  return (
    <div className='my-6 max-w-full' style={{ width, aspectRatio: `${photo.width} / ${photo.height}` }}>
      <DitheredImage
        src={photoPath(src, middleWidth(photo), 'webp')}
        alt={alt}
        width={width}
        dotSize={DOT_SIZE}
        className='block text-muted-foreground'
      />
    </div>
  );
};
