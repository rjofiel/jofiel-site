import type { ReactNode } from 'react';

type Stage = 'past' | 'now' | 'next';

const boxStyles: Record<Stage, string> = {
  past: 'border-border',
  now: 'border-primary',
  next: 'border-dashed border-muted-foreground/60'
};

const nameStyles: Record<Stage, string> = {
  past: 'text-foreground',
  now: 'text-primary',
  next: 'text-muted-foreground'
};

const stageLabels: Record<Stage, string> = {
  past: '',
  now: '<- now',
  next: 'next?'
};

type StepProps = { name: string; note?: string; stage?: Stage };

export const Step = ({ name, note, stage = 'past' }: StepProps) => (
  <li className='flex w-full max-w-md flex-col items-start'>
    <span aria-hidden='true' className='flow-arrow pl-4 text-sm leading-6 text-muted-foreground'>
      |<br />v
    </span>
    <div className={`w-full border px-3 py-2 ${boxStyles[stage]}`}>
      <p className='text-sm'>
        <span className={nameStyles[stage]}>{name}</span>
        <span className='pl-3 text-xs text-muted-foreground'>{stageLabels[stage]}</span>
      </p>
      {note && <p className='text-xs leading-relaxed text-muted-foreground'>{note}</p>}
    </div>
  </li>
);

export const Flow = ({ label, children }: { label: string; children: ReactNode }) => (
  <ol aria-label={label} className='my-6 flex flex-col items-start [&>li:first-child>.flow-arrow]:hidden'>
    {children}
  </ol>
);
