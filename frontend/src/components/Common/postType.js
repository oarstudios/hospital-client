/** Public label for a post type. Newsletter is always shown as News. */
export const displayPostType = (item) => {
  const t = String(item?.type || "Blog").trim();
  if (/^news(letter)?$/i.test(t)) return "News";
  return t || "Blog";
};

export const isNewsPost = (item) => displayPostType(item) === "News";

export const sortByDateDesc = (items) =>
  [...items].sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return dateB - dateA;
  });
