import type { ReactNode } from 'react';
import { Layout } from './Layout';
import { usePageMeta } from '@/lib/usePageMeta';
import type { PageMeta } from '@/lib/meta';

type PageProps = {
  meta: PageMeta;
  // Spacing and positioning of the content column; vertical rhythm defaults to space-y-8.
  className?: string;
  children: ReactNode;
};

// Every route: site layout, page <head> and the content column.
export const Page = ({ meta, className = 'space-y-8', children }: PageProps) => {
  usePageMeta(meta);
  return (
    <Layout>
      <div className={`pt-8 ${className}`}>{children}</div>
    </Layout>
  );
};

type PageTitleProps = {
  className?: string;
  // 'p' when the page has a more descriptive <h1> of its own (a post title, for example).
  as?: 'h1' | 'p';
  children: ReactNode;
};

// The "/route" label at the top of a page; the page's <h1> unless `as` says otherwise.
export const PageTitle = ({ className = 'mb-2', as: Tag = 'h1', children }: PageTitleProps) => (
  <Tag className={`text-lg font-medium text-foreground ${className}`}>{children}</Tag>
);
