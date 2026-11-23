import { Link, useLocation } from 'react-router';
import { SITE_TIME_ZONE } from '@/lib/time';
import { useHydrated } from '@/lib/useHydrated';

const navItems = [
  { path: '/', label: 'home' },
  { path: '/blog', label: 'blog' },
  { path: '/projects', label: 'projects' },
  { path: '/about', label: 'about' }
];

const touchArea = "relative after:absolute after:-inset-x-2 after:-inset-y-3 after:content-['']";

export const Navigation = () => {
  const location = useLocation();
  const hydrated = useHydrated();

  return (
    <nav className='flex flex-wrap items-center gap-x-4 gap-y-3 text-sm sm:gap-x-6'>
      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`${touchArea} transition-colors hover:text-primary ${location.pathname === item.path ? 'text-primary' : 'text-muted-foreground'}`}>
          /{item.label}
        </Link>
      ))}
      <Link
        to='/heaven-sent'
        aria-label='/heaven-sent'
        className='group relative -ml-1 inline-flex h-[6px] w-[6px] items-center self-center sm:-ml-3'>
        <span className='block h-[6px] w-[6px] bg-[#003b6f] transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0' />
        <span className='pointer-events-none absolute left-0 whitespace-nowrap text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100'>
          /heaven-sent
        </span>
      </Link>
      <div className='order-first basis-full whitespace-nowrap text-right text-muted-foreground min-[420px]:order-none min-[420px]:ml-auto min-[420px]:basis-auto'>
        <span className='blink text-foreground'>_</span>
        {hydrated && new Date().toLocaleDateString('es-ES', { timeZone: SITE_TIME_ZONE })}
      </div>
    </nav>
  );
};
