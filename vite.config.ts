import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import { blogIndex, readBlogIndex } from './vite/blog-index';
import { seo } from './vite/seo';

const blogDir = path.resolve(__dirname, 'app/content/blog');

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    // remark-frontmatter keeps the YAML header out of the rendered post; the header itself
    // is read by blogIndex.
    mdx({ remarkPlugins: [remarkFrontmatter] }),
    blogIndex(blogDir),
    seo(blogDir, readBlogIndex)
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app')
    }
  }
});
