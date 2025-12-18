import { Layout } from '@/components/Layout';
import { ExternalLink as ExternalLinkIcon } from 'lucide-react';

interface Project {
  name: string;
  description: string;
  url?: string;
  tech: string[];
}

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

const Projects = () => {
  return (
    <Layout>
      <div className='space-y-8 pt-8'>
        <section>
          <h1 className='text-lg font-medium text-foreground mb-2'>/projects</h1>

          <div>
            <p className='text-sm text-muted-foreground'>things i've built,</p>
            <p className='text-sm text-muted-foreground'>or i'm still actively messing with.</p>
            <p className='text-sm text-muted-foreground'>
              current focus:{' '}
              <div className='inline-flex gap-2'>
                {['react', 'python'].map(lang => (
                  <span key={lang} className='text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded'>
                    {lang}
                  </span>
                ))}
              </div>
            </p>
          </div>
        </section>

        <section className='space-y-6'>
          {projects.map(project => (
            <article key={project.name} className='space-y-2'>
              <div className='flex items-center gap-2'>
                <h2 className='text-sm font-medium text-foreground'>{project.name}</h2>
                {project.url && (
                  <a
                    href={project.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-muted-foreground hover:text-primary transition-colors'>
                    <ExternalLinkIcon className='w-3 h-3' />
                  </a>
                )}
              </div>
              <p className='text-sm text-muted-foreground'>{project.description}</p>
              <div className='flex gap-2'>
                {project.tech.map(t => (
                  <span key={t} className='text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded'>
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </Layout>
  );
};

export default Projects;
