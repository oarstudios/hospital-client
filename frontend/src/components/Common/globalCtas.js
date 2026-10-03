import { useEffect, useSyncExternalStore } from "react";
import axiosInstance from "../../app/axiosinstance";

/* ──────────────────────────────────────────────────────────────────────────
 * Site-wide CTAs (managed under Admin → Others, stored via GET /others).
 * One shared cache so the blog editor, admin preview and public blog page
 * all read the same list and refresh together.
 * ────────────────────────────────────────────────────────────────────────── */

let cache = null; // null = not loaded yet
let inflight = null;
const listeners = new Set();

export const normalizeCtas = (raw) =>
  (Array.isArray(raw) ? raw : [])
    .filter((c) => c && c.id && c.text && c.buttonText)
    .map((c) => ({
      id: String(c.id),
      text: String(c.text),
      buttonText: String(c.buttonText),
      link: String(c.link || ""),
    }));

export function setGlobalCtas(list) {
  cache = normalizeCtas(list);
  listeners.forEach((listener) => listener());
}

export function loadGlobalCtas({ force = false } = {}) {
  if (!force && cache) return Promise.resolve(cache);
  if (inflight) return inflight;

  inflight = axiosInstance
    .get("/others")
    .then((res) => {
      const payload = res?.data?.data ?? res?.data ?? {};
      setGlobalCtas(payload.ctas);
      return cache;
    })
    .catch(() => {
      if (!cache) setGlobalCtas([]);
      return cache;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** { ctas, loading } — loads the list on first use. */
export function useGlobalCtas() {
  const ctas = useSyncExternalStore(subscribe, () => cache);
  useEffect(() => {
    loadGlobalCtas();
  }, []);
  return { ctas: ctas || [], loading: ctas === null };
}

/** Resolve ids → CTA objects, keeping the given order and skipping deleted ones. */
export const pickCtas = (ctas, ids = []) => {
  const byId = new Map(ctas.map((c) => [c.id, c]));
  return ids.map((id) => byId.get(id)).filter(Boolean);
};

/* ── Link helpers ───────────────────────────────────────────────────────── */

/**
 * Normalises a CTA link so it is always safe to put in an href.
 * "/BookAppoinment" → internal route, "example.com" → "https://example.com",
 * javascript:/data: etc. → "#".
 */
export function safeHref(link) {
  const value = String(link || "").trim();
  if (!value) return "#";
  if (value.startsWith("/") || value.startsWith("#")) return value;
  if (/^(https?:|mailto:|tel:)/i.test(value)) return value;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return "#";
  return `https://${value}`;
}

export const isInternalHref = (href) => href.startsWith("/") && !href.startsWith("//");
