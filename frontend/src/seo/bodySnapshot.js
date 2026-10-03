/**
 * Server-side body snapshots for crawlers / "View page source".
 *
 * The app is a client-rendered SPA, so the HTML response only had an empty
 * <div id="root">. Image alt text, headings and article text therefore never
 * appeared in the page source. These builders produce a plain-HTML version of
 * each page's main content (with <img alt="…">) that the SEO plugin puts
 * inside #root. React replaces it as soon as the app mounts.
 *
 * Pure string building — no DOM — so it runs inside the Vite plugin (Node).
 * Everything coming from the CMS is escaped.
 */
import { escapeHtml, escapeAttr, absoluteUrl, plainText } from "./pageSeo.js";

/* ── helpers ────────────────────────────────────────────────────────────── */

const VIDEO_ID_RE = /^[\w-]{11}$/;

function safeHref(link) {
  const value = String(link || "").trim();
  if (!value) return "";
  if (/^(javascript|data|vbscript):/i.test(value)) return "";
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(value)) return value;
  return `https://${value}`;
}

const img = (src, alt, extra = "") =>
  src ? `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt || "")}"${extra} />` : "";

const parseJson = (value) => {
  if (value && typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

/** Strips scripts / inline event handlers from CMS HTML before inlining it. */
function cleanHtml(html, imageBase) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(["'])\s*(javascript|vbscript|data):[^"']*\2/gi, '$1="#"')
    // make uploaded image paths absolute so they resolve from any page URL
    .replace(/(<img\b[^>]*\ssrc=)(["'])(\/uploads\/[^"']+)\2/gi, (_, pre, q, path) =>
      `${pre}${q}${absoluteUrl(imageBase, path)}${q}`);
}

/* ── TipTap JSON → HTML ─────────────────────────────────────────────────── */

const MARK_TAGS = {
  bold: "strong",
  italic: "em",
  underline: "u",
  strike: "s",
  highlight: "mark",
  code: "code",
};

function renderText(node) {
  let out = escapeHtml(node.text || "");
  for (const mark of node.marks || []) {
    if (mark.type === "link") {
      const href = safeHref(mark.attrs?.href);
      out = href ? `<a href="${escapeAttr(href)}">${out}</a>` : out;
    } else if (MARK_TAGS[mark.type]) {
      const tag = MARK_TAGS[mark.type];
      out = `<${tag}>${out}</${tag}>`;
    }
  }
  return out;
}

const alignAttr = (node) => {
  const align = node.attrs?.textAlign;
  return align && align !== "left" && /^[a-z]+$/.test(align) ? ` style="text-align:${align}"` : "";
};

/**
 * Renders the node types used by the blog editor. Unknown nodes render their
 * children so text is never lost.
 */
export function tiptapToHtml(doc, { imageBase = "", ctas = [] } = {}) {
  const ctaById = new Map((ctas || []).map((c) => [String(c.id), c]));

  const render = (node) => {
    if (!node) return "";
    const children = () => (node.content || []).map(render).join("");

    switch (node.type) {
      case "doc":
        return children();
      case "text":
        return renderText(node);
      case "paragraph":
        return `<p${alignAttr(node)}>${children()}</p>`;
      case "heading": {
        const level = Math.min(Math.max(Number(node.attrs?.level) || 2, 2), 6);
        return `<h${level}${alignAttr(node)}>${children()}</h${level}>`;
      }
      case "bulletList":
      case "taskList":
        return `<ul>${children()}</ul>`;
      case "orderedList":
        return `<ol>${children()}</ol>`;
      case "listItem":
      case "taskItem":
        return `<li>${children()}</li>`;
      case "blockquote":
        return `<blockquote>${children()}</blockquote>`;
      case "codeBlock":
        return `<pre><code>${children()}</code></pre>`;
      case "hardBreak":
        return "<br />";
      case "horizontalRule":
        return "<hr />";
      case "image":
        return img(absoluteUrl(imageBase, node.attrs?.src), node.attrs?.alt, ' loading="lazy"');
      case "textBox":
        return `<div class="blog-textbox">${children()}</div>`;
      case "youtube": {
        const id = String(node.attrs?.videoId || "");
        if (!VIDEO_ID_RE.test(id)) return "";
        return `<p><a href="https://www.youtube.com/watch?v=${id}">${img(
          `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
          "YouTube video",
          ' loading="lazy"',
        )}</a></p>`;
      }
      case "ctaSlider":
        return (node.attrs?.ctaIds || [])
          .map((id) => ctaById.get(String(id)))
          .filter(Boolean)
          .map((cta) => {
            const href = safeHref(cta.link);
            const button = href
              ? `<a href="${escapeAttr(href)}">${escapeHtml(cta.buttonText)}</a>`
              : escapeHtml(cta.buttonText);
            return `<aside><p>${escapeHtml(cta.text)}</p>${button}</aside>`;
          })
          .join("");
      default:
        return children();
    }
  };

  return render(doc);
}

/* ── page snapshots ─────────────────────────────────────────────────────── */

const wrap = (inner) =>
  `<main class="seo-snapshot" style="max-width:960px;margin:0 auto;padding:24px 16px;font-family:sans-serif">${inner}</main>`;

const coverImg = (imageBase, path, alt) =>
  path ? img(absoluteUrl(imageBase, path), alt, ' style="max-width:100%;height:auto"') : "";

export function blogBody(blog, { imageBase = "", ctas = [], authorDoctor = null } = {}) {
  if (!blog) return "";
  const doc = parseJson(blog.content);
  const content = doc?.type === "doc"
    ? tiptapToHtml(doc, { imageBase, ctas })
    : cleanHtml(typeof blog.content === "string" ? blog.content : "", imageBase);

  const author = blog.author ? `<p>By ${escapeHtml(blog.author)}</p>` : "";
  const date = blog.date ? `<p><time datetime="${escapeAttr(blog.date)}">${escapeHtml(blog.date)}</time></p>` : "";

  const about = authorDoctor
    ? `<section><h2>About the Author</h2>${coverImg(imageBase, authorDoctor.image, authorDoctor.altText || authorDoctor.name)}<h3>${escapeHtml(authorDoctor.name)}</h3>${
      authorDoctor.qualification ? `<p>${escapeHtml(authorDoctor.qualification)}</p>` : ""
    }${authorDoctor.summary ? `<p>${escapeHtml(plainText(authorDoctor.summary))}</p>` : ""}</section>`
    : "";

  return wrap(
    `<article>${coverImg(imageBase, blog.image, blog.altText || blog.title)}<h1>${escapeHtml(blog.title)}</h1>${author}${date}${content}</article>${about}`,
  );
}

export function serviceBody(service, { imageBase = "" } = {}) {
  if (!service) return "";
  return wrap(
    `<article>${coverImg(imageBase, service.coverImage, service.altText || service.title)}<h1>${escapeHtml(service.title)}</h1>${cleanHtml(service.content, imageBase)}</article>`,
  );
}

const CANCER_SECTIONS = [
  ["overview", "Overview"],
  ["riskFactors", "Risk Factors"],
  ["symptoms", "Symptoms"],
  ["diagnosis", "Diagnosis"],
  ["treatment", "Treatment"],
  ["dosAndDonts", "Do's and Don'ts"],
];

export function cancerBody(cancer, { imageBase = "" } = {}) {
  if (!cancer) return "";
  const sections = CANCER_SECTIONS.filter(([key]) => cancer[key])
    .map(([key, label]) => `<section><h2>${label}</h2>${cleanHtml(cancer[key], imageBase)}</section>`)
    .join("");
  const intro = cancer.description ? `<p>${escapeHtml(plainText(cancer.description))}</p>` : "";
  return wrap(
    `<article>${coverImg(imageBase, cancer.coverImage, cancer.altText || cancer.name)}<h1>${escapeHtml(cancer.name)}</h1>${intro}${sections}</article>`,
  );
}

export function doctorBody(doctor, { imageBase = "" } = {}) {
  if (!doctor) return "";
  const p = (v) => (v ? `<p>${escapeHtml(plainText(v))}</p>` : "");
  return wrap(
    `<article>${coverImg(imageBase, doctor.image, doctor.altText || doctor.name)}<h1>${escapeHtml(doctor.name)}</h1>${p(doctor.designation)}${p(doctor.qualification)}${p(doctor.summary)}${p(doctor.philosophy)}</article>`,
  );
}

export function centerBody(center, { imageBase = "" } = {}) {
  if (!center) return "";
  const name = center.fullName || center.name;
  const heroAlt = center.heroImageAltText || name;
  const centreAlt = center.centerImageAltText || center.name;
  const p = (v) => (v ? `<p>${escapeHtml(plainText(v))}</p>` : "");
  return wrap(
    `<article>${coverImg(imageBase, center.heroImage, heroAlt)}<h1>${escapeHtml(name)}</h1>${p(center.description)}${p(center.address)}${
      center.phone ? `<p>Phone: ${escapeHtml(center.phone)}</p>` : ""
    }${coverImg(imageBase, center.centerImage, centreAlt)}</article>`,
  );
}
