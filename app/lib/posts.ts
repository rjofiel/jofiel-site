import type { MDXContent } from 'mdx/types';
import blogIndex from 'virtual:blog-index';
import { parseFilename } from './utils';

export type Post = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  published: boolean;
};

// Post bodies are split into their own chunks and loaded on demand; the list only needs
// the frontmatter, which the blog-index Vite plugin extracts at build time.
const bodies = import.meta.glob<{ default: MDXContent }>('/app/content/blog/*.mdx');

export function loadPost(slug: string) {
  return bodies[`/app/content/blog/${slug}.mdx`];
}

export function getAllPosts(): Post[] {
  return blogIndex.map(({ filename, frontmatter }) => ({
    slug: filename,
    title: String(frontmatter.title ?? ''),
    date: parseFilename(filename).readableDate,
    description: String(frontmatter.description ?? ''),
    published: frontmatter.published === true || frontmatter.published === 'true'
  }));
}
