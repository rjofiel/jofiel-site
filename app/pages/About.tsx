import { Layout } from '@/components/Layout';
import { ExternalLink } from '@/components/ExternalLink';
import { HeartRateWidget } from '@/components/HeartRateWidget';
import { Decoration } from '@/components/Decoration';

const About = () => {
  return (
    <Layout>
      <div className='space-y-8 pt-8'>
        <section>
          <div className='flex justify-between items-end'>
            <h1 className='text-lg font-medium text-foreground mb-2'>/about</h1>
            <div className='h-14 w-14 rounded-full'>
              <img className='object-cover rounded-full w-14 h-14' src='/images/capaldi_pfp.webp' alt='peter capaldi' />
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
            <p className='text-sm leading-relaxed text-muted-foreground'>now i mostly work with react and python,</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>mostly doing AI stuff.</p>
          </div>

          <div>
            <p className='text-sm leading-relaxed text-muted-foreground'>i like building things.</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>breaking them.</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>figuring out why they broke.</p>
          </div>

          <div>
            <p className='text-sm leading-relaxed text-muted-foreground'>i use linux.</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>mostly arch.</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>sometimes it breaks.</p>
            <p className='text-sm leading-relaxed text-muted-foreground'>sometimes i learn something.</p>
          </div>

          <div>
            <p className='text-sm leading-relaxed text-muted-foreground'>outside of work:</p>
            <ul className='ml-4 space-y-1 text-sm leading-relaxed text-muted-foreground list-disc'>
              <li>anime.</li>
              <li>mechanical keyboards.</li>
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
              <li>maybe start working out (or just lift my coffee cup more)</li>
            </ul>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
