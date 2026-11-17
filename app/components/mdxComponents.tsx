/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExternalLink } from '@/components/ExternalLink';

// Shared by blog posts and sealed notes so both render with the same typography.
export const mdxComponents = {
  hr: (props: any) => <hr className='my-8' />,
  h1: (props: any) => <h1 className='text-lg leading-relaxed text-foreground my-2 font-bold' {...props} />,
  h2: (props: any) => <h2 className='text-[16px] leading-relaxed text-foreground my-2 font-semibold' {...props} />,
  h3: (props: any) => <h3 className='text-sm leading-relaxed text-foreground my-1' {...props} />,
  p: (props: any) => <p className='text-sm leading-relaxed text-muted-foreground mb-4' {...props} />,
  a: ExternalLink,
  em: (props: any) => <span className='italic' {...props} />,
  strong: (props: any) => <span className='font-semibold' {...props} />,
  ul: (props: any) => <ul className='list-disc ml-4 my-2' {...props} />,
  li: (props: any) => <li className='text-sm leading-relaxed text-muted-foreground' {...props} />,
  code: (props: any) => <code className='bg-muted px-1 rounded' {...props} />,
  // Secondary-language block: same content, lighter and smaller, right under the original.
  Es: (props: any) => (
    <div lang='es' className='-mt-2 mb-6 opacity-60 [&_li]:text-xs [&_p]:mb-2 [&_p]:text-xs' {...props} />
  )
};
