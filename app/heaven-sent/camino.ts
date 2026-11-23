export type StageText = { line?: string; notes?: string[] };

export type CaminoStage = StageText & { from: string; to: string; km: number; date: string };

export type CaminoStart = StageText & { from: string; to: string; date: string; until: string };

export type StageState = 'past' | 'now' | 'next';

export type CaminoState = 'before' | 'starting' | 'walking' | 'arrived';

export type CaminoProgress = {
  state: CaminoState;
  day: number;
  total: number;
  kmDone: number;
  kmTotal: number;
  daysToStart: number;
  current?: CaminoStage;
  first: CaminoStage;
  last: CaminoStage;
  start?: CaminoStart;
};

const DAY_MS = 86_400_000;

export function spanState(from: string, until: string, today: string): StageState {
  if (until < today) return 'past';
  return from <= today ? 'now' : 'next';
}

export const stageState = (stage: CaminoStage, today: string) => spanState(stage.date, stage.date, today);

export const startState = (start: CaminoStart, today: string) => spanState(start.date, start.until, today);

const sumKm = (stages: CaminoStage[]) => Math.round(stages.reduce((total, stage) => total + stage.km, 0) * 10) / 10;

const daysBetween = (from: string, to: string) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS);

function caminoState(departure: string, first: CaminoStage, last: CaminoStage, today: string): CaminoState {
  if (today < departure) return 'before';
  if (today < first.date) return 'starting';
  return today > last.date ? 'arrived' : 'walking';
}

export function caminoProgress(stages: CaminoStage[], today: string, start?: CaminoStart): CaminoProgress {
  const [first, last] = [stages[0], stages[stages.length - 1]];
  const departure = start?.date ?? first.date;
  const done = stages.filter(stage => stageState(stage, today) === 'past');
  const current = stages.find(stage => stageState(stage, today) === 'now');
  return {
    state: caminoState(departure, first, last, today),
    day: done.length + (current ? 1 : 0),
    total: stages.length,
    kmDone: sumKm(done),
    kmTotal: sumKm(stages),
    daysToStart: daysBetween(today, departure),
    current,
    first,
    last,
    start
  };
}

export function weekdayOf(date: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`)).toLowerCase();
}

export const dayMonth = (date: string) => `${date.slice(8, 10)}/${date.slice(5, 7)}`;
