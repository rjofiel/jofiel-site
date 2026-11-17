import { Layout } from '@/components/Layout';
import { ExternalLink } from '@/components/ExternalLink';
import { HeartRateWidget } from '@/components/HeartRateWidget';
import { Decoration } from '@/components/Decoration';
import { DitheredImage } from '@/components/DitheredImage';

const About = () => {
  return (
    <Layout>
      <div className='relative space-y-8 pt-8'>
        <section>
          <div className='flex justify-between items-end'>
            <h1 className='text-lg font-medium text-foreground mb-2'>/about</h1>
            <div className='h-14 w-14 overflow-hidden rounded-full'>
              <img className='h-14 w-14 rounded-full object-cover grayscale contrast-125 brightness-90 transition duration-500 hover:grayscale-0' src='/images/ludox.webp' alt='me' />
            </div>
          </div>
          <p className='text-sm text-muted-foreground'>
            online i go by <span className='line-through'>ludox</span> or jofiel.
          </p>
        </section>

        {/* Intro */}
        <section className='space-y-4'>
          <div>
            <p className='text-sm leading-relaxed text-muted-foreground'>i started with angular and java.</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>didn’t like react at all.</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>somehow ended up here anyway.</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>now i mostly do backend, data and AI stuff.</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>agents that talk to people. and everything behind them.</p>
          </div>

          <div>
            <p className='text-sm leading-relaxed text-muted-foreground'>i like building things.</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>breaking them.</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>figuring out why they broke.</p>
          </div>

          <div>
            <p className='text-sm leading-relaxed text-muted-foreground'>i use linux.</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>mostly arch.</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>well... used to.</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>right now it's a mac (unfortunately).</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>let's see when i go back to arch.</p>
          </div>

          <div>
            <p className='text-sm leading-relaxed text-muted-foreground'>outside of work:</p>
            <ul className='ml-4 space-y-1 text-sm leading-relaxed text-muted-foreground list-disc'>
              <li>anime.</li>
              <li>doctor who.</li>
              <li>mechanical keyboards.</li>
              <li>long walks. the longer the better.</li>
              <li>overthinking things.</li>
            </ul>
          </div>

          <div>
            <p className='text-sm leading-relaxed text-muted-foreground'>this site is just a place</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>to leave things behind.</p>
          </div>
        </section>

        <section>
          <div className='space-y-4'>
            <p className='text-base font-medium text-foreground'>things i want to do before 30</p>
            <ul className='ml-4 space-y-1 text-sm leading-relaxed text-muted-foreground list-disc'>
              <li>get a house (or pay off some debt)</li>
              <li>feel loved by someone else</li>
              <li>avoid existential crises (or at least hide them better)</li>
              <li>remove all social media (goodbye dopamine)</li>
              <li>
                <span className='line-through'>maybe start working out (or just lift my coffee cup more)</span>{' '}
                back at the gym. walked 30km at la marcha del mamut.
              </li>
              <li>be able to walk more than 150km</li>
            </ul>
          </div>
        </section>

        <div aria-hidden className='pointer-events-none absolute -bottom-8 -right-6 -z-10 w-56 select-none sm:-right-16 sm:w-80 [mask-image:linear-gradient(to_bottom,black_75%,transparent)]'>
          <DitheredImage
            src='/images/capaldi_gallifrey.webp'
            alt=''
            width={320}
            dotSize={1}
            contrast={1.3}
            invert
            className='text-muted-foreground opacity-25'
          />
        </div>
      </div>
    </Layout>
  );
};

export default About;
