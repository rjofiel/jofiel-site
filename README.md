# jofiel's space

welcome to the source code of my site and blog.  
this is where i share my thoughts...  
my experiences...  
projects...  
and a bit about myself.

## 🚀 tech stack

this project is built using:

- **framework**: [react 19](https://react.dev/) + [vite](https://vitejs.dev/)
- **routing**: [react router](https://reactrouter.com/) (v7)
- **styling**: [tailwind css v4](https://tailwindcss.com/)
- **components**: [radix ui](https://www.radix-ui.com/)
- **content**: markdown/mdx via `@mdx-js/rollup`
- **data**: [tanstack query](https://tanstack.com/query/latest)
- **forms**: [react hook form](https://react-hook-form.com/) + [zod](https://zod.dev/)
- **language**: typescript

## 📂 project structure

- `/app/pages`: main application routes.
- `/app/content/blog`: mdx files containing all the blog posts... written when i need to write.
- `/app/components`: building blocks.
- `/app/lib` & `/app/utils`: little helpers.
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

## 📝 writing...

posts are in mdx.  
stored in `/app/content/blog`.  
they need this metadata structure:

```mdx
{/\* ---

title: your title here

date: YYYY-MM-DD_HH-mm

description: a brief description...

published: true

--- \*/}

---

your content here...
```

or you can just use `create_post.sh` if you prefer the script.

## 🔗 where to find me

if you really need to reach me...  
or see what i'm up to...

- [github](https://github.com/rjofiel)
- [twitter / x](https://x.com/rjofiel)
- [linkedin](https://linkedin.com/in/rjofiel)

---

built with ❤️ by jofiel.  
or with whatever energy i have left today.
