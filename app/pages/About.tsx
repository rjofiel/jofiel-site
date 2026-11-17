import { Page, PageTitle } from '@/components/Page';
import { pageMeta } from '@/lib/meta';
import { DoctorSilhouette } from '@/components/DoctorSilhouette';

const fetchLines: [string, string][] = [
  ['aka', 'ludox (retired)'],
  ['os', 'macos (unfortunately)'],
  ['distro', 'arch (someday again)'],
  ['location', 'barcelona'],
  ['work', 'kresco. backend, data, ai'],
  ['uptime', '29 years'],
  ['next', 'walk 150km']
];

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
    <Page meta={pageMeta('/about')} className='relative space-y-8'>
      <section>
        <PageTitle className='mb-4'>/about</PageTitle>
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
              {fetchColors.map(color => (
                <span key={color} className='h-3 w-4' style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='space-y-4'>
        <div>
          <p className='body-copy'>i started with angular and java.</p>
          <p className='body-copy'>didn’t like react at all.</p>
          <p className='body-copy'>somehow ended up here anyway.</p>
          <p className='body-copy'>now i mostly do backend, data and AI stuff.</p>
          <p className='body-copy'>agents that talk to people. and everything behind them.</p>
        </div>

        <div>
          <p className='body-copy'>i like building things.</p>
          <p className='body-copy'>breaking them.</p>
          <p className='body-copy'>figuring out why they broke.</p>
        </div>

        <div>
          <p className='body-copy'>i use linux.</p>
          <p className='body-copy'>mostly arch.</p>
          <p className='body-copy'>well... used to.</p>
          <p className='body-copy'>right now it's a mac (unfortunately).</p>
          <p className='body-copy'>let's see when i go back to arch.</p>
        </div>

        <div>
          <p className='body-copy'>outside of work:</p>
          <ul className='ml-4 space-y-1 text-sm leading-relaxed text-muted-foreground list-disc'>
            <li>anime.</li>
            <li>doctor who.</li>
            <li>mechanical keyboards.</li>
            <li>long walks. the longer the better.</li>
            <li>overthinking things.</li>
          </ul>
        </div>

        <div>
          <p className='body-copy'>this site is just a place</p>
          <p className='body-copy'>to leave things behind.</p>
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
              <span className='line-through'>maybe start working out (or just lift my coffee cup more)</span> back at the gym. walked 30km
              at la marcha del mamut.
            </li>
            <li>be able to walk more than 150km</li>
          </ul>
        </div>
      </section>

      <DoctorSilhouette />
    </Page>
  );
};

export default About;
