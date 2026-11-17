import { useLocation } from 'react-router';
import { Layout } from '@/components/Layout';
import { PageTitle } from '@/components/Page';
import { usePageMeta } from '@/lib/usePageMeta';

export const NotFound = () => {
  const { pathname } = useLocation();
  usePageMeta({ path: pathname, title: '/404 | ludox', description: 'welp. my bad.', noindex: true });

  return (
    <Layout>
      <section>
        <PageTitle>/404</PageTitle>
        <p className='text-sm text-muted-foreground'>welp. my bad.</p>
      </section>

      <div className='pt-8 space-y-4'>
        <p className='text-sm text-muted-foreground'>this page doesn’t exist.</p>
        <p className='text-sm text-muted-foreground'>you probably mistyped the url.</p>
        <p className='text-sm text-muted-foreground group'>or i broke something.</p>
      </div>
    </Layout>
  );
};
