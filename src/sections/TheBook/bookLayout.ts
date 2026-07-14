import type { BookCovers } from '../../content/bookGallery'
import type { BookFace } from '../../content/types'
import type { SheetFace } from './pageTextures'

/**
 * Pure page math for The Book: fold the flat face list from bookGallery
 * into physical sheets (front = right-hand page, back = left-hand page),
 * wrapped in the two cover boards. Cover screenshots slot in when provided;
 * otherwise the generated replica cover is painted.
 */

/**
 * Landscape page size (world units), matched to the real album's scans
 * (cover 1171×819, pages ≈1391×969 → aspect ≈ 1.43).
 */
export const PAGE_WIDTH = 1.3
export const PAGE_HEIGHT = 0.91
/** Visual thickness of one sheet in the stack. */
export const SHEET_GAP = 0.003
/** Slack between the spiral rings and the punched page edge. */
export const HINGE_GAP = 0.018

export type Sheet = {
  front: SheetFace
  back: SheetFace
  isCover: boolean
}

export function buildSheets(faces: BookFace[], covers: BookCovers): Sheet[] {
  const sheets: Sheet[] = [
    {
      front: { kind: 'cover', cover: 'front', src: covers.front },
      back: { kind: 'blank' },
      isCover: true,
    },
  ]
  for (let i = 0; i < faces.length; i += 2) {
    sheets.push({
      front: faces[i],
      back: faces[i + 1] ?? { kind: 'blank' },
      isCover: false,
    })
  }
  sheets.push({
    front: { kind: 'blank' },
    back: { kind: 'cover', cover: 'back', src: covers.back },
    isCover: true,
  })
  return sheets
}
