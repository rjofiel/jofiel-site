import { Layout } from '@/components/Layout';
import { useLocation } from 'react-router-dom';
import { ExternalLink } from '@/components/ExternalLink';
import { parseFilename } from '@/lib/utils';
const posts = import.meta.glob('/app/content/blog/*.mdx', { eager: true, import: 'default' });

const components = {
  hr: (props: any) => <hr className='my-8' />,
  h1: (props: any) => <h1 className='text-sm leading-relaxed text-foreground my-2 font-bold' {...props} />,
  h2: (props: any) => <h2 className='text-sm leading-relaxed text-muted-foreground my-2 font-semibold' {...props} />,
  h3: (props: any) => <h3 className='text-sm leading-relaxed text-muted-foreground my-1' {...props} />,
  p: (props: any) => <p className='text-sm leading-relaxed text-muted-foreground mb-4' {...props} />,
  a: ExternalLink,
  em: (props: any) => <span className='italic' {...props} />,
  strong: (props: any) => <span className='font-semibold' {...props} />,
  ul: (props: any) => <ul className='list-disc ml-4 my-2' {...props} />,
  li: (props: any) => <li className='text-sm leading-relaxed text-muted-foreground' {...props} />,
  code: (props: any) => <code className='bg-muted px-1 rounded' {...props} />
};

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
        <PostContent components={components} />
      </div>
    </Layout>
  );
};
