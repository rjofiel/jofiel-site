import type { MDXContent } from 'mdx/types';
import blogIndex from 'virtual:blog-index';

// Post bodies are split into their own chunks and loaded on demand; the list only needs the
// frontmatter, which the blog-index Vite plugin extracts at build time.
const bodies = import.meta.glob<{ default: MDXContent }>('/app/content/blog/*.mdx');

export const getAllPosts = () => blogIndex;

export const getPost = (filename: string) => blogIndex.find(post => post.filename === filename);

export const loadPost = (filename: string) => bodies[`/app/content/blog/${filename}.mdx`];

// 2026-11-17T22:00 -> "11/26, 22:00" (month/year, then time), as the blog has always shown it.
export function formatPostDate(date: string): string {
  const parsed = new Date(date);
  if (!date || isNaN(parsed.getTime())) return '';
  return parsed.toLocaleString('en-US', {
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}
