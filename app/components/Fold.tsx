import type { ReactNode } from 'react';
import { useMadridToday } from '@/lib/useMadridToday';

type FoldProps = { label: string; from?: string; children: ReactNode };

export const Fold = ({ label, from, children }: FoldProps) => {
  const today = useMadridToday();
  if (from && today < from) return <>{children}</>;
  return (
    <details className='my-8 border-t border-border pt-4'>
      <summary className='cursor-pointer text-sm text-muted-foreground hover:text-primary'>{label}</summary>
      <div className='pt-6'>{children}</div>
    </details>
  );
};

export const From = ({ date, children }: { date: string; children: ReactNode }) => (useMadridToday() >= date ? <>{children}</> : null);
