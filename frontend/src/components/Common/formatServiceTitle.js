const SUFFIX = "At Indian Cancer Treatment Centre";

/**
 * Public service titles: "{Service} At Indian Cancer Treatment Centre"
 */
export default function formatServiceTitle(title) {
  if (!title) return "";
  const trimmed = String(title).trim();
  if (!trimmed) return "";
  if (trimmed.toLowerCase().endsWith(SUFFIX.toLowerCase())) return trimmed;
  return `${trimmed} ${SUFFIX}`;
}
