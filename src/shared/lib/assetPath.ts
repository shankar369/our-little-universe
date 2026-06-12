/**
 * Prefix a public-folder path with the Vite base URL (e.g. /our-little-universe/).
 * Content files store logical paths like `/memoryTimeline/memory-01.jpg`.
 */
export function publicAssetPath(path: string) {
  const base = import.meta.env.BASE_URL
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${base}${normalized}`
}
