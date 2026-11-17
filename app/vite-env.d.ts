/// <reference types="vite/client" />

declare module 'virtual:blog-index' {
  // Mirrors BlogIndexEntry in vite/blog-index.ts (separate tsconfig, so it can't be imported).
  const entries: { filename: string; frontmatter: Record<string, unknown> }[];
  export default entries;
}
