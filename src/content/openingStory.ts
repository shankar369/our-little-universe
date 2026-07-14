import { publicAssetPath } from '../shared/lib/assetPath'
import { heroTestPhotos } from './testPhotos'

/**
 * Build-time photo discovery for the opening "story of you" act: drop images
 * into `src/content/openingPhotos/group1|group2|group3/` and the matching
 * verse picks them up automatically — no path lists to maintain. Name-sorted,
 * so `01.jpg`, `02.jpg`, ... control the order within a verse.
 */
const photoModules = import.meta.glob(
  './openingPhotos/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>

/** The verse choreographies are composed for at most this many photos. */
export const MAX_VERSE_PHOTOS = 4

const photosByFolder: Record<string, string[]> = (() => {
  const grouped: Record<string, string[]> = {}

  for (const [key, url] of Object.entries(photoModules)) {
    const match = key.match(/\.\/openingPhotos\/([^/]+)\//)
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
 * Resolved photo URLs for one verse (first `MAX_VERSE_PHOTOS`, name-sorted).
 * TEMP: while a folder is empty, the hero test photos are cycled so the
 * scroll choreography can be felt before the real photos land.
 */
export function getOpeningStoryPhotos(folder: string, fallbackCount = 3): string[] {
  const photos = photosByFolder[folder]
  if (photos && photos.length > 0) {
    return photos.slice(0, MAX_VERSE_PHOTOS)
  }

  return Array.from({ length: fallbackCount }, (_, index) =>
    publicAssetPath(heroTestPhotos[index % heroTestPhotos.length]),
  )
}

/** Warm pastel placeholders that sit behind loading / missing verse photos. */
export const openingStoryGradients = [
  'from-[#e9c8fc] via-[#fbd3e3] to-[#f8e3bd]',
  'from-[#d4c2fc] via-[#ecd5fc] to-[#fbd3e3]',
  'from-[#c4b8f8] via-[#e9c8fc] to-[#fbd9d3]',
  'from-[#f8d9c4] via-[#fbd3e3] to-[#e9c8fc]',
]
