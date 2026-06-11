import type { PhotoUniverseItem } from './types'

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
    photo: `/photoUniverse/universe-${padOrder(order)}.jpg`,
    heading: name,
    name,
    label,
    quote: 'A tiny photo planet waiting for the real memory to land here.',
    text: 'Replace this placeholder with the note, joke, or soft little detail that belongs to this photo.',
    story:
      'This Photo Universe entry is ready for a real picture. Add the image to public/photoUniverse, keep the file name in this content file, and the sphere will turn it into a tappable memory.',
    alt: `${name} placeholder photo universe memory`,
  }
}) satisfies PhotoUniverseItem[]

export const orderedPhotoUniverseItems = [...photoUniverseItems].sort(
  (first, second) => first.order - second.order,
)
