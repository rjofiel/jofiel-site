import { useEffect } from 'react';
import { Link } from 'react-router';
import { Page, PageTitle } from '@/components/Page';
import { pageMeta } from '@/lib/meta';
import { formatPostDate, getAllPosts, preloadPost } from '@/lib/posts';

const Blog = () => {
  const posts = getAllPosts();

  useEffect(() => {
    const preloadAll = () => posts.filter(post => post.published).forEach(post => preloadPost(post.filename));
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(preloadAll);
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(preloadAll, 200);
    return () => clearTimeout(id);
  }, [posts]);

  return (
    <Page meta={pageMeta('/blog')}>
      <section>
        <PageTitle>/blog</PageTitle>
        <p className='text-sm text-muted-foreground'>notes, tutorials, and whatever i needed to write down.</p>
      </section>

      <section className='space-y-6'>
        {posts.length === 0 ? (
          <p className='text-sm text-muted-foreground'>no posts yet. check back later.</p>
        ) : (
          posts.map(post => (
            <article key={post.filename} className={`group ${!post.published && 'pointer-events-none opacity-50'}`}>
              <Link
                to={`/blog/${post.filename}`}
                className='block space-y-1'
                onMouseEnter={() => preloadPost(post.filename)}
                onFocus={() => preloadPost(post.filename)}
                onTouchStart={() => preloadPost(post.filename)}>
                <div className='flex gap-4'>
                  <p className='text-xs text-muted-foreground tabular-nums text-wrap'>{formatPostDate(post.date)}</p>
                  <div>
                    <h2 className='text-sm text-foreground group-hover:text-primary transition-colors'>{post.title}</h2>
                    <p className='text-sm text-muted-foreground pl-4'>{post.description}</p>
                  </div>
                </div>
              </Link>
            </article>
          ))
        )}
      </section>
    </Page>
  );
};

export default Blog;
