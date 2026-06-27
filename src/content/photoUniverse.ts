import type { PhotoUniverseItem } from './types'
import { heroTestPhotos } from './testPhotos'

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

export const photoUniverseItems = universeNames.map((name, index) => {
  const order = index + 1
  const label = `Orbit ${padOrder(order)}`

  return {
    id: `photo-universe-${padOrder(order)}`,
    order,
    orbitBand: order % 3 === 0 ? 'outer' : order % 3 === 1 ? 'middle' : 'inner',
    // TEMP: cycle the 3 hero photos for testing until real photos land in
    // /photoUniverse/universe-XX.jpg.
    photo: heroTestPhotos[index % heroTestPhotos.length],
    heading: name,
    name,
    label,
    quote: 'A tiny photo planet waiting for the real memory to land here.',
    text: 'One day this little orbit will hold a real picture and a softer line than we can write in advance.',
    story:
      'For now it is a placeholder planet — warm, patient, and ready the moment the real photo arrives.',
    alt: `${name} placeholder photo universe memory`,
  }
}) satisfies PhotoUniverseItem[]

export const orderedPhotoUniverseItems = [...photoUniverseItems].sort(
  (first, second) => first.order - second.order,
)
