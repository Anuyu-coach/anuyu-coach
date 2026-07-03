# Anuyu Coach — Developer Setup Guide

Hello! This is the Anuyu Coach website. It's an **Astro** static site with a
**Sveltia CMS** (Decap-compatible) admin panel so the site owner can publish
blog posts ("Journal") and update testimonials & offerings without touching
code.

Your job: get this repo on GitHub, deploy to Netlify, wire up the CMS, point
the domain. **Estimated time: 60–90 minutes** for someone comfortable with Git
and DNS.

---

## What you're working with

```
astro-project/
├── src/
│   ├── content/          ← all editable content as markdown
│   │   ├── journal/      ← blog posts
│   │   ├── letters/      ← client testimonials
│   │   └── offerings/    ← services + prices
│   ├── components/       ← Astro components
│   ├── layouts/          ← shared shell
│   ├── pages/            ← routes (index, story, offerings, check-in, journal/[slug])
│   └── styles/global.css ← design system
└── public/
    ├── assets/           ← images, logo, paper texture
    └── admin/            ← Sveltia CMS — lives at /admin
```

**Tech:**
- Astro 5 (static output)
- Sveltia CMS via the standard Decap-compatible script
- Markdown content with Zod-validated schemas (`src/content.config.ts`)
- No JavaScript framework on the front-end — vanilla Astro components

---

## Prerequisites

- Node.js 20+ (`node --version`)
- A GitHub account
- A Netlify account (free tier is fine — sign in with GitHub for the smoothest setup)
- Access to the domain registrar (GoDaddy in this case) for DNS changes
- The email address of the person who will edit content (so we can invite them)

---

## Step 1 — Run it locally first

Always sanity-check before deploying.

```bash
cd astro-project
npm install
npm run dev
```

Open <http://localhost:4321>. You should see the Anuyu homepage. Click around —
`/story`, `/offerings`, `/check-in`, `/journal`. Everything should render.

To preview the CMS locally (changes go to local files, no GitHub yet):

```bash
# terminal 1
npm run cms      # starts the local CMS backend on :8081
# terminal 2
npm run dev
```

Visit <http://localhost:4321/admin> — you can edit content; saves write directly
to `src/content/*.md`. Useful for confirming the admin works before going live.

---

## Step 2 — Push to GitHub

Create a new repo on GitHub (the owner will tell you what to name it; the
default in this guide is `anuyu-coach`). **Make it public** — this matters
because the free Sveltia/Decap CMS auth uses Git Gateway, which is simpler with
public repos. (Private is possible but requires extra setup.)

Do **not** initialize the GitHub repo with a README or .gitignore — it's
already in this folder.

Then from the `astro-project/` directory:

```bash
git init
git add .
git commit -m "Initial Anuyu Coach site"
git branch -M main
git remote add origin https://github.com/OWNER/REPO.git
git push -u origin main
```

---

## Step 3 — Update `public/admin/config.yml`

Open `public/admin/config.yml` and change the `repo:` line to match the
GitHub repo you just pushed to:

```yaml
backend:
  name: git-gateway      # ← change from "github" to "git-gateway" for Netlify Identity flow
  branch: main
```

> **Why `git-gateway` not `github`?** Git Gateway proxies all CMS commits
> through Netlify Identity, so editors don't need their own GitHub accounts —
> they log in with email + password instead. This is what the site owner wants.
> If for any reason you'd rather have GitHub-account-based auth, leave it as
> `github` and follow the [Sveltia GitHub OAuth docs](https://github.com/sveltia/sveltia-cms).

Commit and push:

```bash
git add public/admin/config.yml
git commit -m "Configure CMS backend"
git push
```

---

## Step 4 — Deploy to Netlify

1. <https://app.netlify.com> → **Add new site** → **Import an existing project**
2. Connect GitHub → pick the repo
3. Confirm build settings (Netlify auto-detects Astro):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy site**. First build takes ~90 seconds.
5. Once live, **Site configuration → Change site name** → set to something
   readable (e.g. `anuyu`). Site is now at `anuyu.netlify.app`.
6. Visit it. Confirm everything renders. The `/admin` route should load the
   Sveltia UI (login won't work yet — that's the next step).

---

## Step 5 — Enable Netlify Identity + Git Gateway

This is what lets the site owner log into the CMS.

1. In the Netlify site dashboard → **Integrations** (older UI: **Identity**) →
   find **Identity** → **Enable Identity**.
2. **Identity → Registration preferences** → set to **Invite only**. (Critical
   — otherwise anyone on the internet can sign up as an editor.)
3. **Identity → Services → Git Gateway** → **Enable Git Gateway**. Netlify
   will create a deploy key on the GitHub repo automatically.
4. **Identity → Invite users** → enter the site owner's email address. They'll
   get a "You've been invited" email — they click the link, set a password,
   they're in.
5. Tell the owner: visit `anuyu.netlify.app/admin` (or the custom domain once
   set up), log in with the email/password they just made, write a Journal
   entry as a test, hit Publish. Within ~60 seconds the site rebuilds with
   the new post.

---

## Step 6 — Connect the custom domain (anuyu.online via GoDaddy)

### In Netlify

1. **Domain management → Add a domain** → enter `anuyu.online`
2. Netlify asks if you own it — yes → it adds both `anuyu.online` and
   `www.anuyu.online`
3. Netlify shows you two records to add at your registrar:
   - **A record** for `@` (apex) → an IP like `75.2.60.5`
   - **CNAME** for `www` → your `anuyu.netlify.app` address
4. **Keep this tab open.** Copy the values.
5. Choose: **"I'll add DNS records at my registrar"** (NOT "use Netlify DNS" —
   keeping DNS at GoDaddy avoids any risk to existing email records).

### In GoDaddy

1. Log in → **My Products** → find `anuyu.online` → **DNS** (or "Manage DNS")
2. **DO NOT TOUCH** any of these existing records:
   - `MX` records (these route email)
   - `TXT` records (often SPF/DKIM for email)
3. **Edit** the existing `A` record where Name = `@`:
   - Change the value from GoDaddy's parking IP → the Netlify IP from step 3
   - TTL: 1 hour (default)
4. **Edit** the existing `CNAME` record where Name = `www`:
   - Change the value → `anuyu.netlify.app` (or whatever Netlify gave you)
   - TTL: 1 hour
5. Save.

> **GoDaddy quirk:** they often auto-create "Parked" or "Forwarding" records.
> If you see one pointing `@` somewhere weird, that's why your A-record edit
> may not seem to take. Disable any domain forwarding in GoDaddy's domain
> settings, then re-check DNS.

### Back in Netlify

1. Wait 10–30 minutes. Refresh **Domain management** — you should see green
   checkmarks next to both domains.
2. SSL certificate provisioning happens automatically (Let's Encrypt). Takes
   up to an hour. Once "Certificate" shows ✅, toggle **Force HTTPS** on.
3. Decide which is canonical — typically the apex (`anuyu.online`) — and set
   the other as a redirect. Netlify has a one-click toggle for this in the
   domain panel.

---

## Step 7 — Hand off to the editor

Send the site owner a short note:

> Hi — the site is live at **anuyu.online**.
> To write a new blog post, visit **anuyu.online/admin** and log in with
> the email/password you set up. Click **Journal → New Journal Entry**, fill
> in the title, date, body, and hit **Publish**. The site will update
> automatically within a minute.
> Same flow for **Letters** (testimonials) and **Offerings** (services).

The full editor-side guide is in `README.md` under "For the editor".

---

## What happens when the editor publishes

```
Editor clicks Publish
        ↓
Sveltia CMS commits the .md file to GitHub via Git Gateway
        ↓
GitHub webhook fires
        ↓
Netlify builds the site (~30–60s)
        ↓
New version is live
```

Build minutes on Netlify's free tier: 300/month. Each rebuild is ~1 min, so
the owner can publish 300 posts/month before hitting limits. Fine for any
realistic coaching practice.

---

## Common things you might want to do later

### Adding a new collection (e.g. "Retreats")

1. Add the schema in `src/content.config.ts`
2. Create the folder `src/content/retreats/`
3. Add a `- name: "retreats"` block in `public/admin/config.yml` (copy the
   shape of the `offerings` collection)
4. Create the Astro component that reads it (copy `Offerings.astro`)

### Adding a contact form

Easiest path: convert `<form>` in `Check-in.astro` to a Netlify Form by adding
`data-netlify="true"` and a hidden `form-name` input. Submissions show up in
Netlify's dashboard. [Docs](https://docs.netlify.com/forms/setup/).

### Email from the site

You don't need any DNS changes for *outbound* email from contact forms —
Netlify handles that. The MX records you preserved are only for *inbound*
mail to addresses like `hello@anuyu.online`.

---

## Troubleshooting

**"Site shows GoDaddy parking page after DNS update"**
→ GoDaddy domain forwarding is still on. In GoDaddy → domain settings →
disable forwarding. Then wait 10 min.

**"Admin page loads but login fails with 'No identity instance found'"**
→ Identity widget isn't loading. Confirm Identity is enabled in Netlify and
that `index.html` includes the Netlify Identity widget. (The current setup
loads it via `public/admin/index.html` — it should "just work".)

**"CMS shows 'Failed to load entries' after login"**
→ Git Gateway isn't enabled, OR the `repo:` field in `config.yml` doesn't
match the actual repo, OR the user logged in with an email that hasn't been
invited.

**"Build fails on Netlify with 'Cannot find module'"**
→ Make sure `package-lock.json` was committed. If not: `npm install` locally,
commit the lockfile, push.

**"Editor's image upload doesn't show on the live site"**
→ Confirm `media_folder: "public/assets/uploads"` in `config.yml` — uploaded
images get committed there and referenced from `/assets/uploads/...`.

---

## Hand-off checklist

Before you tell the owner it's done, verify:

- [ ] `anuyu.online` loads the site over HTTPS
- [ ] `www.anuyu.online` redirects to `anuyu.online` (or vice versa)
- [ ] All nav links work (Story, Offerings, Journal, Check-in)
- [ ] `/admin` loads the Sveltia UI
- [ ] You've sent the owner their Identity invite and confirmed they can log in
- [ ] You've published a test journal entry as the owner (then deleted it) to
      confirm the publish → rebuild flow works end-to-end
- [ ] Email to `hello@anuyu.online` (or whatever address exists) still works —
      send a test from a personal account
- [ ] Force HTTPS is on
- [ ] Registration is set to **Invite only** in Identity settings

---

## Questions

Original project: built in Anthropic's design tool, exported as a static
Astro site. The structure is intentionally simple — every page is one Astro
component, every section of the homepage is one component, all content is
markdown. No build tricks, no framework dependencies beyond Astro itself.

If anything is unclear or you hit a wall, the original designer is happy to
clarify intent.
