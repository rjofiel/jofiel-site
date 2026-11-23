import { DitheredImage } from '@/components/DitheredImage';
import { getPhoto, middleWidth, type PhotoEntry } from '@/lib/photos';
import { photoPath } from '@/lib/photoPaths';

const COLUMN_WIDTH = 672;
const MAX_COVER_HEIGHT = 360;
const DOT_SIZE = 2;

const coverWidth = (photo: PhotoEntry) => Math.min(COLUMN_WIDTH, Math.round((MAX_COVER_HEIGHT * photo.width) / photo.height));

type PostCoverProps = { src: string; alt: string };

export const PostCover = ({ src, alt }: PostCoverProps) => {
  const photo = getPhoto(src);
  const width = coverWidth(photo);
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
