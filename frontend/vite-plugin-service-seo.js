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
  findCenterByLandingSlug,
  injectHeadTags,
  buildSitemap,
  buildRobotsTxt,
} from "./src/seo/pageSeo.js";

function unwrap(payload) {
  if (!payload) return null;
  return payload.data ?? payload;
}

async function fetchJson(url, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) return null;
  return unwrap(await res.json());
}

function withTimeout(ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

export default function siteSeoPlugin() {
  let apiBase = "http://localhost:3001";
  let imageBase = "http://localhost:3001";
  let siteUrl = "http://localhost:5173";
  let outDir = "dist";
  let root = process.cwd();

  const envOpts = () => ({ siteUrl, imageBase });

  async function loadOne(path) {
    const { signal, cancel } = withTimeout(4000);
    try {
      return await fetchJson(`${apiBase}${path}`, signal);
    } catch {
      return null;
    } finally {
      cancel();
    }
  }

  async function loadList(path) {
    const data = await loadOne(path);
    return Array.isArray(data) ? data : [];
  }

  async function loadCatalog() {
    const [services, cancers, blogs, doctors, centers] = await Promise.all([
      loadList("/services"),
      loadList("/cancers"),
      loadList("/blogs"),
      loadList("/doctors"),
      loadList("/centers"),
    ]);
    return { services, cancers, blogs, doctors, centers };
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
      case "all-news":
        return getAllNewsSeo(opts);
      case "all-doctors":
        return getAllDoctorsSeo(opts);
      case "all-centers":
        return getAllCentersSeo(opts);
      case "about":
        return getAboutSeo(opts);
      case "service": {
        const service = await loadOne(`/services/slug/${encodeURIComponent(route.slug)}`);
        return service ? getServiceSeo(service, opts) : null;
      }
      case "cancer": {
        const cancer = await loadOne(`/cancers/slug/${encodeURIComponent(route.slug)}`);
        return cancer ? getCancerSeo(cancer, opts) : null;
      }
      case "blog": {
        let blog = route.slug
          ? await loadOne(`/blogs/slug/${encodeURIComponent(route.slug)}`)
          : null;
        if (!blog && route.token) {
          const id = decryptId(route.token) || route.token;
          if (id) blog = await loadOne(`/blogs/${id}`);
        }
        return blog ? getBlogSeo(blog, opts) : null;
      }
      case "doctor": {
        const doctor = await loadOne(`/doctors/slug/${encodeURIComponent(route.slug)}`);
        return doctor ? getDoctorSeo(doctor, opts) : null;
      }
      case "center": {
        const centers = await loadList("/centers");
        const bySlug = route.slug
          ? centers.find((c) => String(c.slug).toLowerCase() === String(route.slug).toLowerCase())
          : null;
        const byId = route.token
          ? centers.find((c) => String(c.id) === String(decryptId(route.token) || route.token))
          : null;
        const center = bySlug || byId;
        return center ? getCenterSeo(center, opts) : null;
      }
      case "landing": {
        const centers = await loadList("/centers");
        const center = findCenterByLandingSlug(centers, route.slug);
        return center ? getLandingSeo(center, route.slug, opts) : null;
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
        const seo = await seoForPath(url);
        if (!seo) return next();
        try {
          const { readFile } = await import("node:fs/promises");
          const { resolve } = await import("node:path");
          const html = await readFile(resolve(root, outDir, "index.html"), "utf8");
          serveText(res, injectHeadTags(html, seo), "text/html; charset=utf-8");
        } catch {
          next();
        }
      });
    },
    transformIndexHtml: {
      order: "post",
      async handler(html, ctx) {
        const pathname = (ctx.originalUrl || ctx.path || "").split("?")[0];
        const seo = await seoForPath(pathname);
        if (!seo) return html;
        return injectHeadTags(html, seo);
      },
    },
    async generateBundle(_, bundle) {
      const indexAsset = bundle["index.html"];
      if (!indexAsset || indexAsset.type !== "asset") return;

      const html = String(indexAsset.source);
      const catalog = await loadCatalog();
      const opts = envOpts();
      const { services, cancers, blogs, doctors, centers } = catalog;
      const hasAny =
        services.length || cancers.length || blogs.length || doctors.length || centers.length;

      if (!hasAny) {
        console.warn(
          "[site-seo] Could not load CMS data from the API. Static SEO HTML was not generated. Start the backend before `vite build`.",
        );
        this.emitFile({
          type: "asset",
          fileName: "robots.txt",
          source: buildRobotsTxt(siteUrl),
        });
        return;
      }

      emitHtml(this, html, "AllService/index.html", getAllServicesSeo(opts));
      emitHtml(this, html, "CancerTypes/index.html", getAllCancersSeo(opts));
      emitHtml(this, html, "AllCancer/index.html", getAllCancersSeo(opts));
      emitHtml(this, html, "Blogs/index.html", getAllBlogsSeo(opts));
      emitHtml(this, html, "news/index.html", getAllNewsSeo(opts));
      emitHtml(this, html, "OurDoctors/index.html", getAllDoctorsSeo(opts));
      emitHtml(this, html, "OurCentres/index.html", getAllCentersSeo(opts));
      emitHtml(this, html, "allCenters/index.html", getAllCentersSeo(opts));
      emitHtml(this, html, "aboutUs/index.html", getAboutSeo(opts));

      for (const service of services) {
        const seo = getServiceSeo(service, opts);
        if (seo.token && service.slug) {
          emitHtml(this, html, `service/${service.slug}/${seo.token}/index.html`, seo);
        }
      }

      for (const cancer of cancers) {
        const seo = getCancerSeo(cancer, opts);
        if (seo.token && cancer.slug) {
          emitHtml(this, html, `cancer/${cancer.slug}/${seo.token}/index.html`, seo);
        }
      }

      for (const blog of blogs) {
        const seo = getBlogSeo(blog, opts);
        if (seo.token && blog.slug) {
          emitHtml(this, html, `blog/${seo.token}/${blog.slug}/index.html`, seo);
          emitHtml(this, html, `Blogs/${blog.slug}/index.html`, seo);
        }
      }

      for (const doctor of doctors) {
        const seo = getDoctorSeo(doctor, opts);
        if (seo.token && doctor.slug) {
          emitHtml(this, html, `doctor/${doctor.slug}/${seo.token}/index.html`, seo);
        }
      }

      for (const center of centers) {
        const seo = getCenterSeo(center, opts);
        if (seo.token) {
          emitHtml(this, html, `centre/${seo.token}/index.html`, seo);
        }
        if (center.slug) {
          emitHtml(
            this,
            html,
            `cancer-treatment/${center.slug}/index.html`,
            getLandingSeo(center, center.slug, opts),
          );
        }
      }

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: buildSitemap(catalog, siteUrl),
      });
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: buildRobotsTxt(siteUrl),
      });
    },
    async writeBundle(options) {
      const { writeFile } = await import("node:fs/promises");
      const { resolve } = await import("node:path");
      const dir = options.dir || resolve(root, outDir);
      await writeFile(resolve(dir, "robots.txt"), buildRobotsTxt(siteUrl));
    },
  };
}
