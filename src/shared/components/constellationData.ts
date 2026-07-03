/**
 * Hand-authored constellation letterforms for the ambient sky.
 *
 * Each glyph lives in a normalised `0 0 100 140` box: `stars` are the points,
 * `segments` are index pairs drawn as faint connecting lines. Anchors render
 * champagne and slightly brighter — the "named stars" of each constellation.
 * Tuning the artwork = nudging these numbers.
 */
export type ConstellationStar = {
  x: number
  y: number
  /** Core radius in viewBox units (halo is 3×). */
  r: number
  /** Champagne "named star". */
  anchor?: boolean
}

export type ConstellationGlyphData = {
  stars: ConstellationStar[]
  segments: [number, number][]
}

/** One placed glyph inside a composite constellation. */
export type ConstellationPart = {
  glyph: ConstellationGlyphData
  /** SVG transform placing the glyph inside the composite viewBox. */
  transform?: string
}

export const GLYPH_N: ConstellationGlyphData = {
  stars: [
    { x: 16, y: 126, r: 1.6 },
    { x: 16, y: 69, r: 1 },
    { x: 16, y: 12, r: 2.2, anchor: true },
    { x: 39, y: 50, r: 1 },
    { x: 61, y: 88, r: 1.6 },
    { x: 84, y: 126, r: 2.2, anchor: true },
    { x: 84, y: 69, r: 1 },
    { x: 84, y: 12, r: 1.6 },
  ],
  segments: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
  ],
}

export const GLYPH_S: ConstellationGlyphData = {
  stars: [
    { x: 74, y: 26, r: 2.2, anchor: true },
    { x: 48, y: 12, r: 1 },
    { x: 24, y: 32, r: 1.6 },
    { x: 44, y: 60, r: 1 },
    { x: 58, y: 80, r: 1.6 },
    { x: 74, y: 106, r: 1 },
    { x: 50, y: 126, r: 1.6 },
    { x: 24, y: 110, r: 2.2, anchor: true },
  ],
  segments: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
  ],
}

export const GLYPH_HEART: ConstellationGlyphData = {
  stars: [
    { x: 50, y: 48, r: 1 },
    { x: 30, y: 28, r: 1.6 },
    { x: 12, y: 54, r: 1 },
    { x: 50, y: 120, r: 2.2, anchor: true },
    { x: 88, y: 54, r: 1 },
    { x: 70, y: 28, r: 1.6 },
  ],
  segments: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 0],
  ],
}

/** Single-letter constellations. */
export const CONSTELLATION_N: ConstellationPart[] = [{ glyph: GLYPH_N }]
export const CONSTELLATION_S: ConstellationPart[] = [{ glyph: GLYPH_S }]
export const LETTER_VIEWBOX = '0 0 100 140'

/** The N ♥ S sigil — the signature constellation. */
export const CONSTELLATION_SIGIL: ConstellationPart[] = [
  { glyph: GLYPH_N, transform: 'translate(4 28) scale(0.6)' },
  { glyph: GLYPH_HEART, transform: 'translate(100 32) scale(0.58)' },
  { glyph: GLYPH_S, transform: 'translate(196 28) scale(0.6)' },
]
export const SIGIL_VIEWBOX = '0 0 260 140'
