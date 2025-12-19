import { parseFilename } from './utils';

export type Post = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  published: boolean;
};
const posts = import.meta.glob('/app/content/blog/*.mdx', { eager: true, as: 'raw' });

export function getAllPosts() {
  return Object.entries(posts).map(([path, content]) => {
    const str = content?.()?.type as string;
    const match = /---\n([\s\S]+?)\n---/.exec(str as string);
    const data: { published?: string } & Omit<Post, 'published'> = {
      slug: '',
      title: '',
      date: '',
      published: 'false'
    };

    if (match) {
      match[1].split('\n').forEach(line => {
        const [key, ...rest] = line.split(':');
        data[key.trim()] = rest.join(':').trim();
      });
    }
    const filename = path.split('/').pop()!.replace('.mdx', '');
    const { slug, readableDate } = parseFilename(filename);
    console.log('slug', slug, readableDate, path);
    return {
      slug: filename,
      title: data.title,
      date: readableDate,
      description: data.description,
      published: data?.published === 'true'
    };
  });
}
