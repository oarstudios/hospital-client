/**
 * Public UI helper: always show review counts as "{n}+ Reviews".
 * Accepts admin/API values like "500", "500+", "500+ Ratings", "500+ Reviews".
 */
export default function formatReviews(reviews) {
  if (reviews === null || reviews === undefined || reviews === "") return "";

  const count = String(reviews)
    .replace(/ratings?/gi, "")
    .replace(/reviews?/gi, "")
    .replace(/\+/g, "")
    .replace(/\|/g, "")
    .trim();

  if (!count) return "";
  return `${count}+ Reviews`;
}
