> **Developer setting this up for the first time?** Read **[SETUP.md](./SETUP.md)** —
> step-by-step instructions for GitHub → Netlify → Sveltia CMS → custom domain.
> The README below is the day-to-day reference once the site is live.

# Anuyu Coach — Astro + Sveltia CMS

A slow, deliberate coaching practice site. Built with [Astro](https://astro.build),
edited via [Sveltia CMS](https://github.com/sveltia/sveltia-cms), published as
static markdown.

```
src/
├── content/           ← all the editable content lives here as .md
│   ├── journal/       ← long-form posts
│   ├── letters/       ← testimonials
│   └── offerings/     ← session tiers + prices
├── components/        ← Astro components, one per section
├── layouts/           ← shared <head> + nav + footer
├── pages/             ← routes
│   ├── index.astro    ← homepage
│   └── journal/       ← /journal index + /journal/[slug] post pages
└── styles/global.css  ← the design system

public/
├── assets/            ← paper-bg, logo, image-slot, uploaded media
└── admin/             ← Sveltia CMS — visit /admin
```

---

## For developers

### Run locally

```bash
npm install
npm run dev
```

Site is now at <http://localhost:4321>.

### Build for production

```bash
npm run build
```

Output is in `dist/`. Serves as a fully static site — host on Netlify, Cloudflare
Pages, Vercel, GitHub Pages, or any static host.

### Connect the CMS to the repo

1. Edit `public/admin/config.yml` and set the `repo:` line to your GitHub repo
   (e.g. `anuyu/anuyu-coach`).
2. Set up auth — Sveltia uses **GitHub OAuth** (Git Gateway is NOT supported):
   - **Easiest — Netlify brokers the login**: register a GitHub OAuth App
     (callback `https://api.netlify.com/auth/done`), then add its Client ID/
     Secret in Netlify → Site config → Access & security → OAuth. Keep
     `backend: name: github` in `config.yml`. Editors log in with their
     GitHub account (must have repo write access).
   - **Alternative — self-hosted OAuth**: deploy
     [`sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth) as a
     Cloudflare Worker (~5 min) and point `base_url` in `config.yml` at it.
   - See **SETUP.md → Step 5** for the full walkthrough.
3. Push to the connected branch (`main` by default) — the CMS commits new
   content there.

### Run the CMS locally (no GitHub needed)

While developing, run the CMS against your local filesystem instead of GitHub:

```bash
# in one terminal
npm run cms     # starts decap-server (sveltia-compatible) on :8081

# in another terminal
npm run dev
```

Then open <http://localhost:4321/admin>. Changes save directly to your local
`src/content/` folder. Useful for previewing what the editor will see.

---

## For the editor — adding content

Visit `https://anuyu.co/admin` (or wherever the site is hosted). Log in with the
account the dev has set up. You'll see three collections in the left sidebar:

### Journal

The long-form blog. Click **New Journal Entry**, fill in title + date + body,
toggle **Draft** off when ready to publish, hit **Publish**. The site rebuilds
in ~30 seconds.

### Letters

Client testimonials. Updated 2–3 times a year. Each letter is a small entry with:

- **Order** — lower numbers appear first in the grid.
- **Name / Role / Offering / Season** — the byline.
- **Featured?** — if ON, this letter is the big centered quote at the top.
  Only one letter should ever be featured.
- **Letter (the quote)** — the testimonial body.

### Offerings

The session tiers. Title, price, summary, bullet points. Reordering is just
changing the **Order** field.

### Images

Drag-and-drop image upload is supported in the markdown editor. Images are
committed to `public/assets/uploads/` automatically.

---

## File-by-file reference

| File | Purpose |
|---|---|
| `astro.config.mjs` | Astro project config. |
| `src/content.config.ts` | Defines collection schemas (Zod). Edit this if you add new fields. |
| `src/layouts/BaseLayout.astro` | Wraps every page; loads fonts, nav, footer. |
| `src/components/Nav.astro` | The top navigation. |
| `src/components/Hero.astro` | Landing block; copy is in the file. |
| `src/components/Approach.astro` | The three principles. Static. |
| `src/components/Offerings.astro` | Reads `src/content/offerings/*.md`. |
| `src/components/Letters.astro` | Reads `src/content/letters/*.md`. |
| `src/components/Story.astro` | My Story narrative. Static. |
| `src/components/CTA.astro` | Bottom call-to-action. |
| `src/styles/global.css` | All the page styling. CSS custom properties at the top. |
| `public/admin/config.yml` | Sveltia CMS configuration. Edit collections / fields here. |

---

## Deploying to Netlify (recommended)

1. Push this repo to GitHub.
2. Create a new Netlify site from the repo.
3. Build command: `npm run build` · Publish directory: `dist`
4. Set up GitHub OAuth for the CMS: register a GitHub OAuth App (callback
   `https://api.netlify.com/auth/done`) and add its Client ID/Secret in
   Netlify → Site config → Access & security → OAuth. (See SETUP.md → Step 5.)
5. Add Anuyu as a collaborator on the GitHub repo so she can log in.
6. Done — she logs into `anuyu.online/admin` via **Sign in with GitHub**.

## Deploying to Cloudflare Pages

1. Push this repo to GitHub.
2. Connect the repo in the Cloudflare Pages dashboard.
3. Build command: `npm run build` · Output directory: `dist`
4. For auth, deploy the [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)
   worker (5 minutes) and point Sveltia at it.

---

## Future moves

- **Lift "My Story" into the CMS** — copy the pattern from Offerings:
  add a collection in `content.config.ts`, a folder in `src/content/story/`,
  a section in `config.yml`, and switch `Story.astro` to read from the collection.
- **Add a contact form** — easiest is to swap the `mailto:` in `CTA.astro` for
  a [Netlify Forms](https://docs.netlify.com/forms/setup/) form.
- **RSS feed for the journal** — add `@astrojs/rss` and a `src/pages/rss.xml.js`.
- **OG images per journal post** — Astro's experimental `astro:assets` can
  generate these at build time.

Be slow. Be deliberate. — the practice
