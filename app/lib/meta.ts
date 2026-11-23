import site from '../content/site.json';

export { site };

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  publishedTime?: string;
};

export type PostEntry = {
  slug: string;
  date: string;
  title: string;
  description: string;
  published: boolean;
};

export type HeadTag =
  { tag: 'title'; text: string } | { tag: 'meta' | 'link'; attrs: Record<string, string> } | { tag: 'script'; json: object };

export function pageMeta(path: string): PageMeta {
  const page = site.pages.find(candidate => candidate.path === path);
  if (!page) throw new Error(`No page metadata for ${path}`);
  return page;
}

export function postMeta(post: PostEntry): PageMeta {
  return {
    path: `/blog/${post.slug}`,
    title: `${post.title || post.slug.replace(/-/g, ' ')} | ${site.name}`,
    description: post.description || pageMeta('/blog').description,
    type: 'article',
    noindex: !post.published,
    publishedTime: post.date || undefined
  };
}

export const absoluteUrl = (path: string) => new URL(path, site.url).href;

const author = { '@type': 'Person', name: site.name, url: site.url };

function structuredData(meta: PageMeta, url: string, image: string): object | undefined {
  if (meta.type === 'article') {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: meta.title.replace(` | ${site.name}`, ''),
      description: meta.description,
      url,
      image,
      datePublished: meta.publishedTime,
      author
    };
  }
  if (meta.path === '/') {
    return { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url, description: meta.description, author };
  }
  return undefined;
}

export function headTags(meta: PageMeta): HeadTag[] {
  const url = absoluteUrl(meta.path);
  const image = absoluteUrl(site.image.path);
  const tags: HeadTag[] = [
    { tag: 'title', text: meta.title },
    { tag: 'meta', attrs: { name: 'description', content: meta.description } },
    { tag: 'link', attrs: { rel: 'canonical', href: url } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: site.name } },
    { tag: 'meta', attrs: { property: 'og:locale', content: 'en_US' } },
    { tag: 'meta', attrs: { property: 'og:type', content: meta.type ?? 'website' } },
    { tag: 'meta', attrs: { property: 'og:url', content: url } },
    { tag: 'meta', attrs: { property: 'og:title', content: meta.title } },
    { tag: 'meta', attrs: { property: 'og:description', content: meta.description } },
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:width', content: String(site.image.width) } },
    { tag: 'meta', attrs: { property: 'og:image:height', content: String(site.image.height) } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: site.image.alt } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:site', content: site.twitter } },
    { tag: 'meta', attrs: { name: 'twitter:creator', content: site.twitter } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: meta.title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: meta.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
    { tag: 'meta', attrs: { name: 'twitter:image:alt', content: site.image.alt } }
  ];
  if (meta.publishedTime) {
    tags.push({ tag: 'meta', attrs: { property: 'article:published_time', content: meta.publishedTime } });
    tags.push({ tag: 'meta', attrs: { property: 'article:author', content: site.url } });
  }
  tags.push({ tag: 'meta', attrs: { name: 'robots', content: meta.noindex ? 'noindex, nofollow' : 'index, follow' } });
  const json = structuredData(meta, url, image);
  if (json) tags.push({ tag: 'script', json });
  return tags;
}

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const scriptJson = (json: object) => JSON.stringify(json).replace(/</g, '\\u003c');

export function renderHead(tags: HeadTag[]): string {
  return tags
    .map(tag => {
      if (tag.tag === 'title') return `<title data-head>${escapeHtml(tag.text)}</title>`;
      if (tag.tag === 'script') return `<script data-head type="application/ld+json">${scriptJson(tag.json)}</script>`;
      const attrs = Object.entries(tag.attrs)
        .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
        .join(' ');
      return `<${tag.tag} data-head ${attrs} />`;
    })
    .join('\n    ');
}
