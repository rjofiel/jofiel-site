# jofiel's space

welcome to the source code of my site and blog.  
this is where i share my thoughts...  
my experiences...  
projects...  
and a bit about myself.

## 🚀 tech stack

this project is built using:

- **framework**: [react 19](https://react.dev/) + [vite](https://vitejs.dev/)
- **routing**: [react router](https://reactrouter.com/) (`react-router-dom` v7)
- **styling**: [tailwind css v4](https://tailwindcss.com/)
- **content**: markdown/mdx via `@mdx-js/rollup`. each post is its own chunk, loaded when opened.
- **font**: [agave nerd font](https://github.com/blobject/agave), self-hosted and trimmed in `public/fonts`
- **language**: typescript

## 📂 project structure

- `/app/pages`: main application routes.
- `/app/content/blog`: mdx files containing all the blog posts... written when i need to write.
- `/app/components`: building blocks.
- `/app/lib`: little helpers. `meta.ts` builds every page's `<head>` (title, description, canonical, preview card).
- `/app/content/site.json`: title and description of each page. a new page needs an entry here.
- `/vite`: build-time plugins. `blog-index` reads every post's frontmatter for the blog list; `seo` prerenders every route to static html (full content plus its own `<head>`, which the browser then hydrates), writes `404.html`, `sitemap.xml`, `feed.xml` and `robots.txt`.
- `app/entry-server.tsx`: renders a route to html at build time. `app/root.tsx` hydrates it in the browser. both use the same routes from `app/App.tsx`.
- anything that depends on the visitor's clock or randomness renders only after hydration (`useHydrated`), otherwise the prerendered html and the browser disagree.
- `public/og.png`: the preview image used when a link is shared.
- `create_post.sh`: a quick way to create new posts.

## 🛠️ getting started

you'll need [node.js](https://nodejs.org/) installed somewhere.

clone the repository, install everything:

```bash
npm install
```

start the server...

```bash
npm run dev
```

it will be available at `http://localhost:5173`.

to build for production, when you're ready:

```bash
npm run build
```

and if you want to preview what you built:

```bash
npm run preview
```

before committing, `npm run check` has to pass (format, lint, types, duplicates); git hooks run it on every commit, plus the build on every push. the rules behind it are in [`CLAUDE.md`](./CLAUDE.md).

## 📝 writing

posts are in mdx.  
stored in `/app/content/blog/<slug>.mdx`; the filename is the url (`/blog/<slug>`).  
the date lives only in the metadata, in madrid time, so changing it never breaks a link.  
they need this metadata structure:

```mdx
---
title: your title here
date: YYYY-MM-DD_HH-mm
description: a brief description...
published: true
---

your content here...
```

or you can just use `create_post.sh` if you prefer the script.

## 🔒 sealed notes

`/heaven-sent` shows a note that only opens with a word.  
the note is encrypted in the browser bundle, so the public repo never has the plaintext.

1. write the note in `private/heaven-sent/note.mdx` (gitignored, never commit it).
2. `npm run heaven-sent -- seal`, type the word twice. it writes `app/heaven-sent/sealed.json`.
3. `npm run heaven-sent -- check` to test the word you printed.

the word needs at least 8 characters. the ciphertext is public, so pick something rare, not a dictionary word.

case, accents and extra spaces don't matter.  
wrap a translation in `<Es>...</Es>` to show it right below, smaller and in grey.  
what the page says before and after each date lives in `app/heaven-sent/phases.ts`.  
in `npm run dev`, preview a phase with `/heaven-sent?phase=open`.

## 🔗 where to find me

if you really need to reach me...  
or see what i'm up to...

- [github](https://github.com/rjofiel)
- [twitter / x](https://x.com/rjofiel_)
- [linkedin](https://linkedin.com/in/rjofiel)

---

built with ❤️ by jofiel.  
or with whatever energy i have left today.
