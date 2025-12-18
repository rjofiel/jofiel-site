import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Decoration } from './Decoration';
import { FloatingDecorations } from './FLoatingDecorations';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='min-h-screen bg-background text-foreground overflow-x-clip'>
      {/* Floating decorations */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none select-none'>
        <div className='fixed inset-0 overflow-hidden pointer-events-none select-none'>
          {/* <Decoration startX='10vw' endX='80vw' duration='12s' delay='-10s' className='top-36' />
          <Decoration startX='20vw' endX='85vw' duration='28s' delay='-2s' className='top-56' />
          <Decoration startX='1vw' endX='90vw' duration='32s' delay='-11s' className='bottom-48' />
          <Decoration startX='40vw' endX='100vw' duration='39s' delay='-9s' className='top-[80%]' />
          <Decoration startX='17vw' endX='100vw' duration='39s' delay='-2s' className='top-[1%]' /> */}
          <FloatingDecorations count={6} />

        </div>
      </div>

      {/* Header */}
      <header className='relative z-10 px-6 py-8'>
        <div className='max-w-2xl mx-auto'>
          <Navigation />
        </div>
      </header>

      {/* Main content */}
      <main className='relative z-10 px-6 pb-16'>
        <div className='max-w-2xl mx-auto'>{children}</div>
      </main>
    </div>
  );
};
