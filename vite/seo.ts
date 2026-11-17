import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, type Plugin } from 'vite';
import { absoluteUrl, headTags, pageMeta, postMeta, renderHead, site, type PageMeta, type PostEntry } from '../app/lib/meta';

const HEAD_PLACEHOLDER = '<!--app-head-->';
const ROOT = '<div id="root"></div>';

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

// Where a route's prerendered page lives. Vercel serves them extensionless (cleanUrls in
// vercel.json): /about -> about.html, and 404.html for anything else, with a real 404 status.
const fileFor = (outDir: string, route: string) => path.join(outDir, route === '/' ? 'index.html' : `${route}.html`);

// Fills the <head> of index.html from app/content/site.json. On build, renders every route to
// static HTML with its own <head> and full content (crawlers, link previews and readers that
// don't run JS see the real page; the browser hydrates it), plus sitemap.xml, feed.xml and
// robots.txt.
export function seo(blogDir: string, readPosts: (dir: string) => PostEntry[]): Plugin {
  let outDir = 'dist';
  let root = process.cwd();
  let configFile: string | false | undefined;
  let mode = 'production';
  let isSsrBuild = false;

  return {
    name: 'seo',
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
      configFile = config.configFile;
      mode = config.mode;
      isSsrBuild = Boolean(config.build.ssr);
    },
    transformIndexHtml: html => html.replace(HEAD_PLACEHOLDER, renderHead(headTags(pageMeta('/')))),
    async closeBundle() {
      // Runs once, after the client build; the nested SSR build below skips it.
      if (isSsrBuild) return;
      const indexPath = path.join(outDir, 'index.html');
      if (!fs.existsSync(indexPath)) return;
      const template = fs.readFileSync(indexPath, 'utf8');
      const homeHead = renderHead(headTags(pageMeta('/')));

      // Inside node_modules so the bundle resolves react and friends from the project.
      const ssrDir = path.join(root, 'node_modules/.cache/ssr');
      await build({
        configFile,
        mode,
        logLevel: 'warn',
        build: { ssr: 'app/entry-server.tsx', outDir: ssrDir, emptyOutDir: true, copyPublicDir: false }
      });
      const { render } = (await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)) as {
        render: (url: string) => Promise<string>;
      };

      // Newest first, like the feed readers expect.
      const posts = readPosts(blogDir).reverse();
      const published = posts.filter(post => post.published);
      const notFound: PageMeta = { path: '/404', title: `/404 | ${site.name}`, description: 'welp. my bad.', noindex: true };
      const routes = [...site.pages, ...posts.map(postMeta), notFound];

      for (const meta of routes) {
        const body = await render(meta.path);
        const html = template.replace(homeHead, renderHead(headTags(meta))).replace(ROOT, `<div id="root">${body}</div>`);
        const file = fileFor(outDir, meta.path);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, html);
      }
      fs.rmSync(ssrDir, { recursive: true, force: true });

      const indexable = [...site.pages.filter(page => !page.noindex), ...published.map(postMeta)];
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap(indexable));
      fs.writeFileSync(path.join(outDir, 'feed.xml'), feed(published));
      fs.writeFileSync(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`);
    }
  };
}
