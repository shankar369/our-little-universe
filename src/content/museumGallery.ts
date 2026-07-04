import { publicAssetPath } from '../shared/lib/assetPath'
import { heroTestPhotos } from './testPhotos'

/**
 * Build-time photo discovery for the mUSeum walls: drop images into
 * `src/content/museumPhotos/` and they hang themselves — no path lists to
 * maintain. Name-sorted, so `01.jpg`, `02.jpg`, ... control the hanging order.
 */
const photoModules = import.meta.glob(
  './museumPhotos/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>

const museumPhotos = Object.entries(photoModules)
  .sort(([first], [second]) => first.localeCompare(second))
  .map(([, url]) => url)

/** Keep the hall walkable — more photos than this makes it a marathon. */
const MAX_PHOTOS = 16

/**
 * Resolved photo URLs for the museum walls. TEMP: while the folder is empty,
 * the hero test photos are cycled so the gallery can be walked before real
 * photos land.
 */
export function getMuseumPhotos(fallbackCount = 10): string[] {
  if (museumPhotos.length > 0) {
    return museumPhotos.slice(0, MAX_PHOTOS)
  }

  return Array.from({ length: fallbackCount }, (_, index) =>
    publicAssetPath(heroTestPhotos[index % heroTestPhotos.length]),
  )
}
