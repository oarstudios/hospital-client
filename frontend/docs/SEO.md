# ICTC public site SEO

This document explains how search-engine tags get from Admin CMS into the live website, why a React SPA needed extra work, and how to test that crawlers can see the tags **without opening the site in a browser**.

**Deploying?** Skip to [section 8 (what is remaining)](#8-what-is-remaining-for-seo-to-work) and [section 9 (production checklist)](#9-production-deploy-checklist).

---

## 1. The problem we solved

The public site is a Vite + React single-page app.

A crawler (Google, Facebook, WhatsApp, LinkedIn, SEO tools) first downloads **only** `index.html`. That file is an empty shell:

- `<title>ICTC</title>`
- `noindex` robots tags
- empty `<div id="root">`

Admin already saved **alt text**, **SEO title**, and **meta description** in the database. Those values were returned by the API, but they were applied only **after** JavaScript ran. Many crawlers never run that JavaScript, so they would only ever see `ICTC`.

We needed the saved SEO fields to be present in the **first HTML response** for each public URL.

---

## 2. How it works (high level)

```
Admin saves alt / SEO title / meta description
        ↓
Postgres (NestJS API)
        ↓
┌───────────────────────────────────────────────┐
│  1. Vite SEO plugin (for crawlers)            │
│     On GET /service/...  (and other pages)    │
│     fetch CMS record → inject <title>, meta,  │
│     og tags, JSON-LD into index.html          │
│                                               │
│  2. SeoHead in React (for browsers + Google)  │
│     After the page loads, set the same tags   │
│     and put alt text on the actual <img>      │
└───────────────────────────────────────────────┘
```

Two layers on purpose:

| Layer | Who it helps | When it runs |
|---|---|---|
| HTML injection (`vite-plugin-service-seo.js`) | Google (first fetch), Facebook, WhatsApp, View Source | On the HTTP request, **before** React |
| `SeoHead` + image `alt` | Users, Google’s JS rendering, client-side navigation | After React loads the page |

If a crawler never executes JS, layer 1 is enough. If a user clicks from Home to a service, layer 2 updates the tab title and meta tags.

---

## 3. What Admin fields map to

| CMS field | HTML / page use |
|---|---|
| **Alt text** | Cover/profile image `alt="..."` and `og:image:alt` |
| **SEO title** / **meta title** | `<title>`, `og:title`, `twitter:title` |
| **Meta description** | `<meta name="description">`, `og:description`, `twitter:description` |
| Cover / hero / centre image | `og:image` (absolute URL) |

These are **not** shown as on-screen headings. The visible H1 stays the normal page title. SEO title is for the browser tab and crawlers.

### Content that already has SEO fields in Admin

| Content | Admin fields | Fallback if a field is empty |
|---|---|---|
| Services | Alt, SEO title, meta description | Service title |
| Cancers | Alt, SEO title, meta description | Cancer name / intro |
| Blogs / News | Alt, meta title, meta description | Post title |
| Doctors | `altText` in API (no SEO title/description form yet) | Doctor name + summary |
| Centres | `heroImageAltText`, `centerImageAltText` | Centre name + description |

When doctors/centres get dedicated SEO title/description fields in Admin later, the same helpers already look for `seoTitle` / `metaDescription`.

---

## 4. Which URLs are indexable

**Indexed** (`index, follow`) once the plugin/SeoHead runs:

- Service detail `/service/:slug/:id` and listing `/AllService`
- Cancer detail `/cancer/:slug/:id` and listing `/CancerTypes`
- Blog `/blog/:id/:slug`, listing `/Blogs`, news `/news`
- Doctor `/doctor/:slug/:id` and listing `/OurDoctors`
- Centre `/centre/:id` and listing `/OurCentres`
- Location landing `/cancer-treatment/:slug`
- About `/aboutUs`

**Not indexed** (default `index.html` `noindex`):

- Home `/`
- Booking, second opinion, thank-you
- Admin `/ctrl`

`robots.txt` allows the public site and blocks `/ctrl`. `/sitemap.xml` lists the indexable URLs above.

Canonical URLs always use the **working** public paths (the ones the UI actually links to), for example `/service/...` not `/Services/...`.

---

## 5. Files involved

| File | Role |
|---|---|
| `frontend-backup/src/seo/pageSeo.js` | Builds title, description, canonical, JSON-LD; injects tags into HTML |
| `frontend-backup/src/seo/serviceSeo.js` | Re-exports the helpers (older imports still work) |
| `frontend-backup/src/components/Common/SeoHead.jsx` | Sets/restores `<head>` tags in the browser |
| `frontend-backup/vite-plugin-service-seo.js` | Dev + preview + build: fetch CMS, inject HTML, write sitemap |
| `frontend-backup/vite.config.js` | Registers the plugin |
| `frontend-backup/index.html` | Default `noindex` shell for pages we have not marked indexable |
| `frontend-backup/public/robots.txt` | Allow `/`, disallow `/ctrl` |
| `.env` `VITE_SITE_URL` | Origin used in canonical tags and sitemap |

On `vite build`, if the API is running, the plugin also writes static files such as:

```
dist/service/<slug>/<id>/index.html
dist/blog/<id>/<slug>/index.html
dist/sitemap.xml
dist/robots.txt
```

Static hosts (nginx `try_files`) can then serve those HTML files to crawlers without Node.

---

## 6. Runtime flow (one service URL)

Example: `GET /service/chemotherapy/07Fsf4Lr3AYy`

1. Vite (or the built static file) matches the path as a **service** page.
2. Plugin calls `GET {API}/services/slug/chemotherapy`.
3. It reads `seoTitle`, `metaDescription`, `altText`, `coverImage`.
4. It rewrites `<head>`:
   - `<title>` → saved SEO title
   - `<meta name="description">` → saved meta description
   - `robots` → `index, follow` (replaces the default `noindex`)
   - canonical, Open Graph, Twitter, JSON-LD (`Service`)
5. The crawler is done. It never needs React.
6. If a human loads the same URL, React still fetches the service and `SeoHead` sets the same tags. The hero `<img alt>` uses admin alt text.

The same pattern is used for cancers, blogs, doctors, centres, and location landings (different API endpoints and schema.org types).

---

## 7. Environment

Local (`frontend-backup/.env`):

```
VITE_API_BASE_URL=http://localhost:3001
VITE_IMAGE_BASE_URL=http://localhost:3001
VITE_SITE_URL=http://localhost:5173
```

Production (set these on the **live** frontend build, then rebuild):

```
VITE_API_BASE_URL=https://<your-api-domain>
VITE_IMAGE_BASE_URL=https://<your-api-or-cdn-domain>
VITE_SITE_URL=https://<your-public-website-domain>
```

Vite bakes these in at **build time**. Changing them on the server without a rebuild will not update canonical tags, sitemap URLs, or `og:image`.

`VITE_SITE_URL` is the public website origin (what Google and WhatsApp see). It must not stay `http://localhost:5173` in production.

Home stays `noindex` until you decide to index it. Do not remove `noindex` from `index.html` globally or every unmatched route will be indexed.

---

## 8. What is remaining for SEO to work

The **app code is done**. Nothing else is required in React for crawlers to see Admin SEO fields.

What is still required is **production setup**. Until this is done on the live domain, Google will not pick up the tags.

| Remaining item | Why it matters |
|---|---|
| Production env URLs (section 7) | Canonical, sitemap, and `og:image` must use the live HTTPS domain |
| Build with the API running | Static `dist/` only gets per-page HTML if the API is reachable during `npm run build` |
| Hosting must serve per-URL HTML | If every path falls back to root `index.html`, crawlers only see `ICTC` + `noindex` |
| HTTPS + public image URLs | WhatsApp / Facebook / Google need reachable `https://.../uploads/...` images |
| Google Search Console + sitemap | Ranking only starts after Google is told about the live site |
| Staging must stay noindex | Do not submit a staging sitemap or you will index the wrong host |

Optional later (not required to launch):

- Home page SEO (home is `noindex` on purpose)
- Admin SEO title / description forms for doctors and centres (pages already fall back to name + summary/description)
- Rebuild after every CMS SEO edit — only needed on **static** hosting; a Node/`vite preview` host reads the API live
- Full SSR (Next.js) — not required if hosting serves the injected HTML

---

## 9. Production deploy checklist

Use this while deploying. Tick in order.

### 9.1 Env (required)

On the production frontend:

- [ ] `VITE_API_BASE_URL` = live API (`https://...`)
- [ ] `VITE_IMAGE_BASE_URL` = live origin that serves `/uploads/...`
- [ ] `VITE_SITE_URL` = live **website** origin (`https://www.example.com` with no trailing slash)
- [ ] Frontend **rebuilt** after setting these
- [ ] Backend CORS allows the live frontend origin

### 9.2 Build with backend up (required for static hosting)

If you deploy the `dist/` folder (nginx, Render static, S3, Netlify):

```bash
# API must already be live at VITE_API_BASE_URL
cd frontend-backup
npm run build
```

- [ ] Build finished with no `[site-seo] Could not load CMS data` warning
- [ ] `dist/sitemap.xml` exists and lists live `VITE_SITE_URL` links (not localhost)
- [ ] `dist/service/<slug>/<id>/index.html` (and blog/doctor/centre folders) exist
- [ ] `dist/robots.txt` allows `/` and disallows `/ctrl`

If the API is down during build, crawlers only get the empty `ICTC` + `noindex` shell.

After you add or edit SEO in Admin on a **static** host: rebuild and redeploy the frontend. The static files do not update themselves.

### 9.3 Hosting (required)

The host must **not** send every URL to the same root `index.html`.

- [ ] **Good — static:** nginx / host finds `dist/service/<slug>/<id>/index.html` for that path, then falls back to `index.html` for other routes
- [ ] **Good — Node:** `vite preview` (or any server that runs our SEO plugin) so tags are injected on each request from the live API
- [ ] **Bad:** “all routes → `/index.html`” only. Then every crawler sees `noindex` and title `ICTC`

Example nginx-style fallback (static `dist/`):

```
try_files $uri $uri/ /index.html;
```

`$uri` / `$uri/` is what allows `service/foo/bar/index.html` to be served. A rule that always rewrites to `/index.html` will break SEO.

### 9.4 HTTPS and images (required for social + Google)

- [ ] Website and API on HTTPS
- [ ] Cover / hero images open in an incognito window as `https://.../uploads/...` with no login
- [ ] No mixed-content (HTTPS page loading HTTP images)

### 9.5 Same-day check after deploy (required)

```bash
curl.exe -s https://<live-domain>/service/<slug>/<id>
curl.exe -s https://<live-domain>/robots.txt
curl.exe -s https://<live-domain>/sitemap.xml
curl.exe -s https://<live-domain>/
```

- [ ] Service URL HTML contains the **Admin SEO title**, meta description, and `index, follow`
- [ ] It does **not** still say `<title>ICTC</title>` with `noindex`
- [ ] `robots.txt` allows `/`, disallows `/ctrl`, and (if present) `Sitemap: https://<live-domain>/sitemap.xml`
- [ ] `sitemap.xml` uses `https://<live-domain>/...`, not localhost
- [ ] Home `/` still has `noindex`
- [ ] Browser: live service URL → right-click → **View Page Source** (not Inspect) shows the same tags

If curl still shows `ICTC` + `noindex`, stop and fix hosting (9.3) before Search Console.

### 9.6 Google after the site is live (required for ranking)

Do this only on the **real public domain**, not staging.

- [ ] [Google Search Console](https://search.google.com/search-console) → add `https://<live-domain>`
- [ ] Verify ownership
- [ ] Submit `https://<live-domain>/sitemap.xml`
- [ ] URL Inspection on one service URL → crawled HTML shows your title/description, not `ICTC`

Indexing can take days. Curl / View Source is the same-day test.

### 9.7 Staging (recommended)

If you have a staging URL:

- [ ] Do **not** submit the staging sitemap to Search Console
- [ ] Keep staging `noindex`, or use staging `robots.txt` `Disallow: /`
- [ ] Do not point `VITE_SITE_URL` at staging if you are building the production bundle

---

## 10. How to test

Backend and frontend must both be running. SEO injection reads live CMS data.

### 10.1 The important test: View Source (not Inspect)

Inspect Element shows the **live DOM after JavaScript**. That is not what most crawlers see.

1. In Admin, save a service with:
   - Alt text: `Chemotherapy treatment at ICTC`
   - SEO title: `Chemotherapy | Indian Cancer Treatment Centre`
   - Meta description: `Learn how chemotherapy is delivered at ICTC.`
2. Open the **public** service URL in the browser.
3. Right-click → **View Page Source** (or Ctrl+U).
4. In `<head>` you must see:
   - `<title>Chemotherapy | Indian Cancer Treatment Centre</title>`
   - `<meta name="description" content="Learn how chemotherapy is delivered at ICTC." />`
   - `<meta name="robots" content="index, follow" />`
   - `og:title` / `og:description` / `og:image`
5. In the body, the cover image must have  
   `alt="Chemotherapy treatment at ICTC"`.

If View Source still shows `<title>ICTC</title>` and `noindex`, crawlers will not get your SEO fields.

### 10.2 Curl (simulates a crawler, no browser)

From a terminal (Windows: `curl.exe`):

```bash
curl.exe -s http://localhost:5173/service/<slug>/<id>
```

On production, use the live domain:

```bash
curl.exe -s https://<live-domain>/service/<slug>/<id>
curl.exe -s https://<live-domain>/robots.txt
curl.exe -s https://<live-domain>/sitemap.xml
```

You should see the SEO title and description in the raw HTML.

Other useful URLs:

```bash
curl.exe -s http://localhost:5173/robots.txt
curl.exe -s http://localhost:5173/sitemap.xml
curl.exe -s http://localhost:5173/          # still noindex
curl.exe -s http://localhost:5173/Blogs
curl.exe -s http://localhost:5173/aboutUs
```

`sitemap.xml` should list services, cancers, blogs, news, doctors, centres, location landings, and About.

### 10.3 In-browser checks

| Check | What “good” looks like |
|---|---|
| Tab title on a service/blog/cancer page | Saved SEO / meta title, not just `ICTC` |
| Cover image → Inspect → `alt` | Saved alt text |
| Leave the page (go Home) | Title returns to `ICTC` |
| Home View Source | Still `noindex` |
| `/ctrl/...` | Not in sitemap; blocked in robots |

### 10.4 Social share preview (optional)

WhatsApp / Facebook read `og:title`, `og:description`, `og:image` from the **first HTML**. Localhost images will not preview on those networks. After deploy, paste a live URL into:

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [opengraph.xyz](https://www.opengraph.xyz/)

### 10.5 Google (after go-live)

Same as section 9.6. Search Console + sitemap on the live domain only.

---

## 11. Troubleshooting

| Symptom | Likely cause |
|---|---|
| View Source is still `ICTC` / `noindex` | Frontend restarted without the plugin, or the path is not in the SEO route list (Home, booking, admin) |
| Hosting sends every URL to root `index.html` | Fix try_files / SPA fallback so `service/.../index.html` is used (section 9.3) |
| Tags missing only on `vite preview` / production | Backend was down during `vite build`, so per-URL HTML was not generated. Rebuild with API up, or use a host that runs the SEO plugin |
| Canonical / sitemap show `localhost:5173` | `VITE_SITE_URL` is still the local value |
| `og:image` broken | `VITE_IMAGE_BASE_URL` must be a public absolute origin |
| New service not in sitemap | Sitemap is built from the API at request time in `npm run dev`; after a static build, rebuild or ensure the server regenerates it |
| Google still not indexing | Site not live, Search Console not verified, or `index.html` `noindex` still winning because injection did not run on that URL |

---

## 12. What we did **not** change

- Admin create/edit/delete flows
- Public routing and encrypted URL ids
- Static `src/data/*.js` files (kept as-is)
- Visible page copy (H1 still uses the normal title)

SEO is additive: saved CMS fields are copied into `<head>` and image `alt`. The rest of the site behaves as before.
