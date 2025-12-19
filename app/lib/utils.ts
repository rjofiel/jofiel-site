import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseFilename(filename: string): { slug: string; readableDate: string } {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2}_\d{2}-\d{2})-(.+)$/);
  if (!match) return { slug: '', readableDate: '' };

  const [_, datePart, slug] = match;

  const dateStr = datePart.replace('_', ' ').replace(/-(\d{2})$/, ':$1');

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return { slug: '', readableDate: '' };

  const readableDate = date.toLocaleString('en-US', {
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return { slug, readableDate };
}
