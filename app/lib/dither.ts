const ATKINSON_NEIGHBOURS: [number, number][] = [
  [1, 0],
  [2, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [0, 2]
];

export type Grid = { cols: number; rows: number };

export function luminance(rgba: Uint8ClampedArray, contrast: number): Float32Array {
  const values = new Float32Array(rgba.length / 4);
  for (let i = 0; i < values.length; i++) {
    const gray = 0.299 * rgba[i * 4] + 0.587 * rgba[i * 4 + 1] + 0.114 * rgba[i * 4 + 2];
    values[i] = Math.min(255, Math.max(0, (gray - 128) * contrast + 128));
  }
  return values;
}

function spreadError(values: Float32Array, grid: Grid, x: number, y: number, error: number): void {
  for (const [dx, dy] of ATKINSON_NEIGHBOURS) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < grid.cols && ny < grid.rows) values[ny * grid.cols + nx] += error;
  }
}

export function atkinsonDither(values: Float32Array, grid: Grid): Float32Array {
  for (let y = 0; y < grid.rows; y++) {
    for (let x = 0; x < grid.cols; x++) {
      const index = y * grid.cols + x;
      const quantized = values[index] < 128 ? 0 : 255;
      spreadError(values, grid, x, y, (values[index] - quantized) / 8);
      values[index] = quantized;
    }
  }
  return values;
}

export function paintDots(rgba: Uint8ClampedArray, dots: Float32Array, color: number[], invert: boolean): void {
  const [r, g, b] = color;
  for (let i = 0; i < dots.length; i++) {
    rgba.set([r, g, b, dots[i] > 0 !== invert ? 255 : 0], i * 4);
  }
}

export const cssColorChannels = (color: string) => (color.match(/\d+/g) ?? ['200', '200', '200']).map(Number);
