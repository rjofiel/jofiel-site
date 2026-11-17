import { prerender } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import { AppRoutes } from './App';

export async function render(url: string): Promise<string> {
  const { prelude } = await prerender(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>,
    { progressiveChunkSize: Number.POSITIVE_INFINITY }
  );
  return new Response(prelude).text();
}
