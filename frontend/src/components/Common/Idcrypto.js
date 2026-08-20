/**
 * Reversible salted ID tokens for URLs.
 * Output is a short 12-char alphanumeric token, e.g. "kQ9mPxZ2bDeF".
 *
 *   encryptId(42)              → "kQ9mPxZ2bDeF"
 *   resolveUrlId(params.id)    → 42
 */

const SALT = "ictc@2025#secure";
const PAYLOAD_LEN = 8;
const TOKEN_LEN = 12;
const ALPHA = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = 62n;

function xorBytes(str, key) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return bytes;
}

function xorBack(bytes, key) {
  return bytes
    .map((b, i) => String.fromCharCode(b ^ key.charCodeAt(i % key.length)))
    .join("");
}

function toAlpha(bytes) {
  let n = 0n;
  for (const b of bytes) n = (n << 8n) + BigInt(b);
  let out = "";
  for (let i = 0; i < TOKEN_LEN; i++) {
    out = ALPHA[Number(n % BASE)] + out;
    n /= BASE;
  }
  return out;
}

function fromAlpha(str) {
  let n = 0n;
  for (const ch of str) {
    const idx = ALPHA.indexOf(ch);
    if (idx < 0) throw new Error("invalid token");
    n = n * BASE + BigInt(idx);
  }
  const bytes = [];
  for (let i = 0; i < PAYLOAD_LEN; i++) {
    bytes.unshift(Number(n & 0xffn));
    n >>= 8n;
  }
  return bytes;
}

function toHex(bytes) {
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex) {
  const clean = hex.replace(/[^0-9a-f]/gi, "");
  if (clean.length % 2 !== 0) throw new Error("invalid hex");
  const bytes = [];
  for (let i = 0; i < clean.length; i += 2) {
    bytes.push(parseInt(clean.slice(i, i + 2), 16));
  }
  return bytes;
}

function fromBase64Url(b64url) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  return Array.from(binary, (c) => c.charCodeAt(0));
}

function padPayload(idStr) {
  const header = idStr.length.toString(16).padStart(2, "0");
  let padded = header + idStr;
  let i = 0;
  while (padded.length < PAYLOAD_LEN) {
    padded += SALT[i % SALT.length];
    i += 1;
  }
  return padded.slice(0, PAYLOAD_LEN);
}

function unpackPayload(padded) {
  const len = parseInt(padded.slice(0, 2), 16);
  if (!Number.isFinite(len) || len < 1 || len > PAYLOAD_LEN - 2) return null;
  return padded.slice(2, 2 + len);
}

function idFromPaddedBytes(bytes) {
  const str = unpackPayload(xorBack(bytes, SALT));
  const num = Number(str);
  return Number.isFinite(num) ? num : null;
}

/** Encrypt an id into a 12-char alphanumeric salted token. */
export function encryptId(id) {
  if (id === null || id === undefined || id === "") return "";
  return toAlpha(xorBytes(padPayload(String(id)), SALT));
}

/** Decrypt a URL token. Supports alphanumeric tokens and older hex/base64 formats. */
export function decryptId(token) {
  if (!token) return null;

  try {
    if (/^[a-zA-Z0-9]{12}$/.test(token)) {
      return idFromPaddedBytes(fromAlpha(token));
    }
  } catch {
    /* fall through */
  }

  try {
    if (/^[0-9a-f]{16}$/i.test(token) || /^[0-9a-f]{64}$/i.test(token)) {
      return idFromPaddedBytes(fromHex(token));
    }
  } catch {
    /* fall through */
  }

  try {
    const str = xorBack(fromBase64Url(token), SALT);
    const num = Number(str);
    return Number.isFinite(num) ? num : null;
  } catch {
    return null;
  }
}

/** Read an id from a URL param (alphanumeric token, old hex, or plain numeric id). */
export function resolveUrlId(param) {
  if (param === null || param === undefined || param === "") return null;
  const token = String(param);

  if (/^[a-zA-Z0-9]{12}$/.test(token)) return decryptId(token);
  if (/^[0-9a-f]{16}$/i.test(token) || /^[0-9a-f]{64}$/i.test(token)) {
    return decryptId(token);
  }
  if (/^\d+$/.test(token) && token.length <= 12) return Number(token);

  return decryptId(token);
}
