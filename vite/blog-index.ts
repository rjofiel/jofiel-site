import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import type { Plugin } from 'vite';
import type { PostEntry } from '../app/lib/meta';
import { madridIso } from '../app/lib/time';

const VIRTUAL_ID = 'virtual:blog-index';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;
// 2026-11-17_22-00-now-kresco -> date 2026-11-17, time 22:00, slug now-kresco
const FILENAME = /^(\d{4}-\d{2}-\d{2})_(\d{2})-(\d{2})-(.+)$/;

function toEntry(filename: string, source: string): PostEntry {
  const match = source.match(FRONTMATTER);
  const frontmatter: Record<string, unknown> = (match && parse(match[1])) || {};
  const parts = filename.match(FILENAME);
  return {
    filename,
    slug: parts ? parts[4] : '',
    date: parts ? madridIso(`${parts[1]}T${parts[2]}:${parts[3]}`) : '',
    title: String(frontmatter.title ?? ''),
    description: String(frontmatter.description ?? ''),
    published: frontmatter.published === true || frontmatter.published === 'true'
  };
}

// Reads only the frontmatter of every post at build time, so the blog list and the SEO files
// never have to bundle or compile the post bodies. Sorted oldest first.
export function readBlogIndex(dir: string): PostEntry[] {
  return fs
    .readdirSync(dir)
    .filter(file => file.endsWith('.mdx'))
    .sort()
    .map(file => toEntry(file.replace(/\.mdx$/, ''), fs.readFileSync(path.join(dir, file), 'utf8')));
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
