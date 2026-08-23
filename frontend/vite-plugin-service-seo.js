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
    async writeBundle(options) {
  const { readFile, writeFile, mkdir } = await import("node:fs/promises");
  const { resolve, dirname } = await import("node:path");

  const dir = options.dir || resolve(root, outDir);

  // Read the final Vite-generated index.html
  const indexPath = resolve(dir, "index.html");
  const html = await readFile(indexPath, "utf8");

  // Load CMS data
  const catalog = await loadCatalog();
  const opts = envOpts();

  const { services, cancers, blogs, doctors, centers } = catalog;

  const hasAny =
    services.length ||
    cancers.length ||
    blogs.length ||
    doctors.length ||
    centers.length;

  if (!hasAny) {
    console.warn(
      "[site-seo] Could not load CMS data from the API. Static SEO HTML was not generated."
    );

    await writeFile(
      resolve(dir, "robots.txt"),
      buildRobotsTxt(siteUrl)
    );

    return;
  }

  // Helper to write generated HTML
  async function writeSeoHtml(fileName, seo) {
    if (!fileName || !seo) return;

    const filePath = resolve(dir, fileName);

    await mkdir(dirname(filePath), { recursive: true });

    await writeFile(
      filePath,
      injectHeadTags(html, seo),
      "utf8"
    );
  }

  // Static SEO pages
  await writeSeoHtml(
    "AllService/index.html",
    getAllServicesSeo(opts)
  );

  await writeSeoHtml(
    "CancerTypes/index.html",
    getAllCancersSeo(opts)
  );

  await writeSeoHtml(
    "AllCancer/index.html",
    getAllCancersSeo(opts)
  );

  await writeSeoHtml(
    "Blogs/index.html",
    getAllBlogsSeo(opts)
  );

  // /blog listing — required because individual posts live under blog/*/
  // Without this, refresh on /blog/ hits a real directory with no index → 403
  await writeSeoHtml(
    "blog/index.html",
    getAllBlogsSeo(opts)
  );

  await writeSeoHtml(
    "news/index.html",
    getAllNewsSeo(opts)
  );

  await writeSeoHtml(
    "OurDoctors/index.html",
    getAllDoctorsSeo(opts)
  );

  await writeSeoHtml(
    "OurCentres/index.html",
    getAllCentersSeo(opts)
  );

  await writeSeoHtml(
    "allCenters/index.html",
    getAllCentersSeo(opts)
  );

  await writeSeoHtml(
    "aboutUs/index.html",
    getAboutSeo(opts)
  );

  // Services
  for (const service of services) {
    const seo = getServiceSeo(service, opts);

    if (seo.token && service.slug) {
      await writeSeoHtml(
        `service/${service.slug}/${seo.token}/index.html`,
        seo
      );
    }
  }

  // Cancers
  for (const cancer of cancers) {
    const seo = getCancerSeo(cancer, opts);

    if (seo.token && cancer.slug) {
      await writeSeoHtml(
        `cancer/${cancer.slug}/${seo.token}/index.html`,
        seo
      );
    }
  }

  // Blogs
  for (const blog of blogs) {
    const seo = getBlogSeo(blog, opts);

    if (seo.token && blog.slug) {
      await writeSeoHtml(
        `blog/${seo.token}/${blog.slug}/index.html`,
        seo
      );

      await writeSeoHtml(
        `Blogs/${blog.slug}/index.html`,
        seo
      );
    }
  }

  // Doctors
  for (const doctor of doctors) {
    const seo = getDoctorSeo(doctor, opts);

    if (seo.token && doctor.slug) {
      await writeSeoHtml(
        `doctor/${doctor.slug}/${seo.token}/index.html`,
        seo
      );
    }
  }

  // Centres
  for (const center of centers) {
    const seo = getCenterSeo(center, opts);

    if (seo.token) {
      await writeSeoHtml(
        `centre/${seo.token}/index.html`,
        seo
      );
    }

    if (center.slug) {
      await writeSeoHtml(
        `cancer-treatment/${center.slug}/index.html`,
        getLandingSeo(center, center.slug, opts)
      );
    }
  }

  // Sitemap
  await writeFile(
    resolve(dir, "sitemap.xml"),
    buildSitemap(catalog, siteUrl),
    "utf8"
  );

  // Robots
  await writeFile(
    resolve(dir, "robots.txt"),
    buildRobotsTxt(siteUrl),
    "utf8"
  );

  console.log(
    `[site-seo] Generated SEO pages: ${services.length} services, ${cancers.length} cancers, ${blogs.length} blogs, ${doctors.length} doctors, ${centers.length} centers`
  );

  console.log(
    `[site-seo] Sitemap: ${resolve(dir, "sitemap.xml")}`
  );
}
  };
}

