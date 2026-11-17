import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { FloatingDecorations } from './FloatingDecorations';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='min-h-screen bg-background text-foreground overflow-x-clip'>
      <div className='fixed inset-0 overflow-hidden pointer-events-none select-none'>
        <div className='fixed inset-0 overflow-hidden pointer-events-none select-none'>
          <FloatingDecorations count={6} />
        </div>
      </div>

      <header className='relative z-10 px-6 py-8'>
        <div className='max-w-2xl mx-auto'>
          <Navigation />
        </div>
      </header>

      <main className='relative z-10 px-6 pb-16'>
        <div className='max-w-2xl mx-auto'>{children}</div>
      </main>
    </div>
  );
};
