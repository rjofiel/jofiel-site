import { lazy, type LazyExoticComponent } from 'react';
import type { MDXContent } from 'mdx/types';
import blogIndex from 'virtual:blog-index';
import { SITE_TIME_ZONE } from './time';

const bodies = import.meta.glob<{ default: MDXContent }>('/app/content/blog/*.mdx');
const lazyBodies = new Map<string, LazyExoticComponent<MDXContent>>();
const readyBodies = new Map<string, MDXContent>();

export const getAllPosts = () => blogIndex;

export const getPost = (filename: string) => blogIndex.find(post => post.filename === filename);

export function preloadPost(filename: string): void {
  const load = bodies[`/app/content/blog/${filename}.mdx`];
  if (!load || readyBodies.has(filename)) return;
  load().then(module => readyBodies.set(filename, module.default));
}

export function postBody(filename: string): MDXContent | LazyExoticComponent<MDXContent> | undefined {
  const ready = readyBodies.get(filename);
  if (ready) return ready;
  const load = bodies[`/app/content/blog/${filename}.mdx`];
  if (!load) return undefined;
  if (!lazyBodies.has(filename)) lazyBodies.set(filename, lazy(load));
  return lazyBodies.get(filename);
}

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
