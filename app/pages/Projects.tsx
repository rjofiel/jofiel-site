import type { ReactNode } from 'react';
import { ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { Page, PageTitle } from '@/components/Page';
import { pageMeta } from '@/lib/meta';

interface Project {
  name: string;
  description: string;
  url?: string;
  tech: string[];
}

const focus = ['typescript', 'ai agents', 'postgres'];

const projects: Project[] = [
  {
    name: 'curriculum',
    description: 'apparently, this is my cv.',
    url: 'https://github.com/rjofiel/jofiel-cv',
    tech: ['latex']
  },
  {
    name: 'anime list',
    description: 'a thing i built that actually works. a bit outdated. class project.',
    url: 'https://github.com/rjofiel/AnimeList',
    tech: ['java']
  }
];

const TagList = ({ tags }: { tags: string[] }) => (
  <span className='inline-flex flex-wrap gap-2'>
    {tags.map(tag => (
      <span key={tag} className='text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded'>
        {tag}
      </span>
    ))}
  </span>
);

const SectionLabel = ({ children }: { children: ReactNode }) => <h2 className='text-sm text-foreground'>{children}</h2>;

const ProjectItem = ({ project }: { project: Project }) => (
  <article className='space-y-2'>
    <div className='flex items-center gap-2'>
      <h3 className='text-sm font-medium text-foreground'>{project.name}</h3>
      {project.url && (
        <a
          href={project.url}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={`${project.name} on github`}
          className='text-muted-foreground hover:text-primary transition-colors'>
          <ExternalLinkIcon className='w-3 h-3' />
        </a>
      )}
    </div>
    <p className='text-sm text-muted-foreground'>{project.description}</p>
    <TagList tags={project.tech} />
  </article>
);

const Projects = () => (
  <Page meta={pageMeta('/projects')}>
    <section>
      <PageTitle>/projects</PageTitle>
      <p className='text-sm text-muted-foreground'>things i've built, or i'm still actively messing with.</p>
    </section>

    <section className='space-y-2'>
      <SectionLabel>now</SectionLabel>
      <p className='body-copy'>i changed lanes. from frontend to backend, data and ai.</p>
      <p className='body-copy'>currently, i build ai agents that talk to people, and everything behind them.</p>
      <p className='body-copy'>most of the code is written with ai agents now. i plan, review and decide.</p>
      <p className='text-sm text-muted-foreground pt-2'>
        current focus: <TagList tags={focus} />
      </p>
    </section>

    <section className='space-y-6'>
      <SectionLabel>projects</SectionLabel>
      {projects.map(project => (
        <ProjectItem key={project.name} project={project} />
      ))}
    </section>

    <p className='text-xs text-muted-foreground'>this site: react, mdx, and a lot of hope.</p>
  </Page>
);

export default Projects;
