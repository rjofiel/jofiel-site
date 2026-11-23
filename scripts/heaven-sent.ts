import { compile } from '@mdx-js/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeWord, seal } from '../app/heaven-sent/crypto.ts';
import { readNote, type Reader, type SealedNote } from '../app/heaven-sent/gate.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const notePath = join(root, 'private/heaven-sent/note.mdx');
const sealedPath = join(root, 'app/heaven-sent/sealed.json');

const GUESTS_WORD_ENV = 'HEAVEN_SENT_WORD';
const OWNER_WORD_ENV = 'HEAVEN_SENT_OWNER_WORD';

const readerLabels: Record<Reader, string> = {
  guests: 'opens for the letters, from january 1st (madrid)',
  owner: 'opens for you, any day'
};

function askHidden(question: string, envName = GUESTS_WORD_ENV): Promise<string> {
  const fromEnv = process.env[envName];
  if (fromEnv) return Promise.resolve(fromEnv);
  if (!process.stdin.isTTY) {
    return Promise.reject(new Error(`No TTY: run this in a terminal or set ${envName}.`));
  }
  return new Promise(resolve => {
    process.stdout.write(question);
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    let value = '';
    const onData = (char: string) => {
      if (char === '\r' || char === '\n') {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.off('data', onData);
        process.stdout.write('\n');
        resolve(value);
      } else if (char === '\u0003') {
        process.exit(130);
      } else if (char === '\u007f') {
        value = value.slice(0, -1);
      } else {
        value += char;
      }
    };
    stdin.on('data', onData);
  });
}

async function askNewWord(label: string, envName: string): Promise<string> {
  const word = await askHidden(`${label}: `, envName);
  const again = await askHidden(`${label} again: `, envName);
  if (normalizeWord(word) !== normalizeWord(again)) throw new Error('The two words do not match. Nothing was written.');
  if (normalizeWord(word).length < 8) {
    throw new Error('Use at least 8 letters or digits: the ciphertext is public, so a short word can be guessed offline.');
  }
  return word;
}

async function opensAs(note: SealedNote, word: string, reader: Reader, compiled: string): Promise<boolean> {
  const reading = await readNote(note, word);
  return reading?.reader === reader && reading.code === compiled;
}

async function sealCommand() {
  if (!existsSync(notePath)) {
    throw new Error(`Missing ${notePath}. Write the note there first (the folder is gitignored).`);
  }
  const source = readFileSync(notePath, 'utf8');
  const compiled = String(await compile(source, { outputFormat: 'function-body', remarkPlugins: [remarkFrontmatter] }));

  const guestsWord = await askNewWord('word for the letters', GUESTS_WORD_ENV);
  const ownerWord = await askNewWord('your own word', OWNER_WORD_ENV);
  if (normalizeWord(guestsWord) === normalizeWord(ownerWord)) {
    throw new Error('Your own word must differ from the letters word. Nothing was written.');
  }

  const note: SealedNote = { guests: await seal(compiled, guestsWord), owner: await seal(compiled, ownerWord) };
  const roundTrip = (await opensAs(note, guestsWord, 'guests', compiled)) && (await opensAs(note, ownerWord, 'owner', compiled));
  if (!roundTrip) throw new Error('Round-trip failed. Nothing was written.');

  writeFileSync(sealedPath, JSON.stringify(note, null, 2) + '\n');
  console.log(`sealed -> ${sealedPath.replace(root + '/', '')} (round-trip ok for both words)`);
}

async function checkCommand() {
  if (!existsSync(sealedPath)) throw new Error('No sealed.json yet. Run seal first.');
  const note = JSON.parse(readFileSync(sealedPath, 'utf8')) as SealedNote;
  const word = await askHidden('word: ');
  const reading = await readNote(note, word);
  if (reading === null) {
    console.log('wrong word');
    process.exitCode = 1;
  } else {
    console.log(readerLabels[reading.reader]);
  }
}

const command = process.argv[2];
const commands: Record<string, () => Promise<void>> = { seal: sealCommand, check: checkCommand };

if (!commands[command]) {
  console.error('usage: npm run heaven-sent -- <seal|check>');
  process.exit(2);
}

commands[command]().catch((error: Error) => {
  console.error(error.message);
  process.exit(1);
});
