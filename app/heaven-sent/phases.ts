// One fixed route, several moments. Dates are Europe/Madrid, written as UTC instants.
// Add a phase by appending to PHASES; the URL never changes.

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
    startsAt: '1970-01-01T00:00:00Z',
    lines: ['not yet.', 'this one opens on january 1st.', 'keep the letter closed until then.']
  },
  {
    // 2027-01-01 00:00 CET
    id: 'open',
    startsAt: '2026-12-31T23:00:00Z',
    lines: ['you opened it.', 'the word is inside the letter.']
  },
  {
    // 2027-09-23 00:00 CEST, the day after arriving
    id: 'happened',
    startsAt: '2027-09-22T22:00:00Z',
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
