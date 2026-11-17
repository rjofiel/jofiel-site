import type { ReactNode } from 'react';
import { Layout } from './Layout';
import { usePageMeta } from '@/lib/usePageMeta';
import type { PageMeta } from '@/lib/meta';

type PageProps = {
  meta: PageMeta;
  className?: string;
  children: ReactNode;
};

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
  as?: 'h1' | 'p';
  children: ReactNode;
};

export const PageTitle = ({ className = 'mb-2', as: Tag = 'h1', children }: PageTitleProps) => (
  <Tag className={`text-lg font-medium text-foreground ${className}`}>{children}</Tag>
);
