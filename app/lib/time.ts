export const SITE_TIME_ZONE = 'Europe/Madrid';

function offsetMinutes(instant: Date): number {
  const name = new Intl.DateTimeFormat('en-US', { timeZone: SITE_TIME_ZONE, timeZoneName: 'longOffset' })
    .formatToParts(instant)
    .find(part => part.type === 'timeZoneName')!.value;
  const match = name.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!match) return 0;
  const minutes = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === '-' ? -minutes : minutes;
}

const pad = (value: number) => String(value).padStart(2, '0');

export function madridIso(wallClock: string): string {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(wallClock)) return '';
  const asUtc = new Date(`${wallClock}:00Z`);
  if (isNaN(asUtc.getTime())) return '';
  const guessOffset = offsetMinutes(asUtc);
  const offset = offsetMinutes(new Date(asUtc.getTime() - guessOffset * 60_000));
  const sign = offset < 0 ? '-' : '+';
  const abs = Math.abs(offset);
  return `${wallClock}:00${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}
