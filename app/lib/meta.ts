// Page metadata shared by the app (client-side navigation) and the build (prerendered
// <head> per route, sitemap, feed). Keep it free of DOM and Node APIs: both tsconfigs use it.
import site from '../content/site.json';

export { site };

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  // ISO date, for articles.
  publishedTime?: string;
};

// A post as produced by the blog-index build plugin.
export type PostEntry = {
  // Filename without extension; also the URL segment under /blog.
  filename: string;
  // Filename without the date prefix.
  slug: string;
  // Local date and time from the filename, in Madrid, e.g. 2026-11-17T22:00:00+01:00. Empty when missing.
  date: string;
  title: string;
  description: string;
  published: boolean;
};

export type HeadTag = { tag: 'title'; text: string } | { tag: 'meta' | 'link'; attrs: Record<string, string> };

export function pageMeta(path: string): PageMeta {
  const page = site.pages.find(candidate => candidate.path === path);
  if (!page) throw new Error(`No page metadata for ${path}`);
  return page;
}

export function postMeta(post: PostEntry): PageMeta {
  return {
    path: `/blog/${post.filename}`,
    title: `${post.title || post.slug.replace(/-/g, ' ')} | ${site.name}`,
    description: post.description || pageMeta('/blog').description,
    type: 'article',
    noindex: !post.published,
    publishedTime: post.date || undefined
  };
}

export const absoluteUrl = (path: string) => new URL(path, site.url).href;

export function headTags(meta: PageMeta): HeadTag[] {
  const url = absoluteUrl(meta.path);
  const image = absoluteUrl(site.image);
  const tags: HeadTag[] = [
    { tag: 'title', text: meta.title },
    { tag: 'meta', attrs: { name: 'description', content: meta.description } },
    { tag: 'link', attrs: { rel: 'canonical', href: url } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: site.name } },
    { tag: 'meta', attrs: { property: 'og:type', content: meta.type ?? 'website' } },
    { tag: 'meta', attrs: { property: 'og:url', content: url } },
    { tag: 'meta', attrs: { property: 'og:title', content: meta.title } },
    { tag: 'meta', attrs: { property: 'og:description', content: meta.description } },
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } }
  ];
  if (meta.publishedTime) {
    tags.push({ tag: 'meta', attrs: { property: 'article:published_time', content: meta.publishedTime } });
  }
  if (meta.noindex) tags.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex' } });
  return tags;
}

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Every tag carries data-head so the client can swap them on navigation.
export function renderHead(tags: HeadTag[]): string {
  return tags
    .map(tag => {
      if (tag.tag === 'title') return `<title data-head>${escapeHtml(tag.text)}</title>`;
      const attrs = Object.entries(tag.attrs)
        .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
        .join(' ');
      return `<${tag.tag} data-head ${attrs} />`;
    })
    .join('\n    ');
}
