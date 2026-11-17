import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import type { MDXContent } from 'mdx/types';
import { Page, PageTitle } from '@/components/Page';
import { mdxComponents } from '@/components/mdxComponents';
import { postMeta } from '@/lib/meta';
import { formatPostDate, getPost, loadPost } from '@/lib/posts';
import { NotFound } from '@/pages/NotFound';

export const Post = () => {
  const { slug: filename = '' } = useParams();
  const post = getPost(filename);
  const load = loadPost(filename);
  // Keyed by filename so navigating between posts never shows the previous body.
  const [loaded, setLoaded] = useState<{ filename: string; Content: MDXContent } | null>(null);

  useEffect(() => {
    if (!load) return;
    let cancelled = false;
    load().then(module => {
      if (!cancelled) setLoaded({ filename, Content: module.default });
    });
    return () => {
      cancelled = true;
    };
  }, [filename, load]);

  if (!post || !load) return <NotFound />;

  const Content = loaded?.filename === filename ? loaded.Content : null;

  return (
    <Page meta={postMeta(post)}>
      <section>
        <PageTitle>
          /blog/<span className='blink'>_</span>
        </PageTitle>
        <div className='flex justify-between items-center'>
          <p className='text-sm text-muted-foreground'>{post.slug.replace(/-/g, ' ')}</p>
          <p className='text-xs text-foreground'>{formatPostDate(post.date)}</p>
        </div>
      </section>
      {Content ? <Content components={mdxComponents} /> : <p className='text-sm text-muted-foreground'>loading...</p>}
    </Page>
  );
};
