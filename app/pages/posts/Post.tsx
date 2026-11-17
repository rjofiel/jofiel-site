/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layout } from '@/components/Layout';
import { useLocation } from 'react-router-dom';
import { mdxComponents } from '@/components/mdxComponents';
import { parseFilename } from '@/lib/utils';
const posts = import.meta.glob('/app/content/blog/*.mdx', { eager: true, import: 'default' });

export const Post = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const postName = pathname.split('/')[2];
  const filename = postName;
  const { slug, readableDate } = parseFilename(filename);

  const PostContent = posts[`/app/content/blog/${postName}.mdx`] as any;

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
        <PostContent components={mdxComponents} />
      </div>
    </Layout>
  );
};
