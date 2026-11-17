import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import type { Plugin } from 'vite';

const VIRTUAL_ID = 'virtual:blog-index';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

export type BlogIndexEntry = { filename: string; frontmatter: Record<string, unknown> };

// Reads only the YAML frontmatter of every post at build time, so the blog list never has
// to bundle the compiled post bodies. Posts themselves are still loaded lazily by MDX.
export function readBlogIndex(dir: string): BlogIndexEntry[] {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .sort()
    .map((file) => {
      const source = fs.readFileSync(path.join(dir, file), 'utf8');
      const match = source.match(FRONTMATTER);
      return { filename: file.replace(/\.mdx$/, ''), frontmatter: (match && parse(match[1])) || {} };
    });
}

export function blogIndex(dir: string): Plugin {
  const isPost = (file: string) => path.dirname(file) === dir && file.endsWith('.mdx');

  return {
    name: 'blog-index',
    resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : undefined),
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
