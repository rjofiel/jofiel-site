import { DitheredImage } from '@/components/DitheredImage';

// Decorative twelfth doctor silhouette. Place it inside a `relative` container: it sits
// behind the content, bottom right, and fades out at the bottom.
export const DoctorSilhouette = () => (
  <div
    aria-hidden
    className='pointer-events-none absolute -bottom-8 -right-6 -z-10 w-56 select-none sm:-right-16 sm:w-80 [mask-image:linear-gradient(to_bottom,black_75%,transparent)]'>
    <DitheredImage
      src='/images/capaldi_gallifrey.webp'
      alt=''
      width={320}
      dotSize={1}
      contrast={1.3}
      invert
      className='text-muted-foreground opacity-25'
    />
  </div>
);
