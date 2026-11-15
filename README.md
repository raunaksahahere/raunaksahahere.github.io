# Build your own portfolio like this one

This repository is a template for a personal developer portfolio with an illustrated, editorial look:
a cream paper background, a hand-drawn robot and desk scene, sticker-style cards, a featured-project
spread with real screenshots, a toolbox that shows where each tool was used, live GitHub activity,
a draggable pinboard, and a resume sticker that follows you down the page.

It is built with Next.js (App Router), TypeScript, Tailwind CSS 4, Motion and Lucide. Nearly all
of your content lives in three data files, so you can make it yours without touching the layout.

> You don't need to be a designer to use this. Replace the content, keep the system, and the
> result will still look intentional.

## 1. Set up

```bash
git clone https://github.com/<you>/<your-repo>.git my-portfolio   # or fork this repo
cd my-portfolio
npm install
npm run dev        # http://localhost:3000
```

Requirements: Node.js 20.9 or newer.

Check that it runs before you change anything. Then make the changes in the order below.

## 2. Change the identity (`src/data/site.ts`)

This file holds your name, contact details and links. Everything else reads from it.

| Field | What to put |
|---|---|
| `name`, `shortName` | Your full name and first name. Used in the nav, footer, metadata and structured data. |
| `title`, `description` | Your page title and one-sentence description, shown in search results and share previews. |
| `location` | Where you're based. |
| `email` | The address the contact buttons open. |
| `githubUser` | Your GitHub username. The activity section reads your public data from this account. |
| `socials` | GitHub and LinkedIn URLs. Remove an entry (and its icon in `hero.tsx`, `contact.tsx`, `footer.tsx`) if you don't use it. |
| `resume.href`, `resume.fileName` | Where your resume PDF lives and what the download is named (see step 5). |
| `url` | Set `NEXT_PUBLIC_SITE_URL` in production. Locally it falls back to `http://localhost:3000`. |

`navLinks` in the same file controls the section links in the top bar. They must match section `id`s
on the home page (`work`, `about`, `toolbox`, `activity`, `contact`).

## 3. Write your projects (`src/data/projects.ts`)

Each project is one object in the `projects` array. The site ships with examples so you can see the
shape of a good entry. Replace them with your own.

```ts
{
  slug: "my-app",                     // used in the URL: /projects/my-app
  name: "My App",
  category: "Developer tools",        // one of the Category union values; add your own to the type
  tagline: "One line, shown everywhere.",
  summary: "Two or three sentences about what it does.",
  problem: "The problem it solves, in plain language.",
  features: ["Concrete feature one", "Concrete feature two"],
  stack: ["TypeScript", "PostgreSQL"],
  repo: "https://github.com/you/my-app",
  live: "https://my-app.example.com",  // optional, only if it works
  status: "v1.0 · released",          // free text: what state it's in
  accent: "blue",                     // "blue" | "orange" | "lime"
  preview: { kind: "image", src: "/projects/my-app.webp", alt: "...", width: 1440, height: 900, frame: "browser" },
  howItWorks: ["Step one", "Step two"],          // optional, case-study page
  decisions: [{ title: "Why X", body: "..." }],  // optional, case-study page
  evidence: ["114 tests pass"],                  // optional, facts you can point to
}
```

Rules that keep the portfolio credible (and that this template follows):

- **Only write what the repository shows.** Take descriptions and features from your README and code.
  Don't add metrics, users or achievements you can't point to.
- **Only link live sites that work.** Check them before you publish.
- **Preview kinds:**
  - `image` with `frame: "browser"` for a web app screenshot.
  - `image` with `frame: "plain"` for a poster or a phone-sized image.
  - `terminal` with `lines` (each line has a `tone`: `cmd`, `pass`, `fail`, `warn`, `accent`, `muted`, `plain`)
    for CLI tools. Paste real output.
  - `mesh` draws a custom Bluetooth illustration specific to one project. Leave it out unless you
    want a similar custom diagram.

Then choose what appears on the home page:

- `featuredOrder` is the list of slugs shown in **Selected work**, in order. Keep it to 6–9 projects.
  The layout uses the first two as large spreads, the next three as terminal cards, the next two as
  a side-by-side pair, and anything after that as rows.
- Everything else in `projects` appears only on `/projects` (the all-projects index). Projects in
  `featuredOrder` also get a case-study page.

Screenshots go in `public/projects/`. Export them as WebP at 1440px wide (about 60–80% quality) to
keep the page fast. `ffmpeg -i shot.png -c:v libwebp -quality 80 shot.webp` does this.

## 4. Write your toolbox (`src/data/toolbox.ts`)

Group the technologies you actually use. Each group has an `id`, a `label`, a short `blurb` and a
list of `tools`. Each tool lists `usedIn`, the project names where it appears. That list is what
makes the toolbox credible: hovering a tool shows where you've used it.

Groups the site uses: Languages, Frontend, Backend, Databases, Infrastructure, AI / ML and Developer tools.
Delete or rename groups to fit your work.

The section heading and intro live in `src/app/page.tsx`.

## 5. Add your resume

1. Put the PDF in `public/resume/`, for example `public/resume/Your_Name_Resume.pdf`.
2. Update `resume.href` and `resume.fileName` in `src/data/site.ts`.

The navbar button, the mobile menu item and the floating resume sticker all read from that config.

## 6. Rewrite the copy in the sections

The layout is the design. The words are yours. These files contain personal copy to replace:

| File | What to change |
|---|---|
| `src/components/sections/hero.tsx` | The headline ("Hey, I'm …"), the tagline paragraph, the "open to" badge and the location line. |
| `src/components/sections/work.tsx` | The Selected work heading and the small side notes. |
| `src/components/sections/about.tsx` | Your story, the three facts cards (location, studying, languages you write in). |
| `src/components/sections/pinboard.tsx` | The draggable notes. Change the text, the colours and the number of notes to suit you. |
| `src/app/page.tsx` | Section headings for the toolbox and GitHub activity. |
| `src/components/sections/contact.tsx` | The contact headline and sub-line. |
| `src/app/opengraph-image.tsx` | The social-share image text and project chips. |
| `src/app/layout.tsx` | Structured data is built from `site.ts`, but check the keywords list in `metadata`. |

Keep the copy short and specific. Each section should answer one question: who you are, what you've
built, what you use, what you're doing now, and how to reach you.

## 7. Adjust the look (optional)

The palette and type are small on purpose.

- **Colours:** `src/app/globals.css`, in the `:root` block (`--cream`, `--paper`, `--ink`, `--blue`,
  `--orange`, `--lime`). The Tailwind names (`bg-blue`, `text-ink`, …) follow automatically.
- **Fonts:** `src/app/layout.tsx`. The site uses Bricolage Grotesque (display), Geist (body),
  Instrument Serif (italic accents) and JetBrains Mono (labels and code). Swap any of them with
  `next/font/google`.
- **Illustrations:** `src/components/illustrations/`. `hero-scene.tsx` is the desk scene and Bit the robot.
  `robot-mark.tsx` is the small logo mark, `sparkle.tsx` the four-point star. Replace them with your own
  SVGs, or keep the style and change the objects (a coffee mug becomes a keyboard, a plant becomes a
  cat, and so on). Keep the thick ink outline and the flat fills so they still match.
- **Textures:** the paper grain is `.grain` in `globals.css`. The dot grid is `.dot-grid`.

## 8. GitHub activity

`src/lib/github.ts` fetches your public profile, repositories and events from the GitHub API,
cached for an hour. It works without a token, but a token raises rate limits and shows the full
contribution calendar:

1. Create a fine-grained token at https://github.com/settings/tokens with no permissions.
2. Add it as `GITHUB_TOKEN` in `.env.local` (locally) or in your hosting dashboard.

If GitHub doesn't answer, the section says so rather than showing numbers. That behaviour is intentional.
Keep it.

## 9. Check before you publish

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start      # then look at it on a phone-sized window too
```

Then check:

- Every project's repository and live link opens.
- Every project on the home page has a preview image that loads.
- The resume downloads and has the right name.
- Your email, GitHub and LinkedIn buttons work.
- No placeholder text, lorem ipsum or sample names remain. Search for "Raunak", "Kolkata" and
  "CodeMeet" to make sure you've removed every example.
- Reduced-motion works: turn on "reduce motion" in your OS and reload.

## 10. Deploy

On Vercel: import the repository, leave the framework preset on Next.js, then set:

- `NEXT_PUBLIC_SITE_URL` to your domain (for sitemap, canonical URLs and share previews).
- `GITHUB_TOKEN` (optional).

Vercel builds it on every push. Add your domain under Project → Domains.

## Project structure

```
src/
  app/                 routes: home, /projects, /projects/[slug], sitemap, robots, OG image, 404
  components/
    sections/          hero, work, about, pinboard, toolbox, activity, contact
    project/           previews (screenshots, terminals), index list, shared bits
    illustrations/     hero desk scene, robot mark, sparkle
    ui/                reveal, magnetic buttons, section headings, icons
    nav.tsx, footer.tsx, cursor.tsx, resume-float.tsx, resume-link.tsx
  data/
    site.ts            identity, links, resume, nav
    projects.ts        your projects and which ones are featured
    toolbox.ts         your technologies
  lib/github.ts        cached GitHub data
public/
  projects/            screenshots (WebP)
  resume/              your resume PDF
```

## Making it fully yours: a checklist

- [ ] `site.ts`: name, title, description, email, GitHub user, socials, resume, URL
- [ ] `projects.ts`: your projects, `featuredOrder` set, every link checked
- [ ] Screenshots exported to `public/projects/`
- [ ] `toolbox.ts`: your technologies and where you used them
- [ ] Resume PDF in `public/resume/`
- [ ] Hero, Selected work, About, pinboard and contact copy rewritten
- [ ] Colours and fonts adjusted (or left as they are)
- [ ] Illustrations kept or replaced
- [ ] `lint`, `tsc` and `build` pass
- [ ] Deployed, domain set, `NEXT_PUBLIC_SITE_URL` set

## License

Use the code for your own portfolio. If you publish a version, please change the content, not just
the name.
