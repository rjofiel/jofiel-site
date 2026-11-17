import { Page } from '@/components/Page';
import { pageMeta } from '@/lib/meta';
import { ExternalLink } from '@/components/ExternalLink';
import { HeartRateWidget } from '@/components/HeartRateWidget';

const Home = () => {
  return (
    <Page meta={pageMeta('/')} className='space-y-10'>
      <section className='space-y-4'>
        <h1 className='text-sm leading-relaxed text-foreground'>
          hi, im <span className='text-primary'>ludox</span>.
        </h1>
        <p className='body-copy'>
          a developer. the kind that builds things, breaks them, then rebuilds them at 3am wondering why they ever started.{' '}
        </p>
        <p className='body-copy'></p>
        <p className='body-copy'>currently jumping between ideas, side projects, and hyperfixations… </p>

        <div>
          <p className='body-copy'>
            sometimes i <span className='text-foreground'>write</span>.
          </p>
          <p className='body-copy'>
            sometimes it <span className='text-foreground'>makes sense</span>.{' '}
          </p>
          <p className='body-copy'>
            sometimes <span className='text-foreground'>not</span>.
          </p>
        </div>

        <div>
          <p className='body-copy'>
            this project came from a{' '}
            <a href='https://x.com/_petalite' target='_blank' rel='noopener noreferrer' className='text-link'>
              tweet
            </a>{' '}
            i saw one night
          </p>
          <p className='body-copy'>and a website that felt minimal, weird,</p>
          <p className='body-copy'>and a bit too intimate.</p>
          <p className='body-copy'>the heart rate thing especially.</p>
        </div>
        <div>
          <p className='body-copy'>also, i still have a pixel 2 lying around,</p>
          <p className='body-copy'>so i decided to make it useful.</p>
          <p className='body-copy'>feel free to look around.</p>
        </div>
      </section>

      <section className='space-y-2'>
        <p className='text-sm text-muted-foreground mb-4'>here's some links:</p>
        <ExternalLink
          href='https://github.com/rjofiel'
          description='code, experiments, half-finished ideas, and projects held together by duct tape and hope.'>
          github
        </ExternalLink>
        <ExternalLink
          href='https://twitter.com/srludox'
          description='random thoughts, jokes, bad takes, and the occasional existential crisis at 2am.'>
          twitter
        </ExternalLink>
        <ExternalLink href='https://twitter.com/rjofiel_' description='low signal. no performance'>
          alt twitter
        </ExternalLink>
        <ExternalLink
          href='https://linkedin.com/in/rjofiel'
          description='“professional” stuff. the socially acceptable version of me. heh.'>
          linkedin
        </ExternalLink>
        <ExternalLink
          href='mailto:rjofiel97@outlook.es'
          description='you can write. just know it might go to spam, and if it doesn’t, i will overthink it anyway.'>
          email
        </ExternalLink>
      </section>

      <section className='space-y-4'>
        <p className='text-sm text-muted-foreground'>
          here's my heartrate. don't worry if it spikes, probably just coffee or debugging smth... or me staring at a terminal questioning
          my life choices.
        </p>
        <p className='text-sm text-muted-foreground'>
          if there’s nothing below, the pixel isn’t connected (or i’m dead. or arch broke again).
        </p>
        <HeartRateWidget />
      </section>

      <section className='pt-8'>
        <p className='text-xs text-muted-foreground'>
          <span className='blink'>_</span>
        </p>
      </section>
    </Page>
  );
};

export default Home;
