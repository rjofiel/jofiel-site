import { useParams } from 'react-router';
import { Page, PageTitle } from '@/components/Page';
import { mdxComponents } from '@/components/mdxComponents';
import { postMeta } from '@/lib/meta';
import { formatPostDate, getPost, postBody } from '@/lib/posts';
import { NotFound } from '@/pages/NotFound';

export const Post = () => {
  const { slug: filename = '' } = useParams();
  const post = getPost(filename);
  const Body = postBody(filename);

  if (!post || !Body) return <NotFound />;

  return (
    <Page meta={postMeta(post)}>
      <section>
        <PageTitle as='p'>
          /blog/<span className='blink'>_</span>
        </PageTitle>
        <div className='flex justify-between items-center'>
          <h1 className='text-sm text-muted-foreground'>{post.title || post.slug.replace(/-/g, ' ')}</h1>
          <p className='text-xs text-foreground'>{formatPostDate(post.date)}</p>
        </div>
      </section>
      <Body components={mdxComponents} />
    </Page>
  );
};
