// Seals the private /heaven-sent note with the word printed on the card inside each letter.
//
//   npm run heaven-sent -- seal    compile private/heaven-sent/note.mdx, encrypt it, write sealed.json
//   npm run heaven-sent -- check   ask for a word and tell whether it opens sealed.json
//
// The word is only read from a hidden prompt (or HEAVEN_SENT_WORD for automation), never from argv,
// so it does not end up in shell history. The note plaintext never leaves private/, which is gitignored.

import { compile } from '@mdx-js/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { seal, unseal, type SealedPayload } from '../app/heaven-sent/crypto.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const notePath = join(root, 'private/heaven-sent/note.mdx');
const sealedPath = join(root, 'app/heaven-sent/sealed.json');

function askHidden(question: string): Promise<string> {
  const fromEnv = process.env.HEAVEN_SENT_WORD;
  if (fromEnv) return Promise.resolve(fromEnv);
  if (!process.stdin.isTTY) {
    return Promise.reject(new Error('No TTY: run this in a terminal or set HEAVEN_SENT_WORD.'));
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

async function sealCommand() {
  if (!existsSync(notePath)) {
    throw new Error(`Missing ${notePath}. Write the note there first (the folder is gitignored).`);
  }
  const source = readFileSync(notePath, 'utf8');
  const compiled = String(await compile(source, { outputFormat: 'function-body', remarkPlugins: [remarkFrontmatter] }));

  const word = await askHidden('word: ');
  const again = await askHidden('word again: ');
  if (word !== again) throw new Error('The two words do not match. Nothing was written.');
  if (word.trim().length < 8) {
    throw new Error('Use at least 8 characters: the ciphertext is public, so a short word can be guessed offline.');
  }

  const payload = await seal(compiled, word);
  if ((await unseal(payload, word)) !== compiled) throw new Error('Round-trip failed. Nothing was written.');

  writeFileSync(sealedPath, JSON.stringify(payload, null, 2) + '\n');
  console.log(`sealed -> ${sealedPath.replace(root + '/', '')} (round-trip ok)`);
}

async function checkCommand() {
  if (!existsSync(sealedPath)) throw new Error('No sealed.json yet. Run seal first.');
  const payload = JSON.parse(readFileSync(sealedPath, 'utf8')) as SealedPayload;
  const word = await askHidden('word: ');
  const result = await unseal(payload, word);
  if (result === null) {
    console.log('wrong word');
    process.exitCode = 1;
  } else {
    console.log('opens');
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
