import { publicAssetPath } from '../shared/lib/assetPath'
import type { PhotoUniverseItem } from './types'
import { heroTestPhotos } from './testPhotos'

/**
 * Build-time photo discovery: drop any image into `src/content/photoUniversePhotos/`
 * and it becomes a planet — no path list to maintain. Name-sorted, so `01.jpg`,
 * `02.jpg`, ... control the orbit order (any filename works if order doesn't matter).
 */
const photoModules = import.meta.glob(
  './photoUniversePhotos/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>

const discoveredPhotos = Object.entries(photoModules)
  .sort(([first], [second]) => first.localeCompare(second))
  .map(([, url]) => url)

// TEMP: cycle the hero test photos until real photos land in the folder above.
const universePhotos =
  discoveredPhotos.length > 0 ? discoveredPhotos : heroTestPhotos.map(publicAssetPath)

const universeNames = [
  'Moonlit Smile',
  'Tiny Spark',
  'Velvet Laugh',
  'Secret Signal',
  'Blush Orbit',
  'Birthday Wish',
  'Soft Gravity',
  'Golden Pause',
  'Purple Hour',
  'Hidden Giggle',
  'Cozy Comet',
  'Sweet Static',
  'First Glance',
  'Little Miracle',
  'Honey Light',
  'Forever Hint',
  'Starlit Proof',
  'Pocket Sun',
  'Quiet Firework',
  'Magic Detour',
  'Rose Glow',
  'Lucky Planet',
  'Tender Chaos',
  'Warm Eclipse',
  'Dream Receipt',
  'Sparkle Note',
  'Midnight Song',
  'Tiny Thunder',
  'Love Signal',
  'Birthday Beam',
  'Soft Mischief',
  'Orbit Kiss',
  'Glow Season',
  'Memory Dust',
  'Sweet Collision',
  'Wild Calm',
  'Cosmic Proof',
  'Little Spell',
  'Secret Cake',
  'Heart Compass',
  'Velvet Planet',
  'Laugh Loop',
  'Soft Supernova',
  'Wish Thread',
  'Purple Bloom',
  'Golden Echo',
  'Dream Orbit',
  'Happy Static',
  'Forever Dot',
  'Our Signal',
]

function padOrder(order: number) {
  return String(order).padStart(2, '0')
}

const hasRealPhotos = discoveredPhotos.length > 0

export const photoUniverseItems = universePhotos.map((photo, index) => {
  const order = index + 1
  const label = `Orbit ${padOrder(order)}`
  const name = universeNames[index % universeNames.length]

  return {
    id: `photo-universe-${padOrder(order)}`,
    order,
    orbitBand: order % 3 === 0 ? 'outer' : order % 3 === 1 ? 'middle' : 'inner',
    photo,
    heading: name,
    name,
    label,
    quote: hasRealPhotos
      ? 'A tiny photo planet, holding one real memory.'
      : 'A tiny photo planet waiting for the real memory to land here.',
    text: hasRealPhotos
      ? 'One little orbit, one real picture — a moment kept close in its own corner of the sky.'
      : 'One day this little orbit will hold a real picture and a softer line than we can write in advance.',
    story: hasRealPhotos
      ? 'This planet is real now — warm, close, and exactly where it belongs.'
      : 'For now it is a placeholder planet — warm, patient, and ready the moment the real photo arrives.',
    alt: hasRealPhotos ? `${name} photo universe memory` : `${name} placeholder photo universe memory`,
  }
}) satisfies PhotoUniverseItem[]

export const orderedPhotoUniverseItems = [...photoUniverseItems].sort(
  (first, second) => first.order - second.order,
)
