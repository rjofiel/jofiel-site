import type { MDXContent } from 'mdx/types';
import blogIndex from 'virtual:blog-index';
import type { PostEntry } from './meta';

const bodies = import.meta.glob<MDXContent>('/app/content/blog/*.mdx', { eager: true, import: 'default' });

export type PostYear = { year: string; posts: PostEntry[] };

export const getAllPosts = () => blogIndex;

export const getPost = (slug: string) => blogIndex.find(post => post.slug === slug);

export const postBody = (slug: string): MDXContent | undefined => bodies[`/app/content/blog/${slug}.mdx`];

const yearOf = (post: PostEntry) => post.date.slice(0, 4) || 'undated';

export function postsByYear(posts: PostEntry[]): PostYear[] {
  const groups = new Map<string, PostEntry[]>();
  for (const post of posts) groups.set(yearOf(post), [...(groups.get(yearOf(post)) ?? []), post]);
  return [...groups].map(([year, yearPosts]) => ({ year, posts: yearPosts }));
}

export type PostDateParts = { dayMonth: string; fullDate: string; time: string };

const MADRID_WALL_CLOCK = /^\d{2}(\d{2})-(\d{2})-(\d{2})T(\d{2}:\d{2})/;

export function postDateParts(date: string): PostDateParts | undefined {
  const parts = date.match(MADRID_WALL_CLOCK);
  if (!parts) return undefined;
  const [, year, month, day, time] = parts;
  return { dayMonth: `${day}/${month}`, fullDate: `${day}/${month}/${year}`, time };
}

export function formatPostDate(date: string): string {
  const parts = postDateParts(date);
  return parts ? `${parts.fullDate}, ${parts.time}` : '';
}
