declare module 'virtual:blog-index' {
  const entries: import('./lib/meta').PostEntry[];
  export default entries;
}
