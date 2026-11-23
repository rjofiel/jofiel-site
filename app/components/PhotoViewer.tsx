import { useCallback, useMemo, useRef, useState, type ReactNode, type TouchEvent } from 'react';
import { PhotoPicture } from '@/components/PhotoPicture';
import type { PhotoRef } from '@/lib/meta';
import { getPhoto } from '@/lib/photos';
import { arrowStep, PhotoViewerContext, stepIndex, swipeStep } from '@/lib/usePhotoViewer';

const VIEWER_SIZES = '92vw';

type ViewerControlsProps = { label: string; count: number; onStep: (delta: number) => void };

const ViewerControls = ({ label, count, onStep }: ViewerControlsProps) => (
  <div className='flex w-full max-w-2xl items-center justify-between gap-4 text-xs text-muted-foreground'>
    <button
      type='button'
      aria-label='previous photo'
      className='px-3 py-2 hover:text-foreground'
      hidden={count < 2}
      onClick={() => onStep(-1)}>
      {'<'}
    </button>
    <p className='text-center'>{label}</p>
    <button type='button' aria-label='next photo' className='px-3 py-2 hover:text-foreground' hidden={count < 2} onClick={() => onStep(1)}>
      {'>'}
    </button>
  </div>
);

type PhotoViewerProps = { photos: PhotoRef[]; children: ReactNode };

export const PhotoViewer = ({ photos, children }: PhotoViewerProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef(0);
  const [index, setIndex] = useState(0);

  const open = useCallback(
    (src: string) => {
      const at = photos.findIndex(photo => photo.src === src);
      if (at < 0 || !dialogRef.current) return false;
      setIndex(at);
      dialogRef.current.showModal();
      return true;
    },
    [photos]
  );
  const handle = useMemo(() => ({ open }), [open]);
  const step = (delta: number) => setIndex(current => stepIndex(current, delta, photos.length));
  const close = () => dialogRef.current?.close();
  const endSwipe = (event: TouchEvent) => step(swipeStep(event.changedTouches[0].clientX - touchStartX.current));

  const current = photos[index];
  return (
    <PhotoViewerContext value={handle}>
      {children}
      {current && (
        <dialog
          ref={dialogRef}
          aria-label='photo viewer'
          className='m-0 h-svh max-h-none w-screen max-w-none bg-background/95 p-0 text-foreground backdrop:bg-black/60'
          onKeyDown={event => step(arrowStep(event.key))}
          onTouchStart={event => (touchStartX.current = event.touches[0].clientX)}
          onTouchEnd={endSwipe}>
          <div
            className='flex h-full flex-col items-center justify-center gap-3 p-4'
            onClick={event => event.target === event.currentTarget && close()}>
            <button
              type='button'
              aria-label='close'
              className='absolute top-3 right-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground'
              onClick={close}>
              x
            </button>
            <PhotoPicture
              key={current.src}
              src={current.src}
              alt={current.alt}
              photo={getPhoto(current.src)}
              sizes={VIEWER_SIZES}
              loading='eager'
              className='block h-auto max-h-[80svh] w-auto max-w-full border border-border object-contain'
            />
            <ViewerControls label={`${index + 1}/${photos.length} · ${current.alt}`} count={photos.length} onStep={step} />
          </div>
        </dialog>
      )}
    </PhotoViewerContext>
  );
};
