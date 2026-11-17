import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import { blogIndex } from './vite/blog-index';

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    // remark-frontmatter keeps the YAML header out of the rendered post; the header itself
    // is read by blogIndex.
    mdx({ remarkPlugins: [remarkFrontmatter] }),
    blogIndex(path.resolve(__dirname, 'app/content/blog'))
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app')
    }
  }
});
