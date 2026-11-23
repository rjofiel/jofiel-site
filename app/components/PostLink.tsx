import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { getPost } from '@/lib/posts';

export const PostLink = ({ slug, children }: { slug: string; children?: ReactNode }) => {
  const post = getPost(slug);
  if (!post?.published) return null;
  return (
    <p className='my-4 text-sm'>
      <Link to={`/blog/${slug}`} className='text-primary hover:underline'>
        {children ?? post.title}
      </Link>
    </p>
  );
};
