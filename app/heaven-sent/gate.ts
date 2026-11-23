import { unseal, type SealedPayload } from './crypto.ts';

export type SealedNote = { guests: SealedPayload; owner?: SealedPayload };

export type Reader = 'owner' | 'guests';

export type Reading = { reader: Reader; code: string };

async function readAs(reader: Reader, payload: SealedPayload | undefined, word: string): Promise<Reading | null> {
  const code = payload ? await unseal(payload, word) : null;
  return code === null ? null : { reader, code };
}

export async function readNote(note: SealedNote, word: string): Promise<Reading | null> {
  return (await readAs('owner', note.owner, word)) ?? readAs('guests', note.guests, word);
}
