import type { MDXContent } from 'mdx/types';
import blogIndex from 'virtual:blog-index';
import type { PostEntry } from './meta';
import { SITE_TIME_ZONE } from './time';

const bodies = import.meta.glob<MDXContent>('/app/content/blog/*.mdx', { eager: true, import: 'default' });

export type PostYear = { year: string; posts: PostEntry[] };

export const getAllPosts = () => blogIndex;

export const getPost = (filename: string) => blogIndex.find(post => post.filename === filename);

export const postBody = (filename: string): MDXContent | undefined => bodies[`/app/content/blog/${filename}.mdx`];

const yearOf = (post: PostEntry) => post.date.slice(0, 4) || 'undated';

export function postsByYear(posts: PostEntry[]): PostYear[] {
  const groups = new Map<string, PostEntry[]>();
  for (const post of posts) groups.set(yearOf(post), [...(groups.get(yearOf(post)) ?? []), post]);
  return [...groups].map(([year, yearPosts]) => ({ year, posts: yearPosts }));
}

export type PostDateParts = { day: string; time: string };

const madridFormat = (parsed: Date, options: Intl.DateTimeFormatOptions) =>
  parsed.toLocaleString('en-US', { timeZone: SITE_TIME_ZONE, ...options });

export function postDateParts(date: string): PostDateParts | undefined {
  const parsed = new Date(date);
  if (!date || isNaN(parsed.getTime())) return undefined;
  return {
    day: madridFormat(parsed, { month: '2-digit', year: '2-digit' }),
    time: madridFormat(parsed, { hour: '2-digit', minute: '2-digit', hour12: false })
  };
}

export function formatPostDate(date: string): string {
  const parts = postDateParts(date);
  return parts ? `${parts.day}, ${parts.time}` : '';
}
