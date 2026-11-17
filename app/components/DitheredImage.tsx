import { useEffect, useRef } from 'react';

type DitheredImageProps = {
  src: string;
  alt: string;
  // Rendered width in CSS pixels; height follows the image aspect ratio.
  width: number;
  // Size of one dither dot in CSS pixels. Bigger means chunkier, more "terminal".
  dotSize?: number;
  // Pushes mid-tones apart before dithering so faces keep their shape.
  contrast?: number;
  // Draw the dark tones instead of the light ones. Works better for photos with a bright sky.
  invert?: boolean;
  className?: string;
};

// Renders an image as 1-bit Atkinson dithering in the current text colour, with a
// transparent background, so photos sit on the dark theme like terminal output.
export const DitheredImage = ({
  src,
  alt,
  width,
  dotSize = 2,
  contrast = 1.4,
  invert = false,
  className
}: DitheredImageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    const image = new Image();
    image.decoding = 'async';
    image.src = src;
    image.onload = () => {
      if (cancelled) return;
      const cols = Math.max(1, Math.round(width / dotSize));
      const rows = Math.max(1, Math.round((cols * image.naturalHeight) / image.naturalWidth));
      canvas.width = cols;
      canvas.height = rows;
      // Height follows the intrinsic aspect ratio, so a parent can shrink it on small screens.
      canvas.style.width = `${cols * dotSize}px`;

      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return;
      context.drawImage(image, 0, 0, cols, rows);
      const pixels = context.getImageData(0, 0, cols, rows);
      const data = pixels.data;

      const luminance = new Float32Array(cols * rows);
      for (let i = 0; i < luminance.length; i++) {
        const gray = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
        luminance[i] = Math.min(255, Math.max(0, (gray - 128) * contrast + 128));
      }

      // Atkinson: spreads 6/8 of the error to six neighbours, which keeps highlights clean.
      const spread: [number, number][] = [[1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [0, 2]];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const index = y * cols + x;
          const value = luminance[index] < 128 ? 0 : 255;
          const error = (luminance[index] - value) / 8;
          luminance[index] = value;
          for (const [dx, dy] of spread) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < cols && ny < rows) luminance[ny * cols + nx] += error;
          }
        }
      }

      const [r, g, b] = (getComputedStyle(canvas).color.match(/\d+/g) ?? ['200', '200', '200']).map(Number);
      for (let i = 0; i < luminance.length; i++) {
        data[i * 4] = r;
        data[i * 4 + 1] = g;
        data[i * 4 + 2] = b;
        data[i * 4 + 3] = (luminance[i] > 0) !== invert ? 255 : 0;
      }
      context.putImageData(pixels, 0, 0);
    };
    return () => {
      cancelled = true;
    };
  }, [src, width, dotSize, contrast, invert]);

  return <canvas ref={canvasRef} role='img' aria-label={alt} className={className} style={{ imageRendering: 'pixelated', maxWidth: '100%', height: 'auto' }} />;
};
