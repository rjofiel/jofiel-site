import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { MDXContent } from 'mdx/types';
import { Layout } from '@/components/Layout';
import { mdxComponents } from '@/components/mdxComponents';
import { loadPost } from '@/lib/posts';
import { parseFilename } from '@/lib/utils';
import { NotFound } from '@/pages/NotFound';

export const Post = () => {
  const { slug: filename = '' } = useParams();
  const { slug, readableDate } = parseFilename(filename);
  const load = loadPost(filename);
  // Keyed by filename so navigating between posts never shows the previous body.
  const [loaded, setLoaded] = useState<{ filename: string; Content: MDXContent } | null>(null);

  useEffect(() => {
    if (!load) return;
    let cancelled = false;
    load().then((module) => {
      if (!cancelled) setLoaded({ filename, Content: module.default });
    });
    return () => {
      cancelled = true;
    };
  }, [filename, load]);

  if (!load) return <NotFound />;

  const Content = loaded?.filename === filename ? loaded.Content : null;

  return (
    <Layout>
      <div className='space-y-8 pt-8'>
        <section>
          <h1 className='text-lg font-medium text-foreground mb-2'>
            /blog/<span className='blink'>_</span>
          </h1>
          <div className='flex justify-between items-center'>
            <p className='text-sm text-muted-foreground'>{slug.replace(/-/gim, ' ')}</p>
            <p className='text-xs text-foreground'>{readableDate}</p>
          </div>
        </section>
        {Content ? <Content components={mdxComponents} /> : <p className='text-sm text-muted-foreground'>loading...</p>}
      </div>
    </Layout>
  );
};
