import { publicAssetPath } from '../shared/lib/assetPath'
import type { JourneyPlace } from './types'
import { heroTestPhotos } from './testPhotos'

/**
 * Build-time photo discovery.
 *
 * Every image dropped into `src/content/journeyPhotos/<folder>/` is picked up
 * automatically by Vite's glob import — authors never edit a path list. The keys
 * look like `./journeyPhotos/goa/01.jpg`; we group the resolved URLs by folder.
 */
const photoModules = import.meta.glob(
  './journeyPhotos/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>

const photosByFolder: Record<string, string[]> = (() => {
  const grouped: Record<string, string[]> = {}

  for (const [key, url] of Object.entries(photoModules)) {
    const match = key.match(/\.\/journeyPhotos\/([^/]+)\//)
    if (!match) {
      continue
    }

    const folder = match[1]
    ;(grouped[folder] ??= []).push(url)
  }

  // Stable, name-sorted order so `01.jpg`, `02.jpg`, ... stay in sequence.
  for (const folder of Object.keys(grouped)) {
    grouped[folder].sort((first, second) => first.localeCompare(second))
  }

  return grouped
})()

// TEMP: hero photos to show for places whose folder is still empty (for testing).
const heroTestUrls = heroTestPhotos.map(publicAssetPath)

/** Resolved, ready-to-use photo URLs for a place folder. */
export function getPlacePhotos(folder: string): string[] {
  const photos = photosByFolder[folder]
  if (photos && photos.length > 0) {
    return photos
  }

  // TEMP: fall back to the shared hero test photos until real ones are dropped in.
  return heroTestUrls
}

/** Default framing: the whole of India, before any place is chosen. */
export const indiaDefaultView = {
  center: [80.9, 22.5] as [number, number],
  zoom: 3.7,
}

/** Zoom level the map flies to when a single place is focused. */
export const placeFocusZoom = 10.5

/**
 * Sample places — edit freely. Each `folder` maps to
 * `src/content/journeyPhotos/<folder>/`; drop photos there and they appear.
 */
export const ourLittleAtlasPlaces = [
  {
    id: 'goa',
    name: 'Goa',
    note: 'where the sea kept all our secrets',
    region: 'by the Arabian Sea',
    lat: 15.2993,
    lng: 74.124,
    folder: 'goa',
    dateLabel: 'Dec 2024',
  },
  {
    id: 'manali',
    name: 'Manali',
    note: 'cold air, warm hands, zero complaints',
    region: 'in the Himalayas',
    lat: 32.2432,
    lng: 77.1892,
    folder: 'manali',
    dateLabel: 'Feb 2025',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    note: 'pink walls and one very pink heart',
    region: 'the rose city',
    lat: 26.9124,
    lng: 75.7873,
    folder: 'jaipur',
    dateLabel: 'Apr 2025',
  },
  {
    id: 'munnar',
    name: 'Munnar',
    note: 'green hills that watched us laugh',
    region: 'the Western Ghats',
    lat: 10.0889,
    lng: 77.0595,
    folder: 'munnar',
    dateLabel: 'Jul 2025',
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    note: 'a thousand lamps, one wish',
    region: 'on the Ganga',
    lat: 25.3176,
    lng: 82.9739,
    folder: 'varanasi',
    dateLabel: 'Oct 2025',
  },
] satisfies JourneyPlace[]
