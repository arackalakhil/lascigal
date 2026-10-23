/**
 * Resolves any relative media path to the Cloudflare R2 public URL.
 * If already an absolute http(s) URL, passes through unchanged.
 */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const base = process.env.NEXT_PUBLIC_MEDIA_BASE?.replace(/\/$/, '') || '';
  const cleanPath = path.replace(/^\//, '');
  return `${base}/${cleanPath}`;
}
