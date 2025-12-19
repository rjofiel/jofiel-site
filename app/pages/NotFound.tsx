import { Layout } from '@/components/Layout';

export const NotFound = () => {
  return (
    <Layout>
      <section>
        <h1 className='text-lg font-medium text-foreground mb-2'>/404</h1>
        <p className='text-sm text-muted-foreground'>welp. my bad.</p>
      </section>

      <div className='pt-8 space-y-4'>
        <p className='text-sm text-muted-foreground'>this page doesn’t exist.</p>
        <p className='text-sm text-muted-foreground'>you probably mistyped the url.</p>
        <p className='text-sm text-muted-foreground group'>
          or i broke something.
        </p>
      </div>
    </Layout>
  );
};
