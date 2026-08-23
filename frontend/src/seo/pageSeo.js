import { encryptId } from "../components/Common/Idcrypto.js";
import formatServiceTitle from "../components/Common/formatServiceTitle.js";

export const DEFAULT_TITLE = "ICTC";
export const SITE_NAME = "Indian Cancer Treatment Centre";

const SERVICE_DETAIL_RE = /^\/(service|Services)\/([^/]+)\/([^/]+)\/?$/;
const ALL_SERVICES_RE = /^\/AllService\/?$/;
const CANCER_DETAIL_RE = /^\/(cancer|CancerTypes)\/([^/]+)\/([^/]+)\/?$/;
const ALL_CANCERS_RE = /^\/(CancerTypes|AllCancer)\/?$/;
const BLOG_DETAIL_RE = /^\/blog\/([^/]+)\/([^/]+)\/?$/;
const BLOG_SLUG_RE = /^\/Blogs\/([^/]+)\/?$/;
const ALL_BLOGS_RE = /^\/(Blogs|blog)\/?$/;
const ALL_NEWS_RE = /^\/news\/?$/;
const DOCTOR_DETAIL_RE = /^\/(doctor|OurDoctors)\/([^/]+)\/([^/]+)\/?$/;
const ALL_DOCTORS_RE = /^\/(OurDoctors|ourDoctors)\/?$/;
const CENTRE_TOKEN_RE = /^\/centre\/([^/]+)\/?$/;
const CENTRE_NAMED_RE = /^\/OurCentres\/([^/]+)\/([^/]+)\/?$/;
const ALL_CENTRES_RE = /^\/(OurCentres|allCenters)\/?$/;
const LANDING_RE = /^\/cancer-treatment\/([^/]+)\/?$/;
const ABOUT_RE = /^\/aboutUs\/?$/;

export function matchSeoRoute(pathname) {
  const path = String(pathname || "").split("?")[0];

  let m = path.match(SERVICE_DETAIL_RE);
  if (m) return { type: "service", slug: decodeURIComponent(m[2]), token: m[3] };
  if (ALL_SERVICES_RE.test(path)) return { type: "all-services" };

  m = path.match(CANCER_DETAIL_RE);
  if (m) return { type: "cancer", slug: decodeURIComponent(m[2]), token: m[3] };
  if (ALL_CANCERS_RE.test(path)) return { type: "all-cancers" };

  m = path.match(BLOG_DETAIL_RE);
  if (m) return { type: "blog", token: m[1], slug: decodeURIComponent(m[2]) };
  m = path.match(BLOG_SLUG_RE);
  if (m) return { type: "blog", slug: decodeURIComponent(m[1]) };
  if (ALL_NEWS_RE.test(path)) return { type: "all-blogs" };
  if (ALL_BLOGS_RE.test(path)) return { type: "all-blogs" };

  m = path.match(DOCTOR_DETAIL_RE);
  if (m) return { type: "doctor", slug: decodeURIComponent(m[2]), token: m[3] };
  if (ALL_DOCTORS_RE.test(path)) return { type: "all-doctors" };

  m = path.match(CENTRE_NAMED_RE);
  if (m) return { type: "center", slug: decodeURIComponent(m[1]), token: m[2] };
  m = path.match(CENTRE_TOKEN_RE);
  if (m) return { type: "center", token: m[1] };
  if (ALL_CENTRES_RE.test(path)) return { type: "all-centers" };

  m = path.match(LANDING_RE);
  if (m) return { type: "landing", slug: decodeURIComponent(m[1]) };
  if (ABOUT_RE.test(path)) return { type: "about" };

  return null;
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function escapeAttr(value) {
  return escapeHtml(value).replace(/\s+/g, " ").trim();
}

export function absoluteUrl(base, path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (!base) return path.startsWith("/") ? path : `/${path}`;
  const origin = String(base).replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${suffix}`;
}

export function tokenFor(id) {
  if (id === null || id === undefined || id === "") return "";
  return encryptId(id);
}

function pickText(...values) {
  for (const value of values) {
    const text = String(value || "").trim();
    if (text) return text;
  }
  return "";
}

export function plainText(value) {
  if (value == null) return "";
  const asString = Array.isArray(value)
    ? value.filter(Boolean).join(" ")
    : String(value);
  return asString
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function itemAlt(item, fallbacks = []) {
  const fromAlt = String(item?.altText || "").trim();
  if (fromAlt) return fromAlt;
  for (const key of fallbacks) {
    const text = String(item?.[key] || "").trim();
    if (text) return text;
  }
  return "";
}

export function serviceAlt(service) {
  return itemAlt(service, ["title"]) || "Service";
}

export function cancerAlt(cancer) {
  return itemAlt(cancer, ["name"]) || "Cancer";
}

export function blogAlt(blog) {
  return itemAlt(blog, ["title"]) || "Article";
}

export function doctorAlt(doctor) {
  return itemAlt(doctor, ["name"]) || "Doctor";
}

export function centerImageAlt(center) {
  return (
    String(center?.centerImageAltText || "").trim() ||
    String(center?.name || "").trim() ||
    "Centre"
  );
}

export function centerHeroAlt(center) {
  return (
    String(center?.heroImageAltText || "").trim() ||
    String(center?.fullName || center?.name || "").trim() ||
    "Centre"
  );
}

export function findCenterByLandingSlug(centers = [], slug) {
  if (!slug || !centers.length) return null;
  const s = String(slug).toLowerCase();
  return (
    centers.find((c) => c.slug?.toLowerCase() === s) ||
    centers.find((c) => c.slug?.toLowerCase().endsWith(`-${s}`)) ||
    centers.find((c) => c.slug?.toLowerCase().includes(s)) ||
    centers.find((c) => (c.name || "").toLowerCase().includes(s))
  );
}

export function centrePlaceName(center) {
  if (!center) return "";
  return String(center.name || "").replace(/^ICTC\s+/i, "") || center.area || "";
}

export function isNewsItem(item) {
  return /^news(letter)?$/i.test(String(item?.type || "").trim());
}

function listingSeo(title, description, path, siteUrl, type = "CollectionPage") {
  const canonical = absoluteUrl(siteUrl, path);
  return {
    title,
    description,
    canonical,
    index: true,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": type,
      name: title,
      description,
      url: canonical || undefined,
    },
  };
}

export function getServiceSeo(service, { siteUrl = "", imageBase = "" } = {}) {
  const visibleTitle = formatServiceTitle(service?.title);
  const title = pickText(service?.seoTitle, visibleTitle, DEFAULT_TITLE);
  const description = pickText(service?.metaDescription);
  const alt = serviceAlt(service);
  const slug = service?.slug || "";
  const token = tokenFor(service?.id);
  const path = slug && token ? `/service/${slug}/${token}` : "";
  const canonical = path ? absoluteUrl(siteUrl, path) : "";
  const image = absoluteUrl(imageBase, service?.coverImage);

  return {
    title,
    description,
    alt,
    image,
    path,
    token,
    canonical,
    index: true,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: visibleTitle || service?.title || title,
      description: description || undefined,
      image: image || undefined,
      url: canonical || undefined,
      provider: {
        "@type": "MedicalOrganization",
        name: SITE_NAME,
        url: siteUrl || undefined,
      },
    },
  };
}

export function getCancerSeo(cancer, { siteUrl = "", imageBase = "" } = {}) {
  const name = pickText(cancer?.name);
  const title = pickText(cancer?.seoTitle, name && `${name} | ${SITE_NAME}`, DEFAULT_TITLE);
  const description = pickText(cancer?.metaDescription, cancer?.description);
  const alt = cancerAlt(cancer);
  const slug = cancer?.slug || "";
  const token = tokenFor(cancer?.id);
  const path = slug && token ? `/cancer/${slug}/${token}` : "";
  const canonical = path ? absoluteUrl(siteUrl, path) : "";
  const image = absoluteUrl(imageBase, cancer?.coverImage);

  return {
    title,
    description,
    alt,
    image,
    path,
    token,
    canonical,
    index: true,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "MedicalCondition",
      name: name || title,
      description: description || undefined,
      image: image || undefined,
      url: canonical || undefined,
    },
  };
}

export function getBlogSeo(blog, { siteUrl = "", imageBase = "" } = {}) {
  const name = pickText(blog?.title);
  const title = pickText(blog?.metaTitle, name && `${name} | ${SITE_NAME}`, DEFAULT_TITLE);
  const description = pickText(blog?.metaDescription);
  const alt = blogAlt(blog);
  const slug = blog?.slug || "";
  const token = tokenFor(blog?.id);
  const path = slug && token ? `/blog/${token}/${slug}` : "";
  const canonical = path ? absoluteUrl(siteUrl, path) : "";
  const image = absoluteUrl(imageBase, blog?.image);
  const news = isNewsItem(blog);

  return {
    title,
    description,
    alt,
    image,
    path,
    token,
    canonical,
    index: true,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": news ? "NewsArticle" : "BlogPosting",
      headline: name || title,
      description: description || undefined,
      image: image || undefined,
      url: canonical || undefined,
      datePublished: blog?.date || undefined,
      author: {
        "@type": "Person",
        name: pickText(blog?.author, "ICTC Team"),
      },
      publisher: {
        "@type": "MedicalOrganization",
        name: SITE_NAME,
        url: siteUrl || undefined,
      },
    },
  };
}

export function getDoctorSeo(doctor, { siteUrl = "", imageBase = "" } = {}) {
  const name = pickText(doctor?.name);
  const extra =
    doctor?.designation && doctor.designation !== name
      ? ` | ${doctor.designation}`
      : "";
  const title = pickText(
    doctor?.seoTitle,
    name && `${name}${extra} | ${SITE_NAME}`,
    DEFAULT_TITLE,
  );
  const description = pickText(doctor?.metaDescription, plainText(doctor?.summary));
  const alt = doctorAlt(doctor);
  const slug = doctor?.slug || "";
  const token = tokenFor(doctor?.id);
  const path = slug && token ? `/doctor/${slug}/${token}` : "";
  const canonical = path ? absoluteUrl(siteUrl, path) : "";
  const image = absoluteUrl(imageBase, doctor?.image);

  return {
    title,
    description,
    alt,
    image,
    path,
    token,
    canonical,
    index: true,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Physician",
      name: name || title,
      description: description || undefined,
      image: image || undefined,
      url: canonical || undefined,
      jobTitle: doctor?.designation || undefined,
      worksFor: {
        "@type": "MedicalOrganization",
        name: SITE_NAME,
        url: siteUrl || undefined,
      },
    },
  };
}

export function getCenterSeo(center, { siteUrl = "", imageBase = "" } = {}) {
  const name = pickText(center?.fullName, center?.name);
  const title = pickText(center?.seoTitle, name && `${name} | ${SITE_NAME}`, DEFAULT_TITLE);
  const description = pickText(
    center?.metaDescription,
    plainText(center?.description),
    center?.address && `Cancer care at ${name}, ${center.address}.`,
  );
  const alt = centerHeroAlt(center);
  const token = tokenFor(center?.id);
  const path = token ? `/centre/${token}` : "";
  const canonical = path ? absoluteUrl(siteUrl, path) : "";
  const image = absoluteUrl(imageBase, center?.heroImage || center?.centerImage);

  return {
    title,
    description,
    alt,
    image,
    path,
    token,
    canonical,
    index: true,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "MedicalClinic",
      name: name || title,
      description: description || undefined,
      image: image || undefined,
      url: canonical || undefined,
      telephone: center?.phone || undefined,
      address: center?.address || undefined,
      parentOrganization: {
        "@type": "MedicalOrganization",
        name: SITE_NAME,
        url: siteUrl || undefined,
      },
    },
  };
}

export function getLandingSeo(center, landingSlug, { siteUrl = "", imageBase = "" } = {}) {
  const place = centrePlaceName(center) || "Mumbai";
  const title = `Cancer Care & Oncology Services in ${place} | ${SITE_NAME}`;
  const description = pickText(
    plainText(center?.description),
    `Receive expert cancer diagnosis, treatment, chemotherapy, immunotherapy, and follow-up care from a multidisciplinary oncology team in ${place}.`,
  );
  const slug = landingSlug || center?.slug || "";
  const path = slug ? `/cancer-treatment/${slug}` : "";
  const canonical = path ? absoluteUrl(siteUrl, path) : "";
  const image = absoluteUrl(imageBase, center?.heroImage || center?.centerImage);

  return {
    title,
    description,
    alt: centerHeroAlt(center) || `Cancer Care in ${place}`,
    image,
    path,
    canonical,
    index: true,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "MedicalClinic",
      name: pickText(center?.fullName, center?.name, title),
      description,
      image: image || undefined,
      url: canonical || undefined,
      areaServed: place,
    },
  };
}

export function getAllServicesSeo({ siteUrl = "" } = {}) {
  return listingSeo(
    `Services | ${SITE_NAME}`,
    "Cancer treatment and diagnostic services at Indian Cancer Treatment Centre, including treatment modalities and diagnostic support.",
    "/AllService",
    siteUrl,
  );
}

export function getAllCancersSeo({ siteUrl = "" } = {}) {
  return listingSeo(
    `Cancers We Treat | ${SITE_NAME}`,
    "Types of cancer treated at Indian Cancer Treatment Centre, with diagnosis and treatment information from our oncology team.",
    "/CancerTypes",
    siteUrl,
  );
}

export function getAllBlogsSeo({ siteUrl = "" } = {}) {
  return listingSeo(
    `ICTC Blogs/News | ${SITE_NAME}`,
    "Cancer care articles, news, and expert updates from Indian Cancer Treatment Centre.",
    "/blog",
    siteUrl,
  );
}

export function getAllNewsSeo(opts = {}) {
  return getAllBlogsSeo(opts);
}

export function getAllDoctorsSeo({ siteUrl = "" } = {}) {
  return listingSeo(
    `Our Doctors | ${SITE_NAME}`,
    "Meet the oncology specialists at Indian Cancer Treatment Centre.",
    "/OurDoctors",
    siteUrl,
  );
}

export function getAllCentersSeo({ siteUrl = "" } = {}) {
  return listingSeo(
    `Our Centres | ${SITE_NAME}`,
    "Indian Cancer Treatment Centre locations across Mumbai and surrounding areas.",
    "/OurCentres",
    siteUrl,
  );
}

export function getAboutSeo({ siteUrl = "" } = {}) {
  return listingSeo(
    `About Us | ${SITE_NAME}`,
    "Indian Cancer Treatment Centre provides compassionate, high-quality, affordable cancer treatment across Mumbai.",
    "/aboutUs",
    siteUrl,
    "AboutPage",
  );
}

export function injectHeadTags(html, seo) {
  if (!html || !seo) return html;

  let out = String(html);
  const robots = seo.index ? "index, follow" : "noindex, nofollow";

  if (seo.title) {
    if (/<title>[\s\S]*?<\/title>/i.test(out)) {
      out = out.replace(
        /<title>[\s\S]*?<\/title>/i,
        `<title>${escapeHtml(seo.title)}</title>`,
      );
    } else {
      out = out.replace(/<\/head>/i, `<title>${escapeHtml(seo.title)}</title>\n</head>`);
    }
  }

  out = out.replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, "");
  out = out.replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi, "");
  out = out.replace(/<meta\s+name=["']googlebot["'][^>]*>\s*/gi, "");
  out = out.replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, "");
  out = out.replace(/<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi, "");
  out = out.replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/gi, "");
  out = out.replace(
    /<script[^>]*id=["'](service-seo-jsonld|page-seo-jsonld)["'][^>]*>[\s\S]*?<\/script>\s*/gi,
    "",
  );

  const tags = [
    seo.description
      ? `<meta name="description" content="${escapeAttr(seo.description)}" />`
      : "",
    `<meta name="robots" content="${robots}" />`,
    `<meta name="googlebot" content="${robots}" />`,
    seo.canonical
      ? `<link rel="canonical" href="${escapeAttr(seo.canonical)}" />`
      : "",
    seo.title
      ? `<meta property="og:title" content="${escapeAttr(seo.title)}" />`
      : "",
    seo.description
      ? `<meta property="og:description" content="${escapeAttr(seo.description)}" />`
      : "",
    seo.image
      ? `<meta property="og:image" content="${escapeAttr(seo.image)}" />`
      : "",
    seo.alt && seo.image
      ? `<meta property="og:image:alt" content="${escapeAttr(seo.alt)}" />`
      : "",
    seo.canonical
      ? `<meta property="og:url" content="${escapeAttr(seo.canonical)}" />`
      : "",
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}" />`,
    seo.title
      ? `<meta name="twitter:title" content="${escapeAttr(seo.title)}" />`
      : "",
    seo.description
      ? `<meta name="twitter:description" content="${escapeAttr(seo.description)}" />`
      : "",
    seo.image
      ? `<meta name="twitter:image" content="${escapeAttr(seo.image)}" />`
      : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    seo.jsonLd
      ? `<script type="application/ld+json" id="page-seo-jsonld">${JSON.stringify(seo.jsonLd).replace(/</g, "\\u003c")}</script>`
      : "",
  ]
    .filter(Boolean)
    .join("\n    ");

  return out.replace(/<\/head>/i, `    ${tags}\n  </head>`);
}

function sitemapUrls(entries) {
  return entries
    .filter((u) => u?.loc)
    .map(
      (u) => `  <url>
    <loc>${escapeHtml(u.loc)}</loc>
    <changefreq>${u.changefreq || "weekly"}</changefreq>
    <priority>${u.priority || "0.8"}</priority>
  </url>`,
    )
    .join("\n");
}

export function buildSitemap(
  { services = [], cancers = [], blogs = [], doctors = [], centers = [] },
  siteUrl,
) {
  const origin = String(siteUrl || "").replace(/\/$/, "");
  const urls = [
    { loc: `${origin}/AllService`, priority: "0.8" },
    { loc: `${origin}/CancerTypes`, priority: "0.8" },
    { loc: `${origin}/blog`, priority: "0.8" },
    { loc: `${origin}/OurDoctors`, priority: "0.8" },
    { loc: `${origin}/OurCentres`, priority: "0.8" },
    { loc: `${origin}/aboutUs`, priority: "0.7" },
    ...services
      .filter((s) => s?.slug && s?.id != null)
      .map((s) => ({
        loc: `${origin}/service/${s.slug}/${encryptId(s.id)}`,
        priority: "0.9",
      })),
    ...cancers
      .filter((c) => c?.slug && c?.id != null)
      .map((c) => ({
        loc: `${origin}/cancer/${c.slug}/${encryptId(c.id)}`,
        priority: "0.9",
      })),
    ...blogs
      .filter((b) => b?.slug && b?.id != null)
      .map((b) => ({
        loc: `${origin}/blog/${encryptId(b.id)}/${b.slug}`,
        priority: "0.8",
      })),
    ...doctors
      .filter((d) => d?.slug && d?.id != null)
      .map((d) => ({
        loc: `${origin}/doctor/${d.slug}/${encryptId(d.id)}`,
        priority: "0.8",
      })),
    ...centers
      .filter((c) => c?.id != null)
      .map((c) => ({
        loc: `${origin}/centre/${encryptId(c.id)}`,
        priority: "0.8",
      })),
    ...centers
      .filter((c) => c?.slug)
      .map((c) => ({
        loc: `${origin}/cancer-treatment/${c.slug}`,
        priority: "0.9",
      })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls(urls)}
</urlset>
`;
}

export function buildServicesSitemap(services, siteUrl) {
  return buildSitemap({ services }, siteUrl);
}

export function buildRobotsTxt(siteUrl) {
  const origin = String(siteUrl || "").replace(/\/$/, "");
  const sitemap = origin ? `Sitemap: ${origin}/sitemap.xml\n` : "";
  return `User-agent: *
Allow: /
Disallow: /ctrl
Disallow: /ctrl/

${sitemap}`;
}
