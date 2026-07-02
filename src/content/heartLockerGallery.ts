import { publicAssetPath } from '../shared/lib/assetPath'
import { heroTestPhotos } from './testPhotos'

/**
 * Build-time photo discovery for the Heart Locker acts, mirroring the atlas
 * pattern: drop images into `src/content/heartLockerPhotos/<folder>/` and they
 * appear in that act — no path lists to maintain.
 */
const photoModules = import.meta.glob(
  './heartLockerPhotos/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>

const photosByFolder: Record<string, string[]> = (() => {
  const grouped: Record<string, string[]> = {}

  for (const [key, url] of Object.entries(photoModules)) {
    const match = key.match(/\.\/heartLockerPhotos\/([^/]+)\//)
    if (!match) {
      continue
    }
    ;(grouped[match[1]] ??= []).push(url)
  }

  // Stable, name-sorted order so `01.jpg`, `02.jpg`, ... stay in sequence.
  for (const folder of Object.keys(grouped)) {
    grouped[folder].sort((first, second) => first.localeCompare(second))
  }

  return grouped
})()

/**
 * Resolved photo URLs for one act. TEMP: while a folder is empty, the hero test
 * photos are cycled so the scroll choreography can be felt before real photos land.
 */
export function getHeartLockerPhotos(folder: string, fallbackCount = 6): string[] {
  const photos = photosByFolder[folder]
  if (photos && photos.length > 0) {
    return photos
  }

  return Array.from({ length: fallbackCount }, (_, index) =>
    publicAssetPath(heroTestPhotos[index % heroTestPhotos.length]),
  )
}
