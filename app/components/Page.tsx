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

// The "/route" heading at the top of a page.
export const PageTitle = ({ className = 'mb-2', children }: { className?: string; children: ReactNode }) => (
  <h1 className={`text-lg font-medium text-foreground ${className}`}>{children}</h1>
);
