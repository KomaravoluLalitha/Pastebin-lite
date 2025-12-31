export function isExpired(paste) {
  if (paste.expiresAt && new Date() > paste.expiresAt) return true;
  if (paste.maxViews && paste.views >= paste.maxViews) return true;
  return false;
}
