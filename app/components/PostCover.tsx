import { DitheredImage } from '@/components/DitheredImage';
import { coverWidth, getPhoto, middleWidth } from '@/lib/photos';
import { photoPath } from '@/lib/photoPaths';
import { useHydrated } from '@/lib/useHydrated';

const MAX_DOTS_PER_PIXEL = 2;

const finestDotSize = () => 1 / Math.min(MAX_DOTS_PER_PIXEL, Math.max(1, Math.floor(window.devicePixelRatio)));

type PostCoverProps = { src: string; alt: string };

export const PostCover = ({ src, alt }: PostCoverProps) => {
  const hydrated = useHydrated();
  const photo = getPhoto(src);
  const width = coverWidth(photo);
  return (
    <div
      className='pointer-events-none ml-auto -mb-8 max-w-full select-none sm:-mr-16 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]'
      style={{ width, aspectRatio: `${photo.width} / ${photo.height}` }}>
      <DitheredImage
        src={photoPath(src, middleWidth(photo), 'webp')}
        alt={alt}
        width={width}
        dotSize={hydrated ? finestDotSize() : 1}
        className='block text-muted-foreground opacity-70'
      />
    </div>
  );
};
