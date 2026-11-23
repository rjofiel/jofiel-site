import { Flow, Step } from '@/components/Flow';
import { useMadridToday } from '@/lib/useMadridToday';
import {
  caminoProgress,
  dayMonth,
  startState,
  stageState,
  weekdayOf,
  type CaminoProgress,
  type CaminoStage,
  type CaminoStart,
  type CaminoState,
  type StageText
} from '@/heaven-sent/camino';

type Line = { en: string; es: string };

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

const routeOf = (stage: { from: string; to: string }) => `${stage.from} → ${stage.to}`;

const startLines = (progress: CaminoProgress): Line[] => [
  { en: 'stage 0.', es: 'etapa 0.' },
  ...(progress.start ? [{ en: `getting to ${progress.start.to}.`, es: `llegando a ${progress.start.to}.` }] : []),
  {
    en: `walking starts on ${weekdayOf(progress.first.date, 'en-GB')}.`,
    es: `se empieza a andar el ${weekdayOf(progress.first.date, 'es-ES')}.`
  }
];

const headlines: Record<CaminoState, (progress: CaminoProgress) => Line[]> = {
  before: progress => [
    {
      en: `the walk starts in ${plural(progress.daysToStart, 'day', 'days')}.`,
      es: `el camino empieza en ${plural(progress.daysToStart, 'día', 'días')}.`
    },
    { en: `${progress.total} stages, ${progress.kmTotal} km.`, es: `${progress.total} etapas, ${progress.kmTotal} km.` }
  ],
  starting: startLines,
  walking: progress => [
    { en: `day ${progress.day} of ${progress.total}`, es: `día ${progress.day} de ${progress.total}` },
    ...(progress.current ? [{ en: routeOf(progress.current), es: routeOf(progress.current) }] : []),
    {
      en: `should reach ${progress.last.to} on ${weekdayOf(progress.last.date, 'en-GB')}.`,
      es: `debería llegar a ${progress.last.to} el ${weekdayOf(progress.last.date, 'es-ES')}.`
    }
  ],
  arrived: progress => [
    { en: `arrived. ${progress.kmTotal} km in ${progress.total} days.`, es: `llegué. ${progress.kmTotal} km en ${progress.total} días.` }
  ]
};

function progressBar(progress: CaminoProgress): string {
  const walking = progress.current ? '>' : '';
  const rest = progress.total - progress.day;
  return `[${'#'.repeat(progress.day - walking.length)}${walking}${'-'.repeat(rest)}]`;
}

const Headline = ({ line }: { line: Line }) => (
  <div>
    <p className='text-sm text-foreground'>{line.en}</p>
    {line.es !== line.en && (
      <p lang='es' className='text-xs text-muted-foreground opacity-60'>
        {line.es}
      </p>
    )}
  </div>
);

const StageNotes = ({ notes }: { notes: string[] }) => (
  <details className='mt-1 text-xs text-muted-foreground'>
    <summary className='cursor-pointer hover:text-primary'>how it went</summary>
    <ul className='ml-4 list-disc space-y-1 pt-1 leading-relaxed'>
      {notes.map(note => (
        <li key={note}>{note}</li>
      ))}
    </ul>
  </details>
);

const StageBody = ({ text }: { text: StageText }) => (
  <>
    {text.line && <p className='pt-1 text-xs leading-relaxed text-foreground'>{text.line}</p>}
    {text.notes?.length ? <StageNotes notes={text.notes} /> : null}
  </>
);

const StartStep = ({ start, today }: { start: CaminoStart; today: string }) => (
  <Step name={routeOf(start)} note={`${dayMonth(start.date)} – ${dayMonth(start.until)} · stage 0`} stage={startState(start, today)}>
    <StageBody text={start} />
  </Step>
);

type CaminoProps = { stages: CaminoStage[]; start?: CaminoStart };

export const Camino = ({ stages, start }: CaminoProps) => {
  const today = useMadridToday();
  const progress = caminoProgress(stages, today, start);

  return (
    <section aria-label='the camino, stage by stage' className='my-8 space-y-3'>
      {headlines[progress.state](progress).map(line => (
        <Headline key={line.en} line={line} />
      ))}
      <p aria-hidden='true' className='text-xs text-primary'>
        {progressBar(progress)} {progress.kmDone}/{progress.kmTotal} km
      </p>
      <Flow label='stages'>
        {start && <StartStep start={start} today={today} />}
        {stages.map(stage => (
          <Step key={stage.date} name={routeOf(stage)} note={`${dayMonth(stage.date)} · ${stage.km} km`} stage={stageState(stage, today)}>
            <StageBody text={stage} />
          </Step>
        ))}
      </Flow>
    </section>
  );
};
