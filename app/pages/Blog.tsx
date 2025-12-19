import { Layout } from '@/components/Layout';
import { getAllPosts } from '@/lib/posts';
import { Link } from 'react-router-dom';

const Blog = () => {
  const posts = getAllPosts();
  return (
    <Layout>
      <div className='space-y-8 pt-8'>
        <section>
          <h1 className='text-lg font-medium text-foreground mb-2'>/blog</h1>
          <p className='text-sm text-muted-foreground'>notes, tutorials, and whatever i needed to write down.</p>
        </section>

        <section className='space-y-6'>
          {posts.length === 0 ? (
            <p className='text-sm text-muted-foreground'>no posts yet. check back later.</p>
          ) : (
            posts.map(post => (
              <article key={post.slug} className={`group ${!post.published && 'pointer-events-none opacity-50'}`}>
                <Link to={`/blog/${post.slug}`} className='block space-y-1'>
                  <div className='flex gap-4'>
                    <p className='text-xs text-muted-foreground tabular-nums text-wrap'>{post.date}</p>
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
      </div>
    </Layout>
  );
};

export default Blog;
