import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import type { Plugin } from 'vite';
import type { PostEntry } from '../app/lib/meta';
import { madridIso } from '../app/lib/time';

const VIRTUAL_ID = 'virtual:blog-index';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;
const POST_DATE = /^(\d{4}-\d{2}-\d{2})_(\d{2})-(\d{2})$/;

function postDate(value: unknown): string {
  const parts = String(value ?? '').match(POST_DATE);
  return parts ? madridIso(`${parts[1]}T${parts[2]}:${parts[3]}`) : '';
}

function toEntry(slug: string, source: string): PostEntry {
  const match = source.match(FRONTMATTER);
  const frontmatter: Record<string, unknown> = (match && parse(match[1])) || {};
  return {
    slug,
    date: postDate(frontmatter.date),
    title: String(frontmatter.title ?? ''),
    description: String(frontmatter.description ?? ''),
    published: frontmatter.published === true || frontmatter.published === 'true'
  };
}

const publishedAt = (post: PostEntry) => Date.parse(post.date) || 0;

export function readBlogIndex(dir: string): PostEntry[] {
  return fs
    .readdirSync(dir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => toEntry(file.replace(/\.mdx$/, ''), fs.readFileSync(path.join(dir, file), 'utf8')))
    .sort((a, b) => publishedAt(a) - publishedAt(b) || a.slug.localeCompare(b.slug));
}

export function blogIndex(dir: string): Plugin {
  const isPost = (file: string) => path.dirname(file) === dir && file.endsWith('.mdx');

  return {
    name: 'blog-index',
    resolveId: id => (id === VIRTUAL_ID ? RESOLVED_ID : undefined),
    load(id) {
      if (id !== RESOLVED_ID) return;
      return `export default ${JSON.stringify(readBlogIndex(dir))};`;
    },
    configureServer(server) {
      const refresh = (file: string) => {
        if (!isPost(file)) return;
        const module = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (module) server.reloadModule(module);
      };
      server.watcher.on('add', refresh);
      server.watcher.on('change', refresh);
      server.watcher.on('unlink', refresh);
    }
  };
}
