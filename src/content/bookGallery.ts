import { publicAssetPath } from '../shared/lib/assetPath'
import { heroTestPhotos } from './testPhotos'
import type { BookFace } from './types'

/**
 * Build-time page discovery for The Book — a digital replica of the real
 * spiral-bound scrapbook. Drop full-page screenshots of the original album
 * into `src/content/bookPages/` and they bind themselves in name order
 * (`01.jpg`, `02.jpg`, ... control reading order). Each screenshot IS a page:
 * it renders full-bleed, handwriting and stickers included.
 *
 * Special filenames:
 * - `cover.*` (any name containing "cover") → the front cover board.
 * - a name containing both "cover" and "back" → the back cover board.
 * - a name containing `spread` → split across two facing pages.
 */
const photoModules = import.meta.glob(
  './bookPages/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>

const allEntries = Object.entries(photoModules).sort(([first], [second]) =>
  first.localeCompare(second),
)

const frontCoverEntry = allEntries.find(
  ([path]) => /cover/i.test(path) && !/back/i.test(path),
)
const backCoverEntry = allEntries.find(
  ([path]) => /cover/i.test(path) && /back/i.test(path),
)
const pageEntries = allEntries.filter(
  (entry) => entry !== frontCoverEntry && entry !== backCoverEntry,
)

/** Keep the album liftable — more faces than this and it becomes a tome. */
const MAX_FACES = 40

/**
 * The real album is decorated on both sides of each sheet, so screenshots
 * alternate left/right pages as you flip. Flip this to true if only one
 * side of each physical page is decorated — every screenshot then gets a
 * plain black back.
 */
const SINGLE_SIDED = false

export type BookCovers = {
  front?: string
  back?: string
}

/** Cover screenshots, when provided; the generated replica fills any gap. */
export function getBookCovers(): BookCovers {
  return {
    front: frontCoverEntry?.[1],
    back: backCoverEntry?.[1],
  }
}

/**
 * Raw page URLs, used by the reduced-motion / no-WebGL album fallback.
 * TEMP: while the folder is empty, the hero test photos are cycled so the
 * book can be flipped before the real scans land.
 */
export function getBookPhotos(fallbackCount = 10): string[] {
  if (pageEntries.length > 0) {
    return pageEntries.map(([, url]) => url).slice(0, MAX_FACES)
  }
  return Array.from({ length: fallbackCount }, (_, index) =>
    publicAssetPath(heroTestPhotos[index % heroTestPhotos.length]),
  )
}

/**
 * The ordered page faces of the book (covers excluded — the section adds
 * those boards itself). Facing pages are the pairs (back of sheet N, front
 * of sheet N+1), i.e. odd/even face indices, which is what the spread
 * alignment leans on.
 */
export function getBookFaces(fallbackCount = 10): BookFace[] {
  const faces: BookFace[] = []

  const push = (face: BookFace) => {
    if (faces.length < MAX_FACES) {
      faces.push(face)
    }
  }

  if (pageEntries.length === 0) {
    for (const src of getBookPhotos(fallbackCount)) {
      push({ kind: 'photo', src })
    }
    return faces
  }

  for (const [path, src] of pageEntries) {
    if (/spread/i.test(path)) {
      // A spread's left half must land on a left-hand page (odd face index)
      // so both halves are visible at once; pad with black paper if not.
      if (faces.length % 2 === 0) {
        push({ kind: 'blank' })
      }
      push({ kind: 'photo', src, half: 'left' })
      push({ kind: 'photo', src, half: 'right' })
    } else {
      push({ kind: 'photo', src })
      if (SINGLE_SIDED) {
        push({ kind: 'blank' })
      }
    }
  }

  return faces
}
