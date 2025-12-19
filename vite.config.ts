import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import mdx from 'vite-plugin-mdx';

export default defineConfig({
  plugins: [tailwindcss(), tsconfigPaths(), mdx()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app')
    }
  }
});

