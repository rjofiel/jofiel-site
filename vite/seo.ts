import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { absoluteUrl, headTags, pageMeta, postMeta, renderHead, site, type PageMeta, type PostEntry } from '../app/lib/meta';

const PLACEHOLDER = '<!--app-head-->';

const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function sitemap(pages: PageMeta[]): string {
  const urls = pages
    .map(page => {
      const lastmod = page.publishedTime ? `<lastmod>${page.publishedTime.slice(0, 10)}</lastmod>` : '';
      return `  <url><loc>${escapeXml(absoluteUrl(page.path))}</loc>${lastmod}</url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function feed(posts: PostEntry[]): string {
  const blog = pageMeta('/blog');
  const items = posts
    .map(post => {
      const meta = postMeta(post);
      const url = escapeXml(absoluteUrl(meta.path));
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid>${url}</guid>`,
        post.date ? `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>` : '',
        `      <description>${escapeXml(post.description)}</description>`,
        '    </item>'
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml(blog.title)}</title>`,
    `    <link>${escapeXml(absoluteUrl(blog.path))}</link>`,
    `    <description>${escapeXml(blog.description)}</description>`,
    items,
    '  </channel>',
    '</rss>',
    ''
  ].join('\n');
}

// Fills the <head> of index.html from app/content/site.json and, on build, writes one HTML
// file per route with its own title and preview tags (crawlers and link previews don't run
// JS), plus sitemap.xml, feed.xml and robots.txt.
export function seo(blogDir: string, readPosts: (dir: string) => PostEntry[]): Plugin {
  let outDir = 'dist';

  return {
    name: 'seo',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml: html => html.replace(PLACEHOLDER, renderHead(headTags(pageMeta('/')))),
    closeBundle() {
      const indexPath = path.join(outDir, 'index.html');
      if (!fs.existsSync(indexPath)) return;
      const html = fs.readFileSync(indexPath, 'utf8');
      const homeHead = renderHead(headTags(pageMeta('/')));

      // Newest first, like the feed readers expect.
      const posts = readPosts(blogDir).reverse();
      const published = posts.filter(post => post.published);
      const routes = [...site.pages.filter(page => page.path !== '/'), ...posts.map(postMeta)];

      for (const meta of routes) {
        // Served extensionless by Vercel's cleanUrls (vercel.json): /about -> about.html.
        const file = path.join(outDir, `${meta.path}.html`);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, html.replace(homeHead, renderHead(headTags(meta))));
      }

      const indexable = [...site.pages.filter(page => !page.noindex), ...published.map(postMeta)];
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap(indexable));
      fs.writeFileSync(path.join(outDir, 'feed.xml'), feed(published));
      fs.writeFileSync(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`);
    }
  };
}
