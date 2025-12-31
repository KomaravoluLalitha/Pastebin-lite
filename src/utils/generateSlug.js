//generaeslug.js
export function generateSlug(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
}
