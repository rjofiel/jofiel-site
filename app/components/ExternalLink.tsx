import { ReactNode } from 'react';

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  description?: string;
}

export const ExternalLink = ({ href, children, description }: ExternalLinkProps) => {
  return (
    <p className='text-sm leading-relaxed'>
      <a href={href} target='_blank' rel='noopener noreferrer' className='text-link'>
        <span className='blink'>_</span>

        {children}
      </a>
      {description && <span className='text-muted-foreground'> {description}</span>}
    </p>
  );
};
