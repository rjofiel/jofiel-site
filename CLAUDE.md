# CLAUDE.md

Personal site of ludox, served at https://ludox.dev. React 19 + Vite + Tailwind 4 + MDX, every route
prerendered to static HTML at build time and hydrated in the browser. Deployed by Vercel from `main`.

## Commands

| Command                                     | What it does                                                                                                     |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                               | Dev server, client-side rendering only                                                                           |
| `npm run build`                             | Client build, then prerender of every route, `404.html`, sitemap, feed, robots                                   |
| `npm run check`                             | Prettier, ESLint, CSS/HTML comment check, both tsconfigs and the duplicate detector. Must pass before any commit |
| `npm run lint` / `typecheck` / `duplicates` | The individual steps of `check`                                                                                  |
| `npm run preview`                           | Serves `dist/` to test the prerendered site                                                                      |
| `npm run heaven-sent -- seal\|check`        | Seals or checks the private note. Only the owner runs it                                                         |

## Definition of done

A change is finished only when all of this holds:

- `npm run check` exits 0 and `npm run build` prints no warnings.
- `npm audit` reports 0 vulnerabilities and `npm ci` prints no warnings.
- UI changes were opened in a real browser on `npm run preview`: no console errors (hydration errors
  included) on every route the change touches.
- Docs (`README.md`, this file) describe the new behaviour if a command, route or convention changed.

## Code rules

These are enforced by `npm run check`; do not work around them.

1. **No comments.** Not in TS, TSX, CSS or HTML (ESLint `local/no-comments` for code,
   `scripts/no-markup-comments.ts` for CSS, HTML and SVG; the only exception is the `<!--app-head-->`
   placeholder `vite/seo.ts` replaces). A comment means a name is missing: extract a function,
   a constant or a component whose name says it. The reason behind a non-obvious decision goes in the
   "Why it is built this way" section below, not in the code. `eslint-disable` comments are blocked too
   (`noInlineConfig`).
2. **Cognitive complexity of 8 or less per function** (`sonarjs/cognitive-complexity`). Split loops,
   nested conditions and nested ternaries into small named functions or components.
3. **No duplicated logic** (`jscpd`, threshold 0). Before writing something, look for it below in
   "Shared building blocks" and reuse it. If two places need the same thing, make it generic once:
   a component in `app/components`, a pure function in `app/lib`, a hook in `app/lib/use*.ts`.
4. **No `any` and no unused code.** Type props with `ComponentProps<'tag'>` or the library's types.
   Dead code is deleted, never commented out; git keeps the history.
5. **Pure logic lives outside components.** Components render; calculations (dates, metadata, image
   processing, crypto) are plain functions in `app/lib` or `app/heaven-sent` that can run in Node too.
6. **Names explain intent**: `guessOffset` and `offset`, not `offset` reassigned twice.

### Lint exceptions

They live in `eslint.config.js`, scoped to one file each. Adding one needs a reason added here.
`sonarjs/todo-tag` and `sonarjs/fixme-tag` are off everywhere: they flag comments, which
`local/no-comments` already rejects, so they would only report the same line twice.

- `app/components/FloatingDecorations.tsx`, `sonarjs/pseudo-random`: `Math.random` only places
  decorative symbols, nothing security related.
- `app/pages/HeavenSent.tsx`, `sonarjs/code-eval`: `new Function` only runs MDX that AES-GCM has just
  authenticated with the word, so it is always our own compiled note.

## Shared building blocks

| Need                                            | Use                                                                                        |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------ |
| A page with layout, `<head>` and content column | `Page` and `PageTitle` (`app/components/Page.tsx`)                                         |
| Title, description, preview tags of a route     | `app/content/site.json`, read through `pageMeta()` / `postMeta()` (`app/lib/meta.ts`)      |
| `<head>` tags, build and client                 | `headTags()` + `renderHead()`; the client swaps them with `usePageMeta()`                  |
| Posts, list and bodies                          | `getAllPosts`, `getPost`, `postBody`, `postsByYear`, `formatPostDate` (`app/lib/posts.ts`) |
| Dates and times                                 | `SITE_TIME_ZONE`, `madridIso()` (`app/lib/time.ts`)                                        |
| Anything depending on the clock or randomness   | render it only when `useHydrated()` is true                                                |
| MDX typography (posts and the sealed note)      | `mdxComponents` (`app/components/mdxComponents.tsx`)                                       |
| Body text style                                 | `.body-copy` class (`app/app.css`)                                                         |
| External links                                  | `ExternalLink`                                                                             |
| Photos in the terminal look                     | `DitheredImage` (algorithm in `app/lib/dither.ts`)                                         |

## Why it is built this way

- **Prerender + hydration.** Crawlers, link previews and AI bots do not run JavaScript, so
  `vite/seo.ts` runs an SSR build of `app/entry-server.tsx` after the client build and writes every
  route with its full text. `app/root.tsx` hydrates it; `app/App.tsx` holds the routes for both.
  Anything that can differ between build time and the visitor (today's date, random positions, the
  `/heaven-sent` phase) must wait for `useHydrated()`, or React throws a hydration error. Invalid HTML
  nesting (a `<div>` inside a `<p>`) breaks hydration too.
- **Post bodies ship in the main bundle.** All posts together are about 20 kB gzip, so they are
  imported eagerly (`import.meta.glob` with `eager: true`): opening a post never waits for a
  download and needs no Suspense. The list frontmatter comes from `vite/blog-index.ts`. If the posts
  ever grow past ~100 kB gzip, revisit this (lazy chunks or a static-first framework like Astro).
- **`/blog` groups posts by year.** The newest year with posts is shown first under "current year";
  older years follow, newest first, as native `<details>` that start collapsed. It works without
  JavaScript and crawlers still see every link.
- **`progressiveChunkSize: Infinity`** in `app/entry-server.tsx` keeps lazy routes (`/heaven-sent`)
  from being prerendered as deferred chunks.
- **Madrid time.** Post filenames carry Madrid wall-clock time. `madridIso()` turns it into a real
  instant whatever the time zone of the build machine (Vercel builds in UTC) or the reader. It
  computes the offset twice so times right after a DST switch use the offset in force at that moment.
- **Vercel.** `vercel.json` has `cleanUrls` and no catch-all rewrite: `/about` serves `about.html`,
  unknown URLs get `404.html` with a real 404 status.
- **`app/heaven-sent/crypto.ts`** is shared by the browser and the Node CLI (type stripping), so it
  stays plain TypeScript with no imports. The word ignores case, accents and stray spaces because it
  is printed on paper. A wrong word returns `null`: AES-GCM fails instead of producing garbage.
- **`scripts/heaven-sent.ts`** reads the word from a hidden prompt (or `HEAVEN_SENT_WORD`), never from
  argv, so it never lands in shell history.
- **`vite.config.ts`** drops react-router's `"use client"` warning: it is meant for server components
  and means nothing here.

## Design

- Terminal aesthetic: monospace (self-hosted Agave), dark background, all copy lowercase, page labels
  as paths (`/blog`, `/about`), a blinking `_` cursor.
- Colours come from the tokens in `app/app.css` (`background`, `foreground`, `muted`, `primary`
  cyan…). TARDIS blue `#003b6f` is reserved for the hidden nav square, the last colour of the `/about` palette
  and the favicon.
- Images stay subtle: photos go through `DitheredImage`. The Capaldi silhouette appears only on
  `/about` and `/heaven-sent`.
- Bilingual text: English first, Spanish right under it in the `Es` MDX component (smaller, grey).
- One `<h1>` per page; every image has alt text (`aria-label` on canvases).

## Content and SEO

- Posts: `app/content/blog/YYYY-MM-DD_HH-MM-slug.mdx`, time in Madrid. Frontmatter `title`,
  `description`, `published`. English, all lowercase, line breaks as two trailing spaces, `---` after
  the frontmatter. Prettier ignores `app/content/` so those spaces survive.
- No personal names or anything private in posts; the repo is public.
- A new route needs an entry in `site.json` and `<Page meta={pageMeta('/route')}>`. Titles 30-60
  characters, descriptions 120-160. Private or unpublished pages get `noindex` and stay out of the
  sitemap and the feed.

## Sealed note (`/heaven-sent`)

- The plaintext lives only in `private/heaven-sent/note.mdx`, which git ignores. Never commit it and
  never move it under `app/content/`.
- Never ask for the word, never type it with a tool, never suggest one. The owner seals and checks.
- A changed note is resealed with the same word (cards may be printed) and ships alone in its own PR;
  after deploy, confirm the live bundle has the new `salt`.

## Workflow

- Work in a worktree: `git worktree add ../jofiel-site-worktrees/<name> -b <type>/<name> main`, then
  `npm ci` there. The main checkout stays on `main`.
- Conventional commits (`feat:`, `fix:`, `chore:`…), no AI attribution or `Co-Authored-By`.
- Git hooks (husky, installed by `npm ci` / `npm install` through `prepare`) enforce all of this:
  `pre-commit` runs `npm run check`, `commit-msg` runs commitlint (conventional commits, no
  `Co-Authored-By`), `pre-push` runs `npm run check` and `npm run build`. Never skip them with
  `--no-verify`; fix what they report. A fresh worktree needs `npm ci` before its first commit.
- Git over SSH only. Push the branch to `develop`, open a PR to `main`, merge with
  `gh pr merge <n> --merge --match-head-commit <sha>`.
- There is no CI and no preview deploy for `develop`: the checks above are the gate. After merging,
  wait for the Vercel status on the merge commit and check the live site (curl and a browser).
- New dependencies need a reason: prefer the platform or a few lines of code. Keep `npm audit` at 0;
  packages with install scripts must be approved with `npm install-scripts`.
