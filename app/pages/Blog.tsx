import { Link } from 'react-router';
import { Page, PageTitle } from '@/components/Page';
import { pageMeta, type PostEntry } from '@/lib/meta';
import { formatPostDate, getAllPosts, postsByYear, type PostYear } from '@/lib/posts';

const PostItem = ({ post }: { post: PostEntry }) => (
  <article className={`group ${!post.published && 'pointer-events-none opacity-50'}`}>
    <Link to={`/blog/${post.filename}`} className='block space-y-1'>
      <div className='flex gap-4'>
        <p className='text-xs text-muted-foreground tabular-nums text-wrap'>{formatPostDate(post.date)}</p>
        <div>
          <h2 className='text-sm text-foreground group-hover:text-primary transition-colors'>{post.title}</h2>
          <p className='text-sm text-muted-foreground pl-4'>{post.description}</p>
        </div>
      </div>
    </Link>
  </article>
);

const YearGroup = ({ group, open }: { group: PostYear; open: boolean }) => (
  <details open={open} className='group/year space-y-6'>
    <summary className='flex cursor-pointer list-none items-baseline gap-2 text-sm text-muted-foreground hover:text-primary [&::-webkit-details-marker]:hidden'>
      <span className='inline-block transition-transform group-open/year:rotate-90'>&gt;</span>
      <span className='text-foreground'>{group.year}</span>
      <span className='text-xs'>[{group.posts.length}]</span>
    </summary>
    {group.posts.map(post => (
      <PostItem key={post.filename} post={post} />
    ))}
  </details>
);

const Blog = () => {
  const years = postsByYear(getAllPosts());
  const latestYear = years[years.length - 1]?.year;

  return (
    <Page meta={pageMeta('/blog')}>
      <section>
        <PageTitle>/blog</PageTitle>
        <p className='text-sm text-muted-foreground'>notes, tutorials, and whatever i needed to write down.</p>
      </section>

      <section className='space-y-6'>
        {years.length === 0 ? (
          <p className='text-sm text-muted-foreground'>no posts yet. check back later.</p>
        ) : (
          years.map(group => <YearGroup key={group.year} group={group} open={group.year === latestYear} />)
        )}
      </section>
    </Page>
  );
};

export default Blog;
