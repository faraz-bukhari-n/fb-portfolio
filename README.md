# Faraz Bukhari — portfolio

Personal site for **Faraz Bukhari**, a full-stack developer and tech lead with a WebGIS background. Remote, Spain. Team lead at [Lua Group](https://luagroup.com/en/) since 2024; before that Ideamappers (2021–2024), and R&D at [Zameen.com](https://www.zameen.com/plotfinder/), where PlotFinder shipped to production.

Vue 3 + TypeScript + Vite. The home hero is a Three.js globe, Experience uses Mapbox, and copy lives in `src/content` — not in the views.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Hero, GitHub chart, career highlights, skills, contact |
| `/about` | Origin through Lua Group |
| `/experience` | Roles on a timeline, pinned on a map |
| `/highlights` | Career highlights |
| `/work` | Case studies (Lua campaign AI, PlotFinder, drone progress, Cesium listings) |
| `/writing` | Notes |
| `/resume` | Printable CV |




## Run it

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

```bash
npm run build     # typecheck + production build
npm run preview   # serve dist/
```



## Tokens

Copy `.env.example` to `.env.local`:

```
VITE_MAPBOX_TOKEN=
```

Without a Mapbox token, the Experience map stays blank. `.env.local` is gitignored.

## Content

Edit these files instead of hunting through Vue templates:

- `src/content/identity.ts` — name, role, summary, email, socials
- `src/content/education.ts` — NUST
- `src/content/experience.ts` — Lua Group, Ideamappers, Zameen
- `src/content/highlights.ts` — career highlights on home and `/highlights`
- `src/content/projects.ts` — case studies
- `src/content/skills.ts` — homepage skills globe and inspect copy
- `src/content/about.ts` — About chapters
- `src/content/writing.ts` — articles



## Stack

Vue 3, Vue Router, Vite, TypeScript, Three.js, Mapbox GL, D3, GSAP, Lenis.

## Deploy (GitHub Pages)

`dist/` is gitignored, so this **cannot work**:

```bash
git subtree push --prefix dist origin gh-pages
# fatal: no new revisions were found
```

Subtree only pushes files that exist **in git commits**. The build output is never committed.

This repo already deploys with GitHub Actions (`.github/workflows/deploy.yml`) on push to `main`.

1. Repo **Settings → Pages → Source: GitHub Actions**
2. **Settings → Secrets and variables → Actions** — add `VITE_MAPBOX_TOKEN` (a public `pk.` token)
3. Commit your latest work and `git push origin main`

Site: [https://faraz-bukhari-n.github.io/fb-portfolio/](https://faraz-bukhari-n.github.io/fb-portfolio/)

A local `npm run deploy` (force-push `gh-pages`) will bake the Mapbox token into JS. GitHub push protection may reject that — that’s expected. Prefer Actions.