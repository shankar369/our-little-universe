import { publicAssetPath } from '../shared/lib/assetPath'
import type { JourneyPlace } from './types'
import { heroTestPhotos } from './testPhotos'

/**
 * Build-time photo discovery.
 *
 * Every image dropped into `src/content/journeyPhotos/<folder>/` is picked up
 * automatically by Vite's glob import — authors never edit a path list. The keys
 * look like `./journeyPhotos/kakinada/01.jpg`; we group the resolved URLs by folder.
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
 * Our places — edit freely. Each `folder` maps to
 * `src/content/journeyPhotos/<folder>/`; drop photos there and they appear.
 */
export const ourLittleAtlasPlaces = [
  {
    id: 'samarlakota',
    name: 'Samarlakota',
    note: 'memories landing here soon',
    region: 'Kakinada district, Andhra Pradesh',
    lat: 17.05,
    lng: 82.1833,
    folder: 'samarlakota',
  },
  {
    id: 'ramachandrapuram',
    name: 'Ramachandrapuram',
    note: 'memories landing here soon',
    region: 'East Godavari, Andhra Pradesh',
    lat: 16.8361,
    lng: 82.0286,
    folder: 'ramachandrapuram',
  },
  {
    id: 'kakinada',
    name: 'Kakinada',
    note: 'memories landing here soon',
    region: 'Andhra Pradesh',
    lat: 16.9604,
    lng: 82.2381,
    folder: 'kakinada',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    note: 'memories landing here soon',
    region: 'Telangana',
    lat: 17.385,
    lng: 78.4867,
    folder: 'hyderabad',
  },
  {
    id: 'yadadri',
    name: 'Yadadri',
    note: 'memories landing here soon',
    region: 'Sri Lakshmi Narasimha Swamy Temple',
    lat: 17.5892,
    lng: 78.9446,
    folder: 'yadadri',
  },
] satisfies JourneyPlace[]
