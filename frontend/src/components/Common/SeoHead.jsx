import { useEffect } from "react";
import { DEFAULT_TITLE } from "../../seo/serviceSeo";

function upsertMeta(attr, key, content) {
  const selector = `meta[${attr}="${key}"]`;
  const existing = document.head.querySelector(selector);

  if (!content) {
    existing?.remove();
    return;
  }

  const el = existing || document.createElement("meta");
  el.setAttribute(attr, key);
  el.setAttribute("content", content);
  if (!existing) document.head.appendChild(el);
}

function upsertLink(rel, href) {
  const selector = `link[rel="${rel}"]`;
  const existing = document.head.querySelector(selector);

  if (!href) {
    existing?.remove();
    return;
  }

  const el = existing || document.createElement("link");
  el.setAttribute("rel", rel);
  el.setAttribute("href", href);
  if (!existing) document.head.appendChild(el);
}

function upsertJsonLd(data) {
  const id = "page-seo-jsonld";
  document.getElementById(id)?.remove();
  document.getElementById("service-seo-jsonld")?.remove();
  if (!data) return;
  const el = document.createElement("script");
  el.type = "application/ld+json";
  el.id = id;
  el.text = JSON.stringify(data);
  document.head.appendChild(el);
}

/**
 * Sets crawlable head tags for the current public page.
 * Restores the default ICTC / noindex shell when the page unmounts.
 */
export default function SeoHead({
  title,
  description,
  image,
  alt,
  canonical,
  index = true,
  jsonLd,
}) {
  const json = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    const robots = index ? "index, follow" : "noindex, nofollow";
    document.title = title || DEFAULT_TITLE;

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", robots);
    upsertMeta("name", "googlebot", robots);
    upsertLink("canonical", canonical);

    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:alt", image ? alt : "");
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", "Indian Cancer Treatment Centre");

    upsertMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);

    upsertJsonLd(json ? JSON.parse(json) : null);

    return () => {
      document.title = DEFAULT_TITLE;
      upsertMeta("name", "description", "");
      upsertMeta("name", "robots", "noindex, nofollow, noarchive, nosnippet");
      upsertMeta("name", "googlebot", "noindex, nofollow");
      upsertLink("canonical", "");
      upsertMeta("property", "og:title", "");
      upsertMeta("property", "og:description", "");
      upsertMeta("property", "og:image", "");
      upsertMeta("property", "og:image:alt", "");
      upsertMeta("property", "og:url", "");
      upsertMeta("property", "og:type", "");
      upsertMeta("property", "og:site_name", "");
      upsertMeta("name", "twitter:card", "");
      upsertMeta("name", "twitter:title", "");
      upsertMeta("name", "twitter:description", "");
      upsertMeta("name", "twitter:image", "");
      upsertJsonLd(null);
    };
  }, [title, description, image, alt, canonical, index, json]);

  return null;
}
