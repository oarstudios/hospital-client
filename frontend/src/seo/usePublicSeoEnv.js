export default function usePublicSeoEnv() {
  const siteUrl =
    import.meta.env.VITE_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const imageBase = import.meta.env.VITE_IMAGE_BASE_URL || "";
  return { siteUrl, imageBase };
}
