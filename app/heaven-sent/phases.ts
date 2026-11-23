import { madridIso } from '@/lib/time';

export type PhaseId = 'sealed' | 'open' | 'happened';

export type Phase = {
  id: PhaseId;
  startsAt: string;
  lines: string[];
  links?: { href: string; label: string }[];
};

export const PHASES: Phase[] = [
  {
    id: 'sealed',
    startsAt: madridIso('1970-01-01T00:00'),
    lines: ['not yet.', 'this one opens on january 1st.', 'keep the letter closed until then.']
  },
  {
    id: 'open',
    startsAt: madridIso('2027-01-01T00:00'),
    lines: ['you opened it.', 'the word is inside the letter.']
  },
  {
    id: 'happened',
    startsAt: madridIso('2027-09-23T00:00'),
    lines: ['it happened.'],
    links: []
  }
];

export function phaseAt(now: Date, phases: Phase[] = PHASES): Phase {
  let current = phases[0];
  for (const phase of phases) {
    if (now.getTime() >= new Date(phase.startsAt).getTime()) current = phase;
  }
  return current;
}

export const guestsMustWait = (phase: Phase) => phase.id === 'sealed';
