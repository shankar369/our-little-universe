/**
 * Prefix a public-folder path with the Vite base URL (e.g. /our-little-universe/).
 * Content files store logical paths like `/memoryTimeline/memory-01.jpg`.
 *
 * Idempotent: URLs that already carry the base (e.g. resolved `import.meta.glob`
 * asset URLs from `src/content/**`) or absolute/data URLs pass through unchanged,
 * so callers don't need to know whether a `photo` field came from a public path
 * or a build-time glob import.
 */
export function publicAssetPath(path: string) {
  const base = import.meta.env.BASE_URL
  if (path.startsWith(base) || /^(https?:)?\/\//.test(path) || path.startsWith('data:')) {
    return path
  }
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${base}${normalized}`
}
