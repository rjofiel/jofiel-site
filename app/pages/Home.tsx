import { Layout } from '@/components/Layout';
import { ExternalLink } from '@/components/ExternalLink';
import { HeartRateWidget } from '@/components/HeartRateWidget';
import { Decoration } from '@/components/Decoration';

const Home = () => {
  return (
    <Layout>
      <div className='space-y-10 pt-8'>
        {/* Intro */}
        <section className='space-y-4'>
          <p className='text-sm leading-relaxed text-foreground'>
            hi, im <span className='text-primary'>ludox</span>.
          </p>
          <p className='text-sm leading-relaxed text-muted-foreground'>
            a developer. the kind that builds things, breaks them, then rebuilds them at 3am wondering why they ever started.{' '}
          </p>
          <p className='text-sm leading-relaxed text-muted-foreground'></p>
          <p className='text-sm leading-relaxed text-muted-foreground'>
            currently jumping between ideas, side projects, and hyperfixations…{' '}
          </p>

          <div>
            <p className='text-sm leading-relaxed text-muted-foreground'>
              sometimes i <span className='text-foreground'>write</span>.
            </p>
            <p className='text-sm leading-relaxed text-muted-foreground'>
              sometimes it <span className='text-foreground'>makes sense</span>.{' '}
            </p>
            <p className='text-sm leading-relaxed text-muted-foreground'>
              sometimes <span className='text-foreground'>not</span>.
            </p>
          </div>

          <div>
            <p className='text-sm leading-relaxed text-muted-foreground'>
              this project came from a{' '}
              <a href='https://x.com/_petalite' target='_blank' rel='noopener noreferrer' className='text-link'>
                tweet
              </a>{' '}
              i saw one night
            </p>
            <p className='text-sm leading-relaxed text-muted-foreground'>and a website that felt minimal, weird,</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>and a bit too intimate.</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>the heart rate thing especially.</p>
          </div>
          <div>
            <p className='text-sm leading-relaxed text-muted-foreground'>also, i still have a pixel 2 lying around,</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>so i decided to make it useful.</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>feel free to look around.</p>
          </div>
        </section>

        {/* Links */}
        <section className='space-y-2'>
          <p className='text-sm text-muted-foreground mb-4'>here's some links:</p>
          <ExternalLink
            href='https://github.com/rjofiel'
            description='code, experiments, half-finished ideas, and projects held together by duct tape and hope.'>
            github stuff
          </ExternalLink>
          <ExternalLink
            href='https://twitter.com/srludox'
            description='random thoughts, jokes, bad takes, and the occasional existential crisis at 2am.'>
            twitter
          </ExternalLink>
          <ExternalLink href='https://linkedin.com/in/rjofiel' description='“professional” stuff. the socially acceptable version of me. heh.'>
            linkedin
          </ExternalLink>
          <ExternalLink
            href='mailto:rjofiel97@outlook.es'
            description='you can write. just know it might go to spam, and if it doesn’t, i will overthink it anyway.'>
            email
          </ExternalLink>
        </section>

        {/* Heart rate section */}
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

        {/* Footer note */}
        <section className='pt-8'>
          <p className='text-xs text-muted-foreground'>
            <span className='blink'>_</span>
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
