#!/usr/bin/env node
/**
 * Checks what crawlers / "View Page Source" actually receive for each URL.
 *
 *   node scripts/check-seo.mjs https://your-site.com
 *   node scripts/check-seo.mjs http://localhost:5173 /blog /aboutUs
 *
 * It reads <title>, canonical and robots from the RAW HTML (no JavaScript run),
 * for the URLs listed in /sitemap.xml plus a few fixed pages, and flags any page
 * that is still serving the Home page's tags.
 *
 * Exit code 1 if any page shows Home's tags (handy in CI).
 */

const base = (process.argv[2] || "").replace(/\/+$/, "");
const extra = process.argv.slice(3);

if (!/^https?:\/\//i.test(base)) {
  console.error("Usage: node scripts/check-seo.mjs <site-url> [path ...]");
  process.exit(2);
}

const MAX_PER_SECTION = 3;
const FIXED = ["/aboutUs", "/Blogs", "/OurDoctors", "/AllService", "/CancerTypes", "/OurCentres"];

async function get(url) {
  const res = await fetch(url, {
    headers: { accept: "text/html", "user-agent": "ictc-seo-check/1.0" },
    redirect: "follow",
  });
  return { status: res.status, text: await res.text() };
}

const clean = (v) => (v ? v.replace(/\s+/g, " ").trim() : "");

function readTags(html) {
  const title = clean(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  const link = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i)?.[0] || "";
  const canonical = clean(link.match(/href=["']([^"']+)["']/i)?.[1]);
  const robotsTag = html.match(/<meta[^>]*name=["']robots["'][^>]*>/i)?.[0] || "";
  const robots = clean(robotsTag.match(/content=["']([^"']+)["']/i)?.[1]);
  return { title, canonical, robots };
}

// Pick a few URLs from each section of the sitemap (service/, blog/, doctor/ ...)
async function pathsFromSitemap() {
  try {
    const { status, text } = await get(`${base}/sitemap.xml`);
    if (status !== 200 || !text.includes("<loc>")) {
      console.log(`! ${base}/sitemap.xml -> HTTP ${status} (no usable sitemap)\n`);
      return [];
    }
    const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    const sitemapHost = new URL(locs[0]).host;
    if (sitemapHost !== new URL(base).host) {
      console.log(
        `! sitemap.xml lists "${sitemapHost}" but you are checking "${new URL(base).host}". ` +
          "VITE_SITE_URL was probably wrong when the site was built.\n",
      );
    }
    const bySection = new Map();
    for (const loc of locs) {
      const path = new URL(loc).pathname;
      const section = path.split("/")[1] || "";
      if (!section) continue;
      const list = bySection.get(section) || [];
      if (list.length < MAX_PER_SECTION) list.push(path);
      bySection.set(section, list);
    }
    return [...bySection.values()].flat();
  } catch (err) {
    console.log(`! could not read sitemap.xml (${err.message})\n`);
    return [];
  }
}

const home = await get(`${base}/`);
const homeTags = readTags(home.text);
console.log(`Home  ${base}/`);
console.log(`      title: ${homeTags.title || "(none)"}`);
console.log(`      canonical: ${homeTags.canonical || "(none)"}   robots: ${homeTags.robots || "(none)"}\n`);

const paths = [...new Set([...FIXED, ...(await pathsFromSitemap()), ...extra])];
let bad = 0;

for (const path of paths) {
  let line;
  try {
    const { status, text } = await get(`${base}${path}`);
    const t = readTags(text);
    const sameAsHome = t.title === homeTags.title && t.canonical === homeTags.canonical;
    const flag = status !== 200 ? `HTTP ${status}` : sameAsHome ? "SHOWS HOME TAGS" : "ok";
    if (flag !== "ok") bad += 1;
    line = `${flag === "ok" ? "  ok " : " FAIL"}  ${path}\n        title: ${t.title || "(none)"}\n        canonical: ${t.canonical || "(none)"}`;
  } catch (err) {
    bad += 1;
    line = ` FAIL  ${path}\n        request failed: ${err.message}`;
  }
  console.log(line);
}

console.log(`\n${paths.length - bad}/${paths.length} pages serve their own tags.`);
if (bad) {
  console.log(
    "\nPages marked FAIL return the generic Home shell. Likely causes:\n" +
      "  1. The build could not reach the API (look for '[site-seo] Could not load ...' in the build log).\n" +
      "  2. The host sends every URL to the root index.html instead of dist/<path>/index.html.",
  );
  process.exit(1);
}
