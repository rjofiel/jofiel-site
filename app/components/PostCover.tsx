import type { CSSProperties } from 'react';
import { DitheredImage } from '@/components/DitheredImage';
import { coverWidth, getPhoto, middleWidth } from '@/lib/photos';
import { photoPath } from '@/lib/photoPaths';
import { useHydrated } from '@/lib/useHydrated';

const DEVICE_PIXELS_PER_DOT = 2;

const dotSizeFor = (devicePixelRatio: number) => Math.min(1, DEVICE_PIXELS_PER_DOT / devicePixelRatio);

const SOFT_EDGES: CSSProperties = {
  maskImage:
    'linear-gradient(to right, transparent, black 18%, black 82%, transparent), linear-gradient(to bottom, transparent, black 14%, black 62%, transparent)',
  maskComposite: 'intersect'
};

type PostCoverProps = { src: string; alt: string };

export const PostCover = ({ src, alt }: PostCoverProps) => {
  const hydrated = useHydrated();
  const photo = getPhoto(src);
  const width = coverWidth(photo);
  return (
    <div
      className='pointer-events-none ml-auto -mb-8 max-w-full select-none sm:-mr-16'
      style={{ width, aspectRatio: `${photo.width} / ${photo.height}`, ...SOFT_EDGES }}>
      <DitheredImage
        src={photoPath(src, middleWidth(photo), 'webp')}
        alt={alt}
        width={width}
        dotSize={hydrated ? dotSizeFor(window.devicePixelRatio) : 1}
        className='block text-muted-foreground opacity-70'
      />
    </div>
  );
};
