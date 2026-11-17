import { prerender } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import { AppRoutes } from './App';

// Build-time only (vite/prerender.ts): renders a route to HTML, waiting for lazy chunks such as
// post bodies so the page ships with its full text.
export async function render(url: string): Promise<string> {
  const { prelude } = await prerender(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>,
    // Never split long posts into deferred chunks: the page must ship its text inline.
    { progressiveChunkSize: Number.POSITIVE_INFINITY }
  );
  return new Response(prelude).text();
}
