import fs from 'node:fs';

const MARKUP_FILES = ['index.html', ...fs.globSync('app/**/*.css'), ...fs.globSync('public/**/*.{html,svg}')];
const COMMENT = /\/\*[\s\S]*?\*\/|<!--(?!app-head-->)[\s\S]*?-->/g;
const ALLOWED_PLACEHOLDER = '<!--app-head-->';

const lineOf = (text: string, index: number) => text.slice(0, index).split('\n').length;

function commentsIn(file: string): string[] {
  const text = fs.readFileSync(file, 'utf8');
  return [...text.matchAll(COMMENT)].map(match => `${file}:${lineOf(text, match.index)} ${match[0].slice(0, 60)}`);
}

const found = MARKUP_FILES.flatMap(commentsIn);
if (found.length > 0) {
  console.error(`No comments in CSS or HTML (only ${ALLOWED_PLACEHOLDER} is allowed):\n${found.join('\n')}`);
  process.exit(1);
}
