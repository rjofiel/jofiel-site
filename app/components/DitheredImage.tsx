import { useEffect, useRef } from 'react';
import { atkinsonDither, cssColorChannels, luminance, paintDots, type Grid } from '@/lib/dither';

type DitheredImageProps = {
  src: string;
  alt: string;
  width: number;
  dotSize?: number;
  contrast?: number;
  invert?: boolean;
  className?: string;
};

type DitherOptions = Required<Pick<DitheredImageProps, 'width' | 'dotSize' | 'contrast' | 'invert'>>;

function gridFor(image: HTMLImageElement, width: number, dotSize: number): Grid {
  const cols = Math.max(1, Math.round(width / dotSize));
  return { cols, rows: Math.max(1, Math.round((cols * image.naturalHeight) / image.naturalWidth)) };
}

function drawDithered(canvas: HTMLCanvasElement, image: HTMLImageElement, options: DitherOptions): void {
  const grid = gridFor(image, options.width, options.dotSize);
  canvas.width = grid.cols;
  canvas.height = grid.rows;
  canvas.style.width = `${grid.cols * options.dotSize}px`;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return;
  context.drawImage(image, 0, 0, grid.cols, grid.rows);
  const pixels = context.getImageData(0, 0, grid.cols, grid.rows);
  const dots = atkinsonDither(luminance(pixels.data, options.contrast), grid);
  paintDots(pixels.data, dots, cssColorChannels(getComputedStyle(canvas).color), options.invert);
  context.putImageData(pixels, 0, 0);
}

export const DitheredImage = ({ src, alt, width, dotSize = 2, contrast = 1.4, invert = false, className }: DitheredImageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.decoding = 'async';
    image.src = src;
    image.onload = () => {
      if (!cancelled && canvasRef.current) drawDithered(canvasRef.current, image, { width, dotSize, contrast, invert });
    };
    return () => {
      cancelled = true;
    };
  }, [src, width, dotSize, contrast, invert]);

  return (
    <canvas
      ref={canvasRef}
      role='img'
      aria-label={alt}
      className={className}
      style={{ imageRendering: 'pixelated', maxWidth: '100%', height: 'auto' }}
    />
  );
};
