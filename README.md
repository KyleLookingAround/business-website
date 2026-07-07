# Viaduct Studios — website

The site for **Viaduct Studios**: fast, handmade websites for small businesses
around Manchester and Stockport, that their owners can update themselves. Front
of house for the studio — home, work (case studies), services, about, contact.

It's a **static site** built with [Astro](https://astro.build): the build turns
plain-text content files into finished HTML in `dist/`, and GitHub Pages serves
them. No database, nothing running in the background. A small progressive-
enhancement layer (`src/scripts/app.ts`) adds the burger menu and lazy-loads
the generative viaduct hero on the home page. Everything still works with
JavaScript switched off.

The identity is the Stockport viaduct — brick arches, built to carry and to
last. See [`BRANDING.md`](BRANDING.md) for the full design system.

---

## ✏️ Editing the site (no coding needed)

**The easy way: the editor at [`/admin/`](https://kylelookingaround.github.io/business-website/admin/).**
Every page's content shows as simple forms — text boxes, image uploads,
add/remove buttons for lists, and a full editor for writing new case studies.
Hit **Save** and the site rebuilds and goes live on its own a minute or two
later.

**Signing in:** the editor uses your GitHub account. On first sign-in it asks
for a *personal access token*:

- **Repo owner** — GitHub → Settings → Developer settings → Fine-grained
  tokens, scoped to this repository with **Contents: read and write**.
- **Collaborators** — use a **classic** token (Developer settings → Tokens
  (classic)) with the **`repo`** scope; fine-grained tokens don't always reach
  a repo owned by someone else. Paste it in once; it's remembered after that.

**The hands-on way:** edit the files in [`content/`](content/) directly on
github.com (open a file, click the ✏️ pencil, commit):

| File | What's in it |
|---|---|
| `content/settings.yml` | Studio name, contact, area, links, contact-form URL |
| `content/home.yml` | Hero headline, the three pillars, closing call-to-action |
| `content/services.yml` | The packages and prices |
| `content/about.yml` | The story and the values |
| `content/work/*.md` | One markdown file per case study (frontmatter + the story) |

Gentle rules for hand-editing YAML: spaces not tabs, keep values in quotes, and
line up each `-` in a list with the examples already there.

**A safety net either way:** every edit is checked when the site rebuilds. If
something's off, the build stops with a clear message and **the live site stays
exactly as it was** — you'll get an email from GitHub saying the build failed.
Open the edit again and fix it.

---

## Turning on the contact form

The contact page shows an email button until a form endpoint is set. To switch
it to a real form: create a free form at [Formspree](https://formspree.io) (or
similar), then paste its endpoint URL into **Settings → Contact form URL** in
`/admin/` (or `formAction` in `content/settings.yml`). A honeypot field is
already wired in for spam.

---

## 🛠️ Running it locally (for developers)

```bash
npm install      # one time
npm run dev      # live-reloading dev server at http://localhost:4321/business-website
npm run build    # writes the finished site to dist/ (also validates all content)
npm run preview  # serves the built dist/ locally
```

`npm run build` is the correctness check — it fails loudly on any content/
schema violation or TypeScript error.

---

## 🚀 How it gets published

Pushing to `main` (including saving in `/admin/`) triggers
`.github/workflows/deploy.yml`, which builds and deploys `dist/` to **GitHub
Pages**. Pull requests get a build check (`ci.yml`) so a broken edit can't
merge unnoticed.

One-time setup: repo **Settings → Pages → Build and deployment → Source =
"GitHub Actions"**.

## Moving to a custom domain later

Add `public/CNAME` containing just the domain, change `base` to `/` (and set
`site`) in `astro.config.mjs`, update `url` in `content/settings.yml`, and
adjust `robots.txt`/the CMS `site_url`. Internal links are base-aware, so
nothing else needs touching.
