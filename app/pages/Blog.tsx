import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
}

const posts: BlogPost[] = [
  {
    slug: "first-post",
    title: "welcome",
    date: "2025-12-17",
    description: "just setting this up. more posts coming. or not. we’ll see.",
  },
];

const Blog = () => {
  return (
    <Layout>
      <div className="space-y-8 pt-8">
        <section>
          <h1 className="text-lg font-medium text-foreground mb-2">/blog</h1>
          <p className="text-sm text-muted-foreground">
            notes, tutorials, and whatever i needed to write down.
          </p>
        </section>

        <section className="space-y-6">
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              no posts yet. check back later.
            </p>
          ) : (
            posts.map((post) => (
              <article key={post.slug} className="group">
                <Link to={`/blog/${post.slug}`} className="block space-y-1">
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {post.date}
                    </span>
                    <h2 className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground pl-[88px]">
                    {post.description}
                  </p>
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
