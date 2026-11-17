import { FormEvent, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { Link, useSearchParams } from 'react-router';
import { Page, PageTitle } from '@/components/Page';
import { useHydrated } from '@/lib/useHydrated';
import { pageMeta } from '@/lib/meta';
import { DoctorSilhouette } from '@/components/DoctorSilhouette';
import { mdxComponents } from '@/components/mdxComponents';
import { unseal, type SealedPayload } from '@/heaven-sent/crypto';
import { PHASES, phaseAt, type Phase, type PhaseId } from '@/heaven-sent/phases';

const sealedFiles = import.meta.glob('/app/heaven-sent/sealed.json', { eager: true, import: 'default' });
const sealed = sealedFiles['/app/heaven-sent/sealed.json'] as SealedPayload | undefined;

type NoteContent = ComponentType<{ components?: typeof mdxComponents }>;

function runCompiledMdx(code: string): NoteContent {
  const factory = new Function(code) as (runtime: typeof jsxRuntime) => { default: NoteContent };
  return factory(jsxRuntime).default;
}

function usePhase(): Phase {
  const [params] = useSearchParams();
  const preview = params.get('phase') as PhaseId | null;
  return useMemo(() => {
    const forced = import.meta.env.DEV && preview ? PHASES.find(phase => phase.id === preview) : undefined;
    return forced ?? phaseAt(new Date());
  }, [preview]);
}

const PhaseMessage = ({ phase }: { phase: Phase }) => (
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
);

const WordForm = ({ payload, onOpen }: { payload: SealedPayload; onOpen: (code: string) => void }) => {
  const [word, setWord] = useState('');
  const [status, setStatus] = useState<'idle' | 'opening' | 'wrong'>('idle');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!word.trim()) return;
    setStatus('opening');
    const code = await unseal(payload, word);
    setStatus(code === null ? 'wrong' : 'idle');
    if (code !== null) onOpen(code);
  };

  return (
    <>
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
        <button type='submit' disabled={status === 'opening'} className='text-muted-foreground hover:text-primary disabled:opacity-50'>
          {status === 'opening' ? 'opening...' : '/open'}
        </button>
      </form>
      {status === 'wrong' && <p className='text-xs text-muted-foreground'>not that one. try again.</p>}
    </>
  );
};

const SealedNote = () => {
  const phase = usePhase();
  const [Note, setNote] = useState<NoteContent | null>(null);

  if (Note) {
    return (
      <article>
        <Note components={mdxComponents} />
      </article>
    );
  }
  return (
    <>
      <PhaseMessage phase={phase} />
      {sealed && <WordForm payload={sealed} onOpen={code => setNote(() => runCompiledMdx(code))} />}
    </>
  );
};

export const HeavenSent = () => {
  const hydrated = useHydrated();

  return (
    <Page meta={pageMeta('/heaven-sent')} className='relative min-h-[30rem] space-y-8'>
      <section>
        <PageTitle>
          /heaven-sent/<span className='blink'>_</span>
        </PageTitle>
      </section>
      {hydrated && <SealedNote />}
      <DoctorSilhouette />
    </Page>
  );
};
