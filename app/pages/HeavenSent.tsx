import { FormEvent, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { Link, useSearchParams } from 'react-router';
import { Page, PageTitle } from '@/components/Page';
import { pageMeta } from '@/lib/meta';
import { DoctorSilhouette } from '@/components/DoctorSilhouette';
import { mdxComponents } from '@/components/mdxComponents';
import { unseal, type SealedPayload } from '@/heaven-sent/crypto';
import { PHASES, phaseAt, type PhaseId } from '@/heaven-sent/phases';

// sealed.json is created by `npm run heaven-sent -- seal`; until then the page has nothing to open.
const sealedFiles = import.meta.glob('/app/heaven-sent/sealed.json', { eager: true, import: 'default' });
const sealed = sealedFiles['/app/heaven-sent/sealed.json'] as SealedPayload | undefined;

type NoteContent = ComponentType<{ components?: typeof mdxComponents }>;

// The ciphertext is MDX compiled with outputFormat 'function-body'. AES-GCM only decrypts what was
// sealed with the word, so the code evaluated here is always our own compiled note.
function runCompiledMdx(code: string): NoteContent {
  const factory = new Function(code) as (runtime: typeof jsxRuntime) => { default: NoteContent };
  return factory(jsxRuntime).default;
}

function usePhase() {
  const [params] = useSearchParams();
  const preview = params.get('phase') as PhaseId | null;
  return useMemo(() => {
    if (import.meta.env.DEV && preview) {
      const forced = PHASES.find(phase => phase.id === preview);
      if (forced) return forced;
    }
    return phaseAt(new Date());
  }, [preview]);
}

export const HeavenSent = () => {
  const phase = usePhase();
  const [word, setWord] = useState('');
  const [status, setStatus] = useState<'idle' | 'opening' | 'wrong'>('idle');
  const [Note, setNote] = useState<NoteContent | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!sealed || !word.trim()) return;
    setStatus('opening');
    const code = await unseal(sealed, word);
    if (code === null) {
      setStatus('wrong');
      return;
    }
    setNote(() => runCompiledMdx(code));
    setStatus('idle');
  };

  return (
    <Page meta={pageMeta('/heaven-sent')} className='relative min-h-[30rem] space-y-8'>
      <section>
        <PageTitle>
          /heaven-sent/<span className='blink'>_</span>
        </PageTitle>
      </section>

      {Note ? (
        <article>
          <Note components={mdxComponents} />
        </article>
      ) : (
        <>
          <div className='space-y-4'>
            {phase.lines.map(line => (
              <p key={line} className='text-sm text-muted-foreground'>
                {line}
              </p>
            ))}
            {phase.links?.map(link => (
              <p key={link.href} className='text-sm'>
                <Link to={link.href} className='text-primary hover:underline'>
                  {link.label}
                </Link>
              </p>
            ))}
          </div>

          {sealed && (
            <form onSubmit={onSubmit} className='flex items-center gap-2 text-sm'>
              <label htmlFor='heaven-sent-word' className='text-muted-foreground'>
                &gt;
              </label>
              <input
                id='heaven-sent-word'
                type='password'
                autoComplete='off'
                autoCapitalize='none'
                spellCheck={false}
                value={word}
                onChange={event => {
                  setWord(event.target.value);
                  if (status === 'wrong') setStatus('idle');
                }}
                placeholder='the word'
                aria-label='the word from the letter'
                className='bg-transparent border-b border-muted text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary w-40'
              />
              <button
                type='submit'
                disabled={status === 'opening'}
                className='text-muted-foreground hover:text-primary disabled:opacity-50'>
                {status === 'opening' ? 'opening...' : '/open'}
              </button>
            </form>
          )}
          {status === 'wrong' && <p className='text-xs text-muted-foreground'>not that one. try again.</p>}
        </>
      )}
      <DoctorSilhouette />
    </Page>
  );
};
