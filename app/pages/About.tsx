import { Layout } from '@/components/Layout';
import { ExternalLink } from '@/components/ExternalLink';
import { HeartRateWidget } from '@/components/HeartRateWidget';
import { Decoration } from '@/components/Decoration';
import { DoctorSilhouette } from '@/components/DoctorSilhouette';

// fastfetch-style summary shown next to the avatar.
const fetchLines: [string, string][] = [
  ['aka', 'ludox (retired)'],
  ['os', 'macos (unfortunately)'],
  ['distro', 'arch (someday again)'],
  ['location', 'barcelona'],
  ['work', 'kresco. backend, data, ai'],
  ['uptime', '29 years'],
  ['next', 'walk 150km']
];

// Terminal palette row, ending in tardis blue.
const fetchColors = [
  'var(--color-muted)',
  'var(--color-muted-foreground)',
  'var(--color-foreground)',
  'hsl(var(--heart))',
  'var(--color-primary)',
  '#003b6f'
];

const About = () => {
  return (
    <Layout>
      <div className='relative space-y-8 pt-8'>
        <section>
          <h1 className='text-lg font-medium text-foreground mb-4'>/about</h1>
          <p className='mb-3 text-xs text-muted-foreground'>
            <span className='text-primary'>$</span> whoami && fastfetch
          </p>
          <div className='flex items-start gap-4 sm:gap-6'>
            <img
              className='h-28 w-28 shrink-0 border border-border object-cover grayscale brightness-75 contrast-125 transition duration-500 hover:brightness-100 hover:grayscale-0 sm:h-32 sm:w-32'
              src='/images/ludox.webp'
              alt='me'
            />
            <div className='min-w-0 text-xs leading-relaxed'>
              <p className='text-foreground'>
                <span className='text-primary'>jofiel</span>@<span className='text-primary'>ludox</span>
              </p>
              <p className='text-border' aria-hidden>
                ------------
              </p>
              <dl className='text-muted-foreground'>
                {fetchLines.map(([key, value]) => (
                  <div key={key}>
                    <dt className='inline text-foreground'>{key}</dt>: <dd className='inline'>{value}</dd>
                  </div>
                ))}
              </dl>
              <div className='mt-2 flex' aria-hidden>
                {fetchColors.map((color) => (
                  <span key={color} className='h-3 w-4' style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          </div>
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

        <DoctorSilhouette />
      </div>
    </Layout>
  );
};

export default About;
