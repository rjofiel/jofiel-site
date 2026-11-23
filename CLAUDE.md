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
| `npm run photos`                            | Builds the post photos from `private/photos` into `public/images/blog` (needs ImageMagick 7)                     |

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

| Need                                            | Use                                                                                            |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| A page with layout, `<head>` and content column | `Page` and `PageTitle` (`app/components/Page.tsx`)                                             |
| Title, description, preview tags of a route     | `app/content/site.json`, read through `pageMeta()` / `postMeta()` (`app/lib/meta.ts`)          |
| `<head>` tags, build and client                 | `headTags()` + `renderHead()`; the client swaps them with `usePageMeta()`                      |
| Posts, list and bodies                          | `getAllPosts`, `getPost`, `postBody`, `postsByYear`, `formatPostDate` (`app/lib/posts.ts`)     |
| Dates and times                                 | `SITE_TIME_ZONE`, `madridIso()` (`app/lib/time.ts`)                                            |
| Anything depending on the clock or randomness   | render it only when `useHydrated()` is true                                                    |
| Heavy third-party embeds (the pulse widget)     | render them only when `useAfterPageLoad()` is true (`app/lib/useAfterPageLoad.ts`)             |
| MDX typography (posts and the sealed note)      | `mdxComponents` (`app/components/mdxComponents.tsx`)                                           |
| Diagrams in posts (steps joined by arrows)      | `<Flow label>` with `<Step name note stage='past'\|'now'\|'next'>` (`app/components/Flow.tsx`) |
| Body text style                                 | `.body-copy` class (`app/app.css`)                                                             |
| External links                                  | `ExternalLink`                                                                                 |
| Photos in the terminal look                     | `DitheredImage` (algorithm in `app/lib/dither.ts`)                                             |
| Photos in posts                                 | `<Photo src='<slug>/<name>' alt>` in MDX; a dithered cover with `cover`/`coverAlt` frontmatter |
| Photo URLs, widths and formats                  | `app/lib/photoPaths.ts` (shared by the app and `scripts/photos.ts`)                            |

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
- **`/blog` groups posts by year, newest first.** The newest year with posts is shown first under
  "current year"; older years follow as native `<details>` that start collapsed. Inside every year
  the newest post comes first. It works without JavaScript and crawlers still see every link.
  The list shows each post's day and month (`dd/mm`) and time, since the year is already the
  group; the post page shows the full `dd/mm/yy, hh:mm` because it has no year around it.
- **`progressiveChunkSize: Infinity`** in `app/entry-server.tsx` keeps lazy routes (`/heaven-sent`)
  from being prerendered as deferred chunks.
- **Madrid time.** The `date` (`YYYY-MM-DD`) and `time` (`HH:MM`) frontmatter of a post are Madrid
  wall-clock time. The `yaml` package parses YAML 1.2, so both stay strings; a YAML 1.1 parser
  would read the date as a UTC `Date` and `00:45` as the number 45. `madridIso()` turns them into a
  real instant whatever the time zone of the build machine (Vercel
  builds in UTC) or the reader. It computes the offset twice so times right after a DST switch use
  the offset in force at that moment. The ISO string keeps the wall-clock digits, so the dates on
  screen are read straight from it with no time zone maths.
- **Post URLs carry no date.** `/blog/<slug>` comes from the filename and the date only from the
  frontmatter, so changing a date never breaks a shared link. The old dated URLs
  (`/blog/YYYY-MM-DD_HH-MM-<slug>`) are sent to the new ones by one pattern redirect in
  `vercel.json`. Its `:slug([^/]+)` keeps an explicit pattern on purpose: a bare `:slug` after a `-`
  stops matching hyphens under the newer path-to-regexp that Vercel is migrating to.
- **Post photos.** The originals stay in gitignored `private/photos`, so the picks never reach the repo
  and only the owner (who has them) runs `npm run photos`; Vercel just serves the committed output.
  The script calls ImageMagick 7 through a fixed list of absolute paths, never through `PATH`
  (`sonarjs/no-os-command-from-path`), and `-auto-orient` runs before `-strip`: stripping first drops
  the EXIF orientation and phone photos come out sideways. Every photo ships as AVIF and WebP at
  480/960/1440 px (or its own width when smaller) in a `<picture>` with `srcset`; the manifest
  `app/content/photos.json` gives the size so the box is reserved before the image loads. The
  cover's `og:image` is a 1200x630 PNG dithered at build time, because link previews do not run
  JavaScript and not every app shows AVIF or WebP. `scripts/image-metadata.ts` runs in `lint` and
  fails if any JPEG, PNG, WebP or AVIF under `public/` carries EXIF, XMP, IPTC or text chunks:
  phone photos carry GPS, and the repo is public.
- **Vercel.** `vercel.json` has `cleanUrls` and no catch-all rewrite: `/about` serves `about.html`,
  unknown URLs get `404.html` with a real 404 status.
- **`public/.well-known/security.txt`** (RFC 9116) uses the contact email already shown on the
  home page. Its `Expires` date must stay in the future: renew it every year, before it lapses.
- **`app/heaven-sent/crypto.ts`** is shared by the browser and the Node CLI (type stripping), so it
  stays plain TypeScript with no imports. Only the word's letters and digits count: case, accents,
  spaces, hyphens, line breaks and punctuation are dropped before deriving the key, because it is
  printed on paper (split across lines however it looks best) and phones capitalise the first letter.
  Changing this normalisation changes every derived key, so it always ships with a reseal.
  A wrong word returns `null`: AES-GCM fails instead of producing garbage.
- **`scripts/heaven-sent.ts`** reads the words from a hidden prompt (or `HEAVEN_SENT_WORD` and
  `HEAVEN_SENT_OWNER_WORD`), never from argv, so they never land in shell history.
- **`app/heaven-sent/sealed.json` holds the note sealed twice**: `guests` with the letters word,
  `owner` with the owner's own word. `readNote()` (`app/heaven-sent/gate.ts`) says which one opened.
  The letters word is held back until the `open` phase; this is a courtesy gate in the browser, not
  security, because the ciphertext is public and the word alone decrypts it. The owner word ignores
  the date so he can always read and check the note.
- **`vite.config.ts`** drops react-router's `"use client"` warning: it is meant for server components
  and means nothing here.
- **The nav wraps on phones** instead of hiding behind a menu button. The links need about 366 px, so
  below 420 px of viewport the date moves to its own line above them, right-aligned; from 420 px it
  sits at the end of the same line. Each link has an invisible 44 px tall touch area (`after:`), so
  tapping is easy without changing how it looks.

## Design

- Terminal aesthetic: monospace (self-hosted Agave), dark background, all copy lowercase, page labels
  as paths (`/blog`, `/about`), a blinking `_` cursor.
- Colours come from the tokens in `app/app.css` (`background`, `foreground`, `muted`, `primary`
  cyan…). TARDIS blue `#003b6f` is reserved for the hidden nav square, the last colour of the `/about` palette
  and the favicon.
- Images stay subtle: decorative photos go through `DitheredImage`. The Capaldi silhouette appears only on
  `/about` and `/heaven-sent`. Post photos stay small (at most 272x192 px, `PHOTO_BOX` in `app/lib/photos.ts`) so
  they accompany the text instead of leading it, and link to the full-size file; they start grey and take their colour while they cross the
  middle of the screen (hover on browsers without scroll-driven animations); at most one dithered
  cover and two body photos per post. Dithering reads contrast, not subject: covers need a clear
  split of light and dark (silhouettes, something bright on a dark ground), because leaves, grass
  and sky turn to noise.
- Bilingual text: English first, Spanish right under it in the `Es` MDX component (smaller, grey).
- One `<h1>` per page; every image has alt text (`aria-label` on canvases).

## Content and SEO

- Posts: `app/content/blog/<slug>.mdx`. Frontmatter `title`, `date` (`YYYY-MM-DD`), `time`
  (`HH:MM`, Madrid), `description`, `published`. English, all lowercase, line breaks as two
  trailing spaces, `---` after the frontmatter. Prettier ignores `app/content/` so those spaces
  survive.
- The filename is the URL; the date only orders and labels the post. Change a date by editing
  `date:` and `time:`, never the filename. Renaming a published post's slug needs its own
  permanent redirect in `vercel.json`, so shared links do not break.
- No personal names or anything private in posts; the repo is public.
- Photos: drop the originals (any of jpg, heic, png, webp) in `private/photos/<slug>/<name>.<ext>`,
  reference them with `<Photo src='<slug>/<name>' alt='...' />` or `cover: <name>` + `coverAlt:` in
  the frontmatter, run `npm run photos` and commit what it writes in `public/images/blog` and
  `app/content/photos.json`. Only referenced photos are built; outputs nobody references are
  deleted. To frame a photo, add its key to `app/content/photo-crops.json` with `x`, `y`, `width`
  and `height` as fractions of the upright original; editing that file rebuilds every photo. To rebuild a photo, delete its outputs: an output newer than its original is skipped.
- A new route needs an entry in `site.json` and `<Page meta={pageMeta('/route')}>`. Titles 30-60
  characters, descriptions 120-160. Private or unpublished pages get `noindex` and stay out of the
  sitemap and the feed.

## Sealed note (`/heaven-sent`)

- The plaintext lives only in `private/heaven-sent/note.mdx`, which git ignores. Never commit it and
  never move it under `app/content/`.
- Never ask for either word, never type one with a tool, never suggest one. The owner seals and checks.
- A changed note is resealed with the same two words (cards may be printed) and ships alone in its own
  PR; after deploy, confirm the live bundle has the new `salt`.
- Phase dates in `app/heaven-sent/phases.ts` are Madrid wall-clock times through `madridIso()`.

## Workflow

- Work in a worktree: `git worktree add ../jofiel-site-worktrees/<name> -b <type>/<name> main`, then
  `npm ci` there. The main checkout stays on `main`.
- Conventional commits (`feat:`, `fix:`, `chore:`…), no AI attribution or `Co-Authored-By`.
- Git hooks (husky, installed by `npm ci` / `npm install` through `prepare`) enforce all of this:
  `pre-commit` runs `npm run check`, `commit-msg` runs commitlint (conventional commits, no
  `Co-Authored-By`), `pre-push` runs `npm run check` and `npm run build`. Never skip them with
  `--no-verify`; fix what they report. A fresh worktree needs `npm ci` before its first commit.
- Git over SSH only. `main` is the only branch on the remote and deploys to production; there is no
  `develop` and no git flow. Push the feature branch under its own name, open a PR to `main`, merge
  with `gh pr merge <n> --merge --match-head-commit <sha>`.
- There is no CI and no preview deploy: the checks above are the gate. After merging,
  wait for the Vercel status on the merge commit and check the live site (curl and a browser).
- New dependencies need a reason: prefer the platform or a few lines of code. Keep `npm audit` at 0;
  packages with install scripts must be approved with `npm install-scripts`.
