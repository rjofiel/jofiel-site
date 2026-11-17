import type { ComponentProps } from 'react';
import type { MDXComponents } from 'mdx/types';
import { ExternalLink } from '@/components/ExternalLink';

export const mdxComponents: MDXComponents = {
  hr: () => <hr className='my-8' />,
  h1: props => <h1 className='text-lg leading-relaxed text-foreground my-2 font-bold' {...props} />,
  h2: props => <h2 className='text-[16px] leading-relaxed text-foreground my-2 font-semibold' {...props} />,
  h3: props => <h3 className='text-sm leading-relaxed text-foreground my-1' {...props} />,
  p: props => <p className='text-sm leading-relaxed text-muted-foreground mb-4' {...props} />,
  a: ExternalLink,
  em: props => <span className='italic' {...props} />,
  strong: props => <span className='font-semibold' {...props} />,
  ul: props => <ul className='list-disc ml-4 my-2' {...props} />,
  li: props => <li className='body-copy' {...props} />,
  code: props => <code className='bg-muted px-1 rounded' {...props} />,
  Es: (props: ComponentProps<'div'>) => (
    <div lang='es' className='-mt-2 mb-6 opacity-60 [&_li]:text-xs [&_p]:mb-2 [&_p]:text-xs' {...props} />
  )
};
