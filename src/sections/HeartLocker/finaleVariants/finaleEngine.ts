import { useEffect, useState } from 'react'
import * as THREE from 'three'

/**
 * The shared engine behind every finale variant: rasterise a typeface into
 * point clouds, author the target sets (the "Navya" word, the ash, the hero N
 * and its S counterpart, the final "Navya's Sankar" line), and keep the
 * canonical eight-beat timeline in ONE place so every variant — whatever its
 * font or material — performs the exact same scroll-driven choreography:
 *
 *   embers appear → "Navya" forms → a-v-y-a blow away → the N flips (x→π)
 *   → turns 90° CW (z→−π/2) → settles as the S → the line lands.
 *
 * There is no separate "S" letterform swapped in underfoot: the hero swarm
 * keeps its own N silhouette, and the flip∘turn rig (HeroRig) alone is what
 * turns it into the S. Whatever shape a font's N naturally becomes after
 * that rigid transform IS the S — the "morph" targets are simply the N
 * targets again, so the blend is a no-op and nothing swaps shape underfoot.
 *
 * Each variant declares its own typeface (`VariantFont`); the engine forces
 * the webfont to load (fonts used only on canvas never load by themselves).
 */

export const WORD = 'Navya'
export const LINE = 'Navya’s Sankar'
export const LINE_S_INDEX = 8
const FONT_PX = 200

export const FINALE_CAMERA_Z = 10
export const FINALE_FOV = 50

export type FinaleVariantProps = {
  progress: import('motion/react').MotionValue<number>
  /** Particle budget multiplier (1 = production). */
  density?: number
}

export type VariantFont = {
  /** CSS font prefix before the size, e.g. 'italic 700' or '400'. */
  prefix: string
  /** Family stack used once the webfont is ready. */
  family: string
  /** Stack used while the webfont loads (system fonts). */
  fallback: string
  /** FontFaceSet.load() spec that forces the webfont fetch. */
  loadSpec: string
}

// ---------------------------------------------------------------------------
// Beats — the one true timeline
// ---------------------------------------------------------------------------

export type FinaleBeats = {
  appear: number
  form: number
  ash: number
  zoom: number
  flip: number
  turn: number
  morph: number
  line: number
}

export function finaleBeats(p: number): FinaleBeats {
  const seg = (a: number, b: number) => THREE.MathUtils.smoothstep(p, a, b)
  return {
    appear: seg(0.02, 0.09),
    form: seg(0.06, 0.2),
    ash: seg(0.24, 0.36),
    zoom: seg(0.24, 0.38),
    flip: seg(0.42, 0.5),
    turn: seg(0.54, 0.62),
    morph: seg(0.64, 0.745),
    line: seg(0.78, 0.885),
  }
}

/** How much the swarm is "between shapes" — variants use it to stir motion. */
export function beatChurn(beats: FinaleBeats): number {
  const between = (v: number) => v * (1 - v)
  return (
    between(beats.form) +
    between(beats.ash) +
    between(beats.morph) +
    between(beats.line)
  )
}

// ---------------------------------------------------------------------------
// Text sampling
// ---------------------------------------------------------------------------

export type CharCloud = {
  points: [number, number][]
  center: [number, number]
  width: number
  height: number
}

const sampleCanvas =
  typeof document !== 'undefined' ? document.createElement('canvas') : null

export function sampleText(
  text: string,
  worldSize: number,
  fitBy: 'width' | 'height',
  centerY: number,
  fontCss: string,
): (CharCloud | null)[] {
  if (!sampleCanvas) {
    return text.split('').map(() => null)
  }
  const ctx = sampleCanvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    return text.split('').map(() => null)
  }

  ctx.font = fontCss
  const fullWidth = Math.ceil(ctx.measureText(text).width)
  const canvasWidth = fullWidth + FONT_PX
  const canvasHeight = Math.ceil(FONT_PX * 1.7)
  sampleCanvas.width = canvasWidth
  sampleCanvas.height = canvasHeight

  const rawByChar: [number, number][][] = []
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (char.trim() === '') {
      rawByChar.push([])
      continue
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.font = fontCss
    ctx.fillStyle = '#fff'
    ctx.textBaseline = 'alphabetic'
    const advance = ctx.measureText(text.slice(0, i)).width
    ctx.fillText(char, FONT_PX / 2 + advance, FONT_PX * 1.15)

    const pixels = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data
    const points: [number, number][] = []
    for (let y = 0; y < canvasHeight; y += 2) {
      for (let x = 0; x < canvasWidth; x += 2) {
        if (pixels[(y * canvasWidth + x) * 4 + 3] > 140) {
          points.push([x, y])
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }
    }
    rawByChar.push(points)
  }

  if (minX > maxX) {
    return text.split('').map(() => null)
  }

  const bboxW = maxX - minX || 1
  const bboxH = maxY - minY || 1
  const scale = fitBy === 'width' ? worldSize / bboxW : worldSize / bboxH
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2

  return rawByChar.map((raw) => {
    if (raw.length === 0) {
      return null
    }
    let cMinX = Infinity
    let cMaxX = -Infinity
    let cMinY = Infinity
    let cMaxY = -Infinity
    const points = raw.map(([x, y]) => {
      if (x < cMinX) cMinX = x
      if (x > cMaxX) cMaxX = x
      if (y < cMinY) cMinY = y
      if (y > cMaxY) cMaxY = y
      return [(x - cx) * scale, (cy - y) * scale + centerY] as [number, number]
    })
    return {
      points,
      center: [
        ((cMinX + cMaxX) / 2 - cx) * scale,
        (cy - (cMinY + cMaxY) / 2) * scale + centerY,
      ] as [number, number],
      width: (cMaxX - cMinX) * scale,
      height: (cMaxY - cMinY) * scale,
    }
  })
}

export function pickTargets(
  candidates: [number, number][],
  count: number,
  jitter = 0.014,
): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    const c = candidates[(Math.random() * candidates.length) | 0]
    out[i * 3] = c[0] + (Math.random() - 0.5) * jitter
    out[i * 3 + 1] = c[1] + (Math.random() - 0.5) * jitter
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.1
  }
  return out
}

export function scatterVolume(
  count: number,
  rx: number,
  ry: number,
  rz = 1.4,
): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    out[i * 3] = (Math.random() * 2 - 1) * rx
    out[i * 3 + 1] = (Math.random() * 2 - 1) * ry
    out[i * 3 + 2] = (Math.random() * 2 - 1) * rz
  }
  return out
}

export function randomScalars(count: number, min: number, max: number): Float32Array {
  const out = new Float32Array(count)
  for (let i = 0; i < count; i += 1) {
    out[i] = min + Math.random() * (max - min)
  }
  return out
}

export function paletteColors(
  count: number,
  palette: string[],
  glowMin = 0.75,
  glowMax = 1.2,
): Float32Array {
  const out = new Float32Array(count * 3)
  const color = new THREE.Color()
  for (let i = 0; i < count; i += 1) {
    color.set(palette[(Math.random() * palette.length) | 0])
    const glow = glowMin + Math.random() * (glowMax - glowMin)
    out[i * 3] = color.r * glow
    out[i * 3 + 1] = color.g * glow
    out[i * 3 + 2] = color.b * glow
  }
  return out
}

// ---------------------------------------------------------------------------
// Target authoring
// ---------------------------------------------------------------------------

export type FinaleTargets = {
  heroCount: number
  fieldCount: number
  heroN: Float32Array
  heroS: Float32Array
  heroScatter: Float32Array
  fieldWord: Float32Array
  fieldScatter: Float32Array
  fieldAsh: Float32Array
  fieldLine: Float32Array
  /** 1 = this particle spells the word, 0 = ambient drift around it. */
  fieldMember: Float32Array
  /** Normalised 0..1 row (top→bottom) of each field particle's word target. */
  fieldRow: Float32Array
  heroRow: Float32Array
  wordNCenter: [number, number]
  wordNScale: number
  slotCenter: [number, number]
  slotScale: number
  wordChars: (CharCloud | null)[]
  heroGlyph: CharCloud
  sTargets: [number, number][]
}

export function buildFinaleTargets(
  vw: number,
  vh: number,
  font: VariantFont,
  fontReady: boolean,
  heroCount: number,
  fieldCount: number,
): FinaleTargets | null {
  const wordWidth = Math.min(vw * 0.78, 6.4)
  const bigH = Math.min(vh * 0.52, vw * 0.78)
  const lineWidth = Math.min(vw * 0.88, 8.4)

  const family = fontReady ? font.family : font.fallback
  const fontCss = `${font.prefix} ${FONT_PX}px ${family}`
  const wordChars = sampleText(WORD, wordWidth, 'width', vh * 0.02, fontCss)
  const heroGlyph = sampleText('N', bigH, 'height', 0, fontCss)[0]
  const lineChars = sampleText(LINE, lineWidth, 'width', 0, fontCss)

  const wordN = wordChars[0]
  const slotS = lineChars[LINE_S_INDEX]
  if (!wordN || !heroGlyph || !slotS) {
    return null
  }

  const wordNScale = wordN.height / bigH
  // No separate "S" letterform: the swarm's own silhouette after the
  // flip∘turn (performed by HeroRig) IS the S — nothing swaps shape underfoot.
  const sTargets = heroGlyph.points

  const heroN = pickTargets(heroGlyph.points, heroCount)
  const heroS = heroN
  const heroScatter = scatterVolume(
    heroCount,
    (vw * 0.75) / wordNScale,
    (vh * 0.75) / wordNScale,
    2.5,
  )

  const avyaPool: [number, number][] = []
  for (let i = 1; i < wordChars.length; i += 1) {
    const cloud = wordChars[i]
    if (cloud) {
      avyaPool.push(...cloud.points)
    }
  }
  const linePool: [number, number][] = []
  lineChars.forEach((cloud, index) => {
    if (cloud && index !== LINE_S_INDEX) {
      linePool.push(...cloud.points)
    }
  })

  const fieldScatter = scatterVolume(fieldCount, vw * 0.72, vh * 0.72)
  const wordCount = Math.min(Math.floor(fieldCount * 0.38), fieldCount)
  const wordTargets = pickTargets(avyaPool, wordCount)
  const fieldWord = new Float32Array(fieldCount * 3)
  fieldWord.set(wordTargets.subarray(0, wordCount * 3))
  fieldWord.set(fieldScatter.subarray(wordCount * 3), wordCount * 3)

  const fieldAsh = new Float32Array(fieldCount * 3)
  for (let i = 0; i < fieldCount; i += 1) {
    fieldAsh[i * 3] = fieldScatter[i * 3] * 0.85 + 1.6 + Math.random() * vw * 0.45
    fieldAsh[i * 3 + 1] = fieldScatter[i * 3 + 1] * 0.85 + 0.6 + Math.random() * vh * 0.3
    fieldAsh[i * 3 + 2] = fieldScatter[i * 3 + 2]
  }

  const fieldLine = pickTargets(linePool, fieldCount)
  const fieldRow = normalisedRows(fieldWord, fieldCount)
  const heroRow = normalisedRows(heroN, heroCount)
  const fieldMember = new Float32Array(fieldCount)
  fieldMember.fill(1, 0, wordCount)

  return {
    heroCount,
    fieldCount,
    heroN,
    heroS,
    heroScatter,
    fieldWord,
    fieldScatter,
    fieldAsh,
    fieldLine,
    fieldMember,
    fieldRow,
    heroRow,
    wordNCenter: wordN.center,
    wordNScale,
    slotCenter: slotS.center,
    slotScale: slotS.height / (bigH * 0.92),
    wordChars,
    heroGlyph,
    sTargets,
  }
}

function normalisedRows(positions: Float32Array, count: number): Float32Array {
  let minY = Infinity
  let maxY = -Infinity
  for (let i = 0; i < count; i += 1) {
    const y = positions[i * 3 + 1]
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  const span = maxY - minY || 1
  const out = new Float32Array(count)
  for (let i = 0; i < count; i += 1) {
    out[i] = 1 - (positions[i * 3 + 1] - minY) / span
  }
  return out
}

// ---------------------------------------------------------------------------
// Constellation line segments (Starlight variant)
// ---------------------------------------------------------------------------

/** Pick evenly spread anchors from a cloud and chain them into segments. */
export function cloudToSegments(
  points: [number, number][],
  anchors = 7,
): number[] {
  if (points.length < 2) {
    return []
  }
  const sorted = [...points].sort((a, b) => a[1] - b[1] || a[0] - b[0])
  const picked: [number, number][] = []
  for (let i = 0; i < anchors; i += 1) {
    picked.push(sorted[Math.floor(((i + 0.5) / anchors) * sorted.length)])
  }
  const out: number[] = []
  for (let i = 0; i < picked.length - 1; i += 1) {
    out.push(picked[i][0], picked[i][1], 0, picked[i + 1][0], picked[i + 1][1], 0)
  }
  return out
}

// ---------------------------------------------------------------------------
// Small shared bits
// ---------------------------------------------------------------------------

/**
 * Force-load a webfont used only on canvas (those never load by themselves)
 * and report readiness. Falls back to "ready" on any loader failure so the
 * scene still renders with the fallback stack.
 */
export function useFontReady(loadSpec: string): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let active = true
    const done = () => {
      if (active) {
        setReady(true)
      }
    }
    if (document.fonts?.load) {
      document.fonts.load(loadSpec).then(done).catch(done)
    } else {
      done()
    }
    return () => {
      active = false
    }
  }, [loadSpec])
  return ready
}

/** Assemble a points geometry from named attributes (+ dummy position). */
export function buildPointsGeometry(
  count: number,
  attributes: Record<string, { array: Float32Array; itemSize: number }>,
): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry()
  for (const [name, { array, itemSize }] of Object.entries(attributes)) {
    geo.setAttribute(name, new THREE.BufferAttribute(array, itemSize))
  }
  geo.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(count * 3), 3),
  )
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 100)
  return geo
}

export function pxFactor(sizeHeight: number): number {
  return sizeHeight / (2 * Math.tan((FINALE_FOV * Math.PI) / 360))
}
