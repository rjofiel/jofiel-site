import { createContext, useContext } from 'react';

export type PhotoViewerHandle = { open: (src: string) => boolean };

export const PhotoViewerContext = createContext<PhotoViewerHandle | null>(null);

export const usePhotoViewer = () => useContext(PhotoViewerContext);

const SWIPE_DISTANCE = 40;

export const stepIndex = (index: number, delta: number, count: number) => (index + delta + count) % count;

export function swipeStep(deltaX: number): number {
  if (deltaX > SWIPE_DISTANCE) return -1;
  if (deltaX < -SWIPE_DISTANCE) return 1;
  return 0;
}

const ARROW_STEPS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };

export const arrowStep = (key: string) => ARROW_STEPS[key] ?? 0;

type ClickLike = { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean };

export const isPlainClick = (event: ClickLike) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
