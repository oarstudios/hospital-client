import { loadEnv } from "vite";
import { decryptId } from "./src/components/Common/Idcrypto.js";
import {
  matchSeoRoute,
  getServiceSeo,
  getAllServicesSeo,
  getCancerSeo,
  getAllCancersSeo,
  getBlogSeo,
  getAllBlogsSeo,
  getAllNewsSeo,
  getDoctorSeo,
  getAllDoctorsSeo,
  getCenterSeo,
  getAllCentersSeo,
  getLandingSeo,
  getAboutSeo,
  getHomeSeo,
  getPrivacySeo,
  findCenterByLandingSlug,
  injectHeadTags,
  injectSearchConsoleVerification,
  buildSitemap,
  buildRobotsTxt,
} from "./src/seo/pageSeo.js";
import {
  blogBody,
  serviceBody,
  cancerBody,
  doctorBody,
  centerBody,
  landingBody,
} from "./src/seo/bodySnapshot.js";

function unwrap(payload) {
  if (!payload) return null;
  return payload.data ?? payload;
}

async function fetchJson(url, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) return null;
  return unwrap(await res.json());
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isLocalhost = (url) =>
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(String(url || ""));

const truthy = (v) => /^(1|true|yes|on)$/i.test(String(v || "").trim());

function withTimeout(ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

export default function siteSeoPlugin() {
  let apiBase = "http://localhost:3001";
  let imageBase = "http://localhost:3001";
  let siteUrl = "http://localhost:5173";
  let verification = "";
  let outDir = "dist";
  let root = process.cwd();
  // SEO_STRICT=true  -> fail the build if the CMS API cannot be reached,
  //                     instead of silently shipping pages that show Home's tags.
  let strict = false;
  // Build-time API calls are patient: free-tier hosts (e.g. Render) can take
  // 30-60s to wake up, far longer than the 4s used for live dev/preview requests.
  let buildTimeoutMs = 30000;
  let buildRetries = 3;

  const envOpts = () => ({ siteUrl, imageBase });

  /** Returns the record, or null when the request failed / was not found. */
  async function loadOne(path, { timeoutMs = 4000, retries = 0 } = {}) {
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      const { signal, cancel } = withTimeout(timeoutMs);
      try {
        const data = await fetchJson(`${apiBase}${path}`, signal);
        if (data) return data;
      } catch {
        /* network error / timeout -> retry */
      } finally {
        cancel();
      }
      if (attempt < retries) await sleep(1500 * (attempt + 1));
    }
    return null;
  }

  /** Returns an array, or null when the request failed (so callers can tell
   *  "API unreachable" apart from "no records yet"). */
  async function loadList(path, load) {
    const data = await loadOne(path, load);
    return Array.isArray(data) ? data : null;
  }

  /** Attaches the crawler-visible body snapshot (see src/seo/bodySnapshot.js). */
  function withBody(seo, bodyHtml) {
    if (seo && bodyHtml) seo.bodyHtml = bodyHtml;
    return seo;
  }

  async function loadCtas(load) {
    const others = await loadOne("/others", load);
    return Array.isArray(others?.ctas) ? others.ctas : [];
  }

  async function blogSeoWithBody(blog, opts, { ctas, doctors } = {}) {
    const authorDoctor = blog.authorId
      ? (doctors || []).find((d) => String(d.id) === String(blog.authorId))
        || (doctors ? null : await loadOne(`/doctors/${blog.authorId}`))
      : null;
    return withBody(
      getBlogSeo(blog, opts),
      blogBody(blog, { ...opts, ctas: ctas ?? (await loadCtas()), authorDoctor }),
    );
  }

  async function loadCatalog(load) {
    const names = ["services", "cancers", "blogs", "doctors", "centers"];
    const results = await Promise.all(names.map((n) => loadList(`/${n}`, load)));
    const catalog = { failed: [] };
    names.forEach((name, i) => {
      if (results[i] === null) catalog.failed.push(name);
      catalog[name] = results[i] ?? [];
    });
    return catalog;
  }

  async function seoForPath(pathname) {
    const route = matchSeoRoute(pathname);
    if (!route) return null;
    const opts = envOpts();

    switch (route.type) {
      case "all-services":
        return getAllServicesSeo(opts);
      case "all-cancers":
        return getAllCancersSeo(opts);
      case "all-blogs":
        return getAllBlogsSeo(opts);
      case "all-doctors":
        return getAllDoctorsSeo(opts);
      case "all-centers":
        return getAllCentersSeo(opts);
      case "home":
        return getHomeSeo(opts);
      case "privacy":
        return getPrivacySeo(opts);
      case "about":
        return getAboutSeo(opts);
      case "service": {
        const service = await loadOne(`/services/slug/${encodeURIComponent(route.slug)}`);
        return service ? withBody(getServiceSeo(service, opts), serviceBody(service, opts)) : null;
      }
      case "cancer": {
        const cancer = await loadOne(`/cancers/slug/${encodeURIComponent(route.slug)}`);
        return cancer ? withBody(getCancerSeo(cancer, opts), cancerBody(cancer, opts)) : null;
      }
      case "blog": {
        let blog = route.slug
          ? await loadOne(`/blogs/slug/${encodeURIComponent(route.slug)}`)
          : null;
        if (!blog && route.token) {
          const id = decryptId(route.token) || route.token;
          if (id) blog = await loadOne(`/blogs/${id}`);
        }
        return blog ? blogSeoWithBody(blog, opts) : null;
      }
      case "doctor": {
        const doctor = await loadOne(`/doctors/slug/${encodeURIComponent(route.slug)}`);
        return doctor ? withBody(getDoctorSeo(doctor, opts), doctorBody(doctor, opts)) : null;
      }
      case "center": {
        const centers = (await loadList("/centers")) ?? [];
        const bySlug = route.slug
          ? centers.find((c) => String(c.slug).toLowerCase() === String(route.slug).toLowerCase())
          : null;
        const byId = route.token
          ? centers.find((c) => String(c.id) === String(decryptId(route.token) || route.token))
          : null;
        const center = bySlug || byId;
        return center ? withBody(getCenterSeo(center, opts), centerBody(center, opts)) : null;
      }
      case "landing": {
        const centers = (await loadList("/centers")) ?? [];
        const center = findCenterByLandingSlug(centers, route.slug);
        return center
          ? withBody(getLandingSeo(center, route.slug, opts), landingBody(center, opts))
          : null;
      }
      default:
        return null;
    }
  }

  function serveText(res, body, type) {
    res.statusCode = 200;
    res.setHeader("Content-Type", type);
    res.end(body);
  }

  function crawlerMiddleware() {
    return async (req, res, next) => {
      const url = (req.originalUrl || req.url || "").split("?")[0];

      if (url === "/sitemap.xml") {
        const catalog = await loadCatalog();
        return serveText(
          res,
          buildSitemap(catalog, siteUrl),
          "application/xml; charset=utf-8",
        );
      }

      if (url === "/robots.txt") {
        return serveText(res, buildRobotsTxt(siteUrl), "text/plain; charset=utf-8");
      }

      next();
    };
  }

  function emitHtml(plugin, html, fileName, seo) {
    if (!fileName || !seo) return;
    plugin.emitFile({
      type: "asset",
      fileName,
      source: injectHeadTags(html, seo),
    });
  }

  return {
    name: "site-seo",
    config(_, { mode }) {
      const env = loadEnv(mode, process.cwd(), "");
      apiBase = (env.VITE_API_BASE_URL || apiBase).replace(/\/$/, "");
      imageBase = (env.VITE_IMAGE_BASE_URL || imageBase).replace(/\/$/, "");
      if (env.VITE_SITE_URL) siteUrl = env.VITE_SITE_URL.replace(/\/$/, "");
      verification = env.VITE_GOOGLE_SITE_VERIFICATION || "";
      strict = truthy(env.SEO_STRICT);
      buildTimeoutMs = Number(env.SEO_API_TIMEOUT_MS) || buildTimeoutMs;
      buildRetries = Number.isFinite(Number(env.SEO_API_RETRIES))
        && env.SEO_API_RETRIES !== undefined && env.SEO_API_RETRIES !== ""
        ? Number(env.SEO_API_RETRIES)
        : buildRetries;
    },
    configResolved(config) {
      root = config.root;
      outDir = config.build.outDir;
      if (!loadEnv(config.mode, root, "").VITE_SITE_URL) {
        siteUrl = `http://localhost:${config.server?.port || 5173}`;
      }
    },
    configureServer(server) {
      server.middlewares.use(crawlerMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(crawlerMiddleware());
      server.middlewares.use(async (req, res, next) => {
        const url = (req.originalUrl || req.url || "").split("?")[0];
        if (!matchSeoRoute(url)) return next();
        try {
          const { readFile } = await import("node:fs/promises");
          const { resolve, sep } = await import("node:path");
          const distDir = resolve(root, outDir);

          const seo = await seoForPath(url);
          if (seo) {
            const html = await readFile(resolve(distDir, "index.html"), "utf8");
            return serveText(res, injectHeadTags(html, seo), "text/html; charset=utf-8");
          }

          // API down / record missing: serve the page generated at build time
          // (dist/<path>/index.html) rather than the generic Home shell.
          const rel = decodeURIComponent(url).replace(/^\/+|\/+$/g, "");
          const file = resolve(distDir, rel, "index.html");
          if (rel && file.startsWith(distDir + sep)) {
            return serveText(res, await readFile(file, "utf8"), "text/html; charset=utf-8");
          }
        } catch {
          /* fall through to the default handler */
        }
        next();
      });
    },
    transformIndexHtml: {
      order: "post",
      async handler(html, ctx) {
        let out = injectSearchConsoleVerification(html, verification);
        const pathname = (ctx.originalUrl || ctx.path || "/").split("?")[0];
        const seo = await seoForPath(pathname === "/index.html" ? "/" : pathname);
        return seo ? injectHeadTags(out, seo) : out;
      },
    },
    async writeBundle(options) {
      const { readFile, writeFile, mkdir } = await import("node:fs/promises");
      const { resolve, dirname } = await import("node:path");

      const dir = options.dir || resolve(root, outDir);

      // Read the final Vite-generated index.html (used as the template for every page)
      const html = injectSearchConsoleVerification(
        await readFile(resolve(dir, "index.html"), "utf8"),
        verification,
      );
      const opts = envOpts();

      // Misconfiguration that silently produces empty / wrong SEO output
      if (isLocalhost(apiBase)) {
        console.warn(
          `[site-seo] NOTE: VITE_API_BASE_URL is "${apiBase}". Fine for a local build, but a deploy/CI ` +
            "build cannot reach it, so no CMS pages would be generated. Use your live API there.",
        );
      }
      if (isLocalhost(siteUrl)) {
        console.warn(
          `[site-seo] NOTE: VITE_SITE_URL is "${siteUrl}". Canonical tags, og:url and sitemap.xml ` +
            "will point at localhost. For a production build set it to your live website origin.",
        );
      }

      // Helper to write generated HTML
      async function writeSeoHtml(fileName, seo) {
        if (!fileName || !seo) return;
        const filePath = resolve(dir, fileName);
        await mkdir(dirname(filePath), { recursive: true });
        await writeFile(filePath, injectHeadTags(html, seo), "utf8");
      }

      // 1) Pages that need NO CMS data: always generated, even if the API is down.
      await writeSeoHtml("index.html", getHomeSeo(opts));
      await writeSeoHtml("AllService/index.html", getAllServicesSeo(opts));
      await writeSeoHtml("CancerTypes/index.html", getAllCancersSeo(opts));
      await writeSeoHtml("AllCancer/index.html", getAllCancersSeo(opts));
      await writeSeoHtml("Blogs/index.html", getAllBlogsSeo(opts));
      // /blog listing: individual posts live under blog/*/, so without this a
      // refresh on /blog/ hits a real directory with no index -> 403
      await writeSeoHtml("blog/index.html", getAllBlogsSeo(opts));
      await writeSeoHtml("news/index.html", getAllNewsSeo(opts));
      await writeSeoHtml("OurDoctors/index.html", getAllDoctorsSeo(opts));
      await writeSeoHtml("ourDoctors/index.html", getAllDoctorsSeo(opts));
      await writeSeoHtml("OurCentres/index.html", getAllCentersSeo(opts));
      await writeSeoHtml("allCenters/index.html", getAllCentersSeo(opts));
      await writeSeoHtml("aboutUs/index.html", getAboutSeo(opts));
      await writeSeoHtml("privacy-policy/index.html", getPrivacySeo(opts));

      // 2) CMS-backed pages (patient retries: the API may be waking from sleep)
      const load = { timeoutMs: buildTimeoutMs, retries: buildRetries };
      const catalog = await loadCatalog(load);
      const { services, cancers, blogs, doctors, centers, failed } = catalog;

      if (failed.length) {
        const msg =
          `[site-seo] Could not load ${failed.join(", ")} from ${apiBase} ` +
          `(tried ${buildRetries + 1}x, ${buildTimeoutMs / 1000}s timeout each). ` +
          "Detail pages for these (service/cancer/blog/doctor/centre) were NOT generated, so those " +
          "URLs will show the generic Home tags in View Source. " +
          "Make sure the API is reachable from the machine running `vite build`.";
        if (strict) throw new Error(msg + " (SEO_STRICT is on, failing the build.)");
        console.warn(msg);
      }

      const ctas = failed.includes("blogs") ? [] : await loadCtas(load);

      // Services
      for (const service of services) {
        const seo = withBody(getServiceSeo(service, opts), serviceBody(service, opts));
        if (seo.token && service.slug) {
          await writeSeoHtml(`service/${service.slug}/${seo.token}/index.html`, seo);
          await writeSeoHtml(`Services/${service.slug}/${seo.token}/index.html`, seo);
        }
      }

      // Cancers
      for (const cancer of cancers) {
        const seo = withBody(getCancerSeo(cancer, opts), cancerBody(cancer, opts));
        if (seo.token && cancer.slug) {
          await writeSeoHtml(`cancer/${cancer.slug}/${seo.token}/index.html`, seo);
          await writeSeoHtml(`CancerTypes/${cancer.slug}/${seo.token}/index.html`, seo);
        }
      }

      // Blogs
      for (const blog of blogs) {
        const seo = await blogSeoWithBody(blog, opts, { ctas, doctors });
        if (seo.token && blog.slug) {
          await writeSeoHtml(`blog/${seo.token}/${blog.slug}/index.html`, seo);
          await writeSeoHtml(`Blogs/${blog.slug}/index.html`, seo);
        }
      }

      // Doctors
      for (const doctor of doctors) {
        const seo = withBody(getDoctorSeo(doctor, opts), doctorBody(doctor, opts));
        if (seo.token && doctor.slug) {
          await writeSeoHtml(`doctor/${doctor.slug}/${seo.token}/index.html`, seo);
          await writeSeoHtml(`OurDoctors/${doctor.slug}/${seo.token}/index.html`, seo);
        }
      }

      // Centres
      for (const center of centers) {
        const seo = withBody(getCenterSeo(center, opts), centerBody(center, opts));
        if (seo.token && center.slug) {
          await writeSeoHtml(`centre/${center.slug}/${seo.token}/index.html`, seo);
          await writeSeoHtml(`OurCentres/${center.slug}/${seo.token}/index.html`, seo);
        }
        if (center.slug) {
          await writeSeoHtml(
            `cancer-treatment/${center.slug}/index.html`,
            withBody(
              getLandingSeo(center, center.slug, opts),
              landingBody(center, opts),
            ),
          );
        }
      }

      await writeFile(resolve(dir, "sitemap.xml"), buildSitemap(catalog, siteUrl), "utf8");
      await writeFile(resolve(dir, "robots.txt"), buildRobotsTxt(siteUrl), "utf8");

      console.log(
        `[site-seo] Generated SEO pages: ${services.length} services, ${cancers.length} cancers, ` +
          `${blogs.length} blogs, ${doctors.length} doctors, ${centers.length} centers` +
          (failed.length ? `  (FAILED to load: ${failed.join(", ")})` : ""),
      );
      console.log(`[site-seo] Sitemap: ${resolve(dir, "sitemap.xml")}`);
    },
  };
}