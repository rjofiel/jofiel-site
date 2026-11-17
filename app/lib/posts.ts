import { lazy, type LazyExoticComponent } from 'react';
import type { MDXContent } from 'mdx/types';
import blogIndex from 'virtual:blog-index';
import { SITE_TIME_ZONE } from './time';

// Post bodies are split into their own chunks and loaded on demand; the list only needs the
// frontmatter, which the blog-index Vite plugin extracts at build time.
const bodies = import.meta.glob<{ default: MDXContent }>('/app/content/blog/*.mdx');
const lazyBodies = new Map<string, LazyExoticComponent<MDXContent>>();

export const getAllPosts = () => blogIndex;

export const getPost = (filename: string) => blogIndex.find(post => post.filename === filename);

// One lazy component per post, created once: render it inside <Suspense>. The prerender waits
// for it and hydration keeps the prerendered text until the chunk arrives.
export function postBody(filename: string): LazyExoticComponent<MDXContent> | undefined {
  const load = bodies[`/app/content/blog/${filename}.mdx`];
  if (!load) return undefined;
  if (!lazyBodies.has(filename)) lazyBodies.set(filename, lazy(load));
  return lazyBodies.get(filename);
}

// 2026-11-17T22:00:00+01:00 -> "11/26, 22:00" (month/year, then time), always in Madrid time.
export function formatPostDate(date: string): string {
  const parsed = new Date(date);
  if (!date || isNaN(parsed.getTime())) return '';
  return parsed.toLocaleString('en-US', {
    timeZone: SITE_TIME_ZONE,
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}
