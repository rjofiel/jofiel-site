// Posts are written in Madrid. Filenames carry Madrid wall-clock time; these helpers turn it
// into real instants and back, whatever the time zone of the build machine or the reader.
export const SITE_TIME_ZONE = 'Europe/Madrid';

// Offset of SITE_TIME_ZONE at a given instant, in minutes east of UTC (+60 in winter, +120 in summer).
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

// '2026-11-17T22:00' (Madrid wall clock) -> '2026-11-17T22:00:00+01:00'. Empty when invalid.
export function madridIso(wallClock: string): string {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(wallClock)) return '';
  const asUtc = new Date(`${wallClock}:00Z`);
  if (isNaN(asUtc.getTime())) return '';
  // Two passes so times right after a DST switch use the offset in force at that moment.
  let offset = offsetMinutes(asUtc);
  offset = offsetMinutes(new Date(asUtc.getTime() - offset * 60_000));
  const sign = offset < 0 ? '-' : '+';
  const abs = Math.abs(offset);
  return `${wallClock}:00${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}
