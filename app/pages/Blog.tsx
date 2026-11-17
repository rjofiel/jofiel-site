import { Link } from 'react-router';
import { Page, PageTitle } from '@/components/Page';
import { pageMeta, type PostEntry } from '@/lib/meta';
import { getAllPosts, postDateParts, postsByYear, type PostYear } from '@/lib/posts';

const PostDate = ({ date }: { date: string }) => {
  const parts = postDateParts(date);
  return (
    <p className='w-[5ch] shrink-0 text-xs leading-5 text-muted-foreground tabular-nums'>
      <span className='block'>{parts?.day}</span>
      <span className='block'>{parts?.time}</span>
    </p>
  );
};

const PostItem = ({ post }: { post: PostEntry }) => (
  <article className={`group ${!post.published && 'pointer-events-none opacity-50'}`}>
    <Link to={`/blog/${post.filename}`} className='block space-y-1'>
      <div className='flex gap-4'>
        <PostDate date={post.date} />
        <div>
          <h2 className='text-sm text-foreground group-hover:text-primary transition-colors'>{post.title}</h2>
          <p className='text-sm text-muted-foreground pl-4'>{post.description}</p>
        </div>
      </div>
    </Link>
  </article>
);

const PostList = ({ posts }: { posts: PostEntry[] }) => (
  <div className='space-y-6'>
    {posts.map(post => (
      <PostItem key={post.filename} post={post} />
    ))}
  </div>
);

const PastYear = ({ group }: { group: PostYear }) => (
  <details className='group/year'>
    <summary className='flex cursor-pointer list-none items-baseline gap-2 text-sm text-muted-foreground hover:text-primary [&::-webkit-details-marker]:hidden'>
      <span className='inline-block transition-transform group-open/year:rotate-90'>&gt;</span>
      <span className='text-foreground'>{group.year}</span>
      <span className='text-xs'>[{group.posts.length}]</span>
    </summary>
    <div className='mt-4 mb-6'>
      <PostList posts={group.posts} />
    </div>
  </details>
);

const Blog = () => {
  const years = postsByYear([...getAllPosts()].reverse());
  const [current, ...past] = years;

  return (
    <Page meta={pageMeta('/blog')}>
      <section>
        <PageTitle>/blog</PageTitle>
        <p className='text-sm text-muted-foreground'>notes, tutorials, and whatever i needed to write down.</p>
      </section>

      {current ? (
        <section className='space-y-4'>
          <p className='text-sm text-muted-foreground'>current year</p>
          <PostList posts={current.posts} />
        </section>
      ) : (
        <p className='text-sm text-muted-foreground'>no posts yet. check back later.</p>
      )}

      {past.length > 0 && (
        <section className='space-y-2'>
          {past.map(group => (
            <PastYear key={group.year} group={group} />
          ))}
        </section>
      )}
    </Page>
  );
};

export default Blog;
