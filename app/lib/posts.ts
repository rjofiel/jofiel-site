import { parseFilename } from './utils';

export type Post = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  published: boolean;
};

// Remove ?raw so Vite returns the parsed MDX modules, which include export const frontmatter
const posts = import.meta.glob('/app/content/blog/*.mdx', { eager: true });

export function getAllPosts() {
  return Object.entries(posts || {}).map(([path, module]) => {
    // @ts-ignore - Vite will inject `frontmatter` via remark-mdx-frontmatter
    const frontmatter = module.frontmatter || {};

    const filename = path.split('/').pop()!.replace('.mdx', '');
    const { readableDate } = parseFilename(filename);

    return {
      slug: filename,
      title: frontmatter.title || '',
      date: readableDate,
      description: frontmatter.description || '',
      published: frontmatter.published === true || frontmatter.published === 'true'
    };
  });
}
