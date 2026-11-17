# Build your own portfolio like this one

This repository is a template for a personal developer portfolio with an illustrated, editorial look:
a cream paper background, a hand-drawn robot and desk scene, sticker-style cards, a featured-project
spread with real screenshots, a toolbox that shows where each tool was used, live GitHub activity,
a draggable pinboard, and a resume sticker that follows you down the page.

It is built with Next.js (App Router, static export), TypeScript, Tailwind CSS 4, Motion and Lucide.
Nearly all of your content lives in three data files, so you can make it yours without touching the layout.
It deploys to GitHub Pages as a fully static site.

> You don't need to be a designer to use this. Replace the content, keep the system, and the
> result will still look intentional.

## 1. Set up

```bash
git clone https://github.com/<you>/<your-repo>.git my-portfolio   # or fork this repo
cd my-portfolio
npm install
npm run dev        # http://localhost:3000
```

Requirements: Node.js 20.9 or newer (the deploy workflow uses Node 22).

Check that it runs before you change anything. Then make the changes in the order below.

If you want the site at `https://<you>.github.io`, name the repository `<you>.github.io`. That is a
user site, so no `basePath` is needed. Any other name makes a project site at
`https://<you>.github.io/<repo>`, and you would then need to add `basePath` to `next.config.ts`.

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
| `url` | Your public address. The deploy workflow sets `NEXT_PUBLIC_SITE_URL` to it (see step 10). Locally it falls back to `http://localhost:3000`. |

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

The activity section fetches public GitHub data **in the visitor's browser** when the page opens,
then every five minutes while the tab is visible. Returning to the tab or reconnecting also checks
for updates if the next refresh is due. No site rebuild is needed for new public activity.

`src/lib/github-public.ts` reads repositories directly for **Last pushed** and public events for the
feed and 28-day chart. GitHub's events API can lag by 30 seconds to six hours; private work does not
appear. Repository push times can update before those events arrive. Dates use India time, while
the daily chart uses UTC days.

`src/lib/github.ts` also saves a build-time snapshot for the initial render. If a live request fails,
the section keeps the previous data, displays its timestamp and retries automatically. It honours
GitHub's polling interval and rate-limit retry headers. Browser requests are unauthenticated and
subject to GitHub's public API limits (normally 60 requests per hour per visitor IP).

It works without a token. An optional **build-only** token raises the build's API rate limit and
enables the full-year contribution calendar, labelled with its snapshot date. This token is never
sent to the browser and does not change the browser's public API limits:

1. Create a fine-grained token at https://github.com/settings/tokens with no permissions.
2. In your repository, go to **Settings → Secrets and variables → Actions** and add it as a secret
   named `PORTFOLIO_GITHUB_TOKEN`. Don't name it `GITHUB_TOKEN`, because GitHub reserves that name.
3. In `.github/workflows/pages.yml`, add this line under the **Build static site** step's `run`:
   `env: { GITHUB_TOKEN: ${{ secrets.PORTFOLIO_GITHUB_TOKEN }} }`.
   For local builds, put `GITHUB_TOKEN=...` in `.env.local`.

If GitHub doesn't answer during the build, the browser still tries to load live data. If neither
request succeeds, the section links to the real GitHub profile rather than showing invented numbers.

## 9. Check before you publish

```bash
npm run lint
npx tsc --noEmit
npm run build      # writes a static site to out/
npx serve out      # any static file server works; then open the printed URL
```

Then check:

- Every project's repository and live link opens.
- Every project on the home page has a preview image that loads.
- The resume downloads and has the right name.
- Your email, GitHub and LinkedIn buttons work.
- No placeholder text, lorem ipsum or sample names remain. Search for "Raunak", "Kolkata" and
  "CodeMeet" to make sure you've removed every example.
- Reduced-motion works: turn on "reduce motion" in your OS and reload.

## 10. Deploy to GitHub Pages

The repository includes `.github/workflows/pages.yml`, which builds the site and publishes `out/`.

1. Push the repository to GitHub.
2. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow from the Actions tab). The first deploy takes a minute or two.
4. Open `https://<you>.github.io/`.

The workflow runs on every push to `main`, on manual trigger, and hourly at minute 17 to refresh
Medium and GitHub fallback snapshots. Live browser refreshes update both sections independently of that schedule.

### Medium blog section

The home page's `#blog` section shows the recent stories available in the RSS feed from
`https://medium.com/@raunaksaha22`, linking to the original articles on Medium.
With two or more stories, a wide rectangular card is centred at full opacity, with
complete, smaller dimmed cards at either side, all fitted within the screen. On narrow
screens, the complete side cards sit below the main card to keep its text readable.
The carousel moves continuously right to left (one card every eight seconds),
with no hold between posts, and loops seamlessly.
Hovering anywhere over the carousel or focusing it with the keyboard pauses automatic motion.
Mouse clicks on navigation arrows do not leave autoplay paused: it resumes when the
pointer leaves the carousel. Keyboard focus continues to pause it until focus moves away.
Previous/next arrows move one card in either direction; a pause/play control is available
for touch users. Reduced-motion preferences disable automatic scrolling. A single story
uses the featured layout with disabled navigation arrows. RSS contains recent stories,
not necessarily a complete archive of every post. Titles, dates, excerpts,
topics and cover images come from the actual RSS feed, not manually maintained cards.

`npm run build` first runs `scripts/sync-medium.py` (Python 3, standard library only).
It fetches `https://medium.com/feed/@raunaksaha22` and writes `public/medium-posts.json`.
The site renders that snapshot into static HTML, so stories also appear without JavaScript.
On **every page opening**, the browser requests the current profile feed through
`https://api.rss2json.com/v1/api.json?rss_url=…`. Medium's RSS response does not provide
the browser access needed by this static GitHub Pages site, so the converter supplies
a CORS-compatible JSON response. The browser checks again every five minutes while
visible, on return to the tab if a refresh is due, and on restoration from the browser's
back/forward cache. New posts do not need a site rebuild or Git commit.

This uses rss2json's public, keyless API and depends on its availability, caching and
rate limits. Requests carry only the public RSS URL, with credentials omitted.
The tested endpoint advertises a 900-second cache lifetime; Medium can also cache RSS.
A new page opening always requests the feed, but newly published posts may still take
time to appear upstream. Free API responses default to ten entries; RSS is a recent
feed, not a complete historical archive. A cached response older than the latest
already-rendered story does not replace it.

If Medium fails to respond, the sync script preserves the previous snapshot and logs
a warning. Actions caches successful snapshots between builds; the checked-in snapshot
is the fallback when no cache exists. If the live converter request fails or times out,
the browser tries the same-origin `medium-posts.json` and otherwise retains the rendered
cards. The hourly workflow keeps that no-JavaScript/offline fallback current; GitHub
Actions schedules can be delayed or disabled after repository inactivity.
Cover-image failures show a simple reading illustration.
No story HTML is embedded, and preview links and image URLs are restricted to HTTPS Medium domains.

For local development, run `npm run dev`; the browser fetches the live feed on opening
the page, just as it does in production. `npm run sync:medium` refreshes the saved fallback
on demand. No polling process or API key is required on the development machine.
To test a saved feed without network access:
`python3 scripts/sync-medium.py --input /path/to/feed.xml`.

**Your public URL:** the workflow sets `NEXT_PUBLIC_SITE_URL: https://<you>.github.io`. Change it there
if you use a different address. It's used for the sitemap, canonical links and share previews.

**Custom domain (optional):** add it under **Settings → Pages → Custom domain** and set your DNS
records as GitHub describes. Then change `NEXT_PUBLIC_SITE_URL` in the workflow to the domain.

**What static export means for you:**

- The site has no server. Everything is built into `out/` ahead of time.
- Project case-study pages are generated only for slugs in `featuredOrder`. To feature a new project,
  add its slug there and push. A rebuild is required for any content change.
- Images are not optimised by Next.js (GitHub Pages can't run the optimiser), so export your screenshots
  at the size you want shown (step 3).
- Anything that needs a server at request time (forms that store data, personalised pages) won't work.
  Use an external form service or a `mailto:` link instead.

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
  lib/github.ts        build-time fallback and optional authenticated calendar
  lib/github-public.ts public GitHub fetching shared by the build and browser
public/
  projects/            screenshots (WebP)
  resume/              your resume PDF
.github/workflows/
  pages.yml            build and deploy to GitHub Pages
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
- [ ] `lint`, `tsc` and `npm run build` pass
- [ ] `NEXT_PUBLIC_SITE_URL` in `pages.yml` set to your address
- [ ] Settings → Pages → Source set to GitHub Actions
- [ ] Optional: `PORTFOLIO_GITHUB_TOKEN` secret added and mapped in the workflow

## License

Use the code for your own portfolio. If you publish a version, please change the content, not just
the name.
