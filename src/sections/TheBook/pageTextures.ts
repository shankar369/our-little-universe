import type { BookFace } from '../../content/types'
import { bookContent } from '../../content/theBook'

/**
 * Canvas-composited page faces for The Book — a replica of the real
 * spiral-bound scrapbook. Page screenshots render full-bleed (the scan IS
 * the page), melted into the scene with a whisper of grain and vignette.
 * When no cover screenshot is provided, a handmade-style cover is painted
 * in the page's own fonts: silver script title, the couple's name, scattered
 * red hearts, a pink arrow doodle, and a black satin bow.
 */

/** Matches the page mesh aspect (PAGE_WIDTH / PAGE_HEIGHT ≈ A4 landscape). */
export const FACE_WIDTH = 1024
export const FACE_HEIGHT = 724

/** One face a sheet can show: black card, a page scan, or a cover board. */
export type SheetFace =
  | BookFace
  | { kind: 'cover'; cover: 'front' | 'back'; src?: string }

// ---------------------------------------------------------------------------
// Paper + drawing helpers
// ---------------------------------------------------------------------------

function makeCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas')
  canvas.width = FACE_WIDTH
  canvas.height = FACE_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('2d canvas unavailable')
  }
  return [canvas, ctx]
}

/** Deterministic pseudo-random — grain and hearts stay put across redraws. */
function makeRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

/** The charcoal cardstock of the real album. */
function drawPaper(ctx: CanvasRenderingContext2D, seed: number, tone = '#0c0c10') {
  ctx.fillStyle = tone
  ctx.fillRect(0, 0, FACE_WIDTH, FACE_HEIGHT)

  // Faint sheen where the page catches the room light.
  const sheen = ctx.createRadialGradient(
    FACE_WIDTH / 2,
    FACE_HEIGHT * 0.32,
    60,
    FACE_WIDTH / 2,
    FACE_HEIGHT * 0.32,
    FACE_WIDTH * 0.75,
  )
  sheen.addColorStop(0, 'rgba(200,180,220,0.045)')
  sheen.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, FACE_WIDTH, FACE_HEIGHT)

  // Cardstock grain.
  const random = makeRandom(seed)
  for (let i = 0; i < 850; i++) {
    const alpha = 0.006 + random() * 0.02
    ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`
    ctx.fillRect(random() * FACE_WIDTH, random() * FACE_HEIGHT, 1.4, 1.4)
  }

  drawVignette(ctx, 0.5)
}

function drawVignette(ctx: CanvasRenderingContext2D, strength: number) {
  const vignette = ctx.createRadialGradient(
    FACE_WIDTH / 2,
    FACE_HEIGHT / 2,
    FACE_HEIGHT * 0.45,
    FACE_WIDTH / 2,
    FACE_HEIGHT / 2,
    FACE_WIDTH * 0.72,
  )
  vignette.addColorStop(0, 'rgba(0,0,0,0)')
  vignette.addColorStop(1, `rgba(0,0,0,${strength})`)
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, FACE_WIDTH, FACE_HEIGHT)
}

/** Settle a scan into the scene: faint grain on top + soft edge falloff. */
function meltIntoPage(ctx: CanvasRenderingContext2D, seed: number) {
  const random = makeRandom(seed)
  for (let i = 0; i < 300; i++) {
    const alpha = 0.005 + random() * 0.012
    ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`
    ctx.fillRect(random() * FACE_WIDTH, random() * FACE_HEIGHT, 1.3, 1.3)
  }
  drawVignette(ctx, 0.26)
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = src
  })
}

/** Cover-fit `image` (or one half of it) into the full face. */
function drawFullBleed(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  half?: 'left' | 'right',
) {
  const sw = half ? image.width / 2 : image.width
  const sh = image.height
  const sx = half === 'right' ? sw : 0

  const scale = Math.max(FACE_WIDTH / sw, FACE_HEIGHT / sh)
  const cropW = FACE_WIDTH / scale
  const cropH = FACE_HEIGHT / scale
  ctx.drawImage(
    image,
    sx + (sw - cropW) / 2,
    (sh - cropH) / 2,
    cropW,
    cropH,
    0,
    0,
    FACE_WIDTH,
    FACE_HEIGHT,
  )
}

// ---------------------------------------------------------------------------
// Handmade cover doodles
// ---------------------------------------------------------------------------

function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  rotation: number,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.fillStyle = color
  ctx.font = `${size}px Georgia, serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('♥', 0, 0)
  ctx.restore()
}

/** The pink gel-pen arrow swooshing under the name. */
function drawArrow(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.strokeStyle = 'rgba(238,146,178,0.9)'
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x - 130, y + 14)
  ctx.quadraticCurveTo(x, y - 18, x + 130, y + 6)
  ctx.stroke()
  // Arrowhead
  ctx.beginPath()
  ctx.moveTo(x + 130, y + 6)
  ctx.lineTo(x + 104, y - 4)
  ctx.moveTo(x + 130, y + 6)
  ctx.lineTo(x + 108, y + 22)
  ctx.stroke()
  // Fletching
  ctx.beginPath()
  ctx.moveTo(x - 130, y + 14)
  ctx.lineTo(x - 148, y + 2)
  ctx.moveTo(x - 122, y + 8)
  ctx.lineTo(x - 140, y - 4)
  ctx.stroke()
  drawHeart(ctx, x + 10, y + 2, 22, 'rgba(238,146,178,0.9)', -0.15)
  ctx.restore()
}

/** The black satin bow tied at the bottom of the real cover. */
function drawBow(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save()
  ctx.fillStyle = '#101014'
  ctx.strokeStyle = 'rgba(255,255,255,0.14)'
  ctx.lineWidth = 2

  // Tails first, so the loops sit on top.
  ctx.beginPath()
  ctx.moveTo(cx - 6, cy + 6)
  ctx.lineTo(cx - 34, cy + 72)
  ctx.lineTo(cx - 12, cy + 66)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 6, cy + 6)
  ctx.lineTo(cx + 34, cy + 72)
  ctx.lineTo(cx + 12, cy + 66)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Loops
  ctx.beginPath()
  ctx.ellipse(cx - 40, cy, 42, 22, -0.32, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(cx + 40, cy, 42, 22, 0.32, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // Knot
  ctx.fillStyle = '#17171c'
  ctx.beginPath()
  ctx.ellipse(cx, cy, 14, 12, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}

// ---------------------------------------------------------------------------
// Face painters
// ---------------------------------------------------------------------------

async function paintPhotoFace(
  ctx: CanvasRenderingContext2D,
  face: Extract<BookFace, { kind: 'photo' }>,
  seed: number,
) {
  const image = await loadImage(face.src)
  if (!image || image.width === 0 || image.height === 0) {
    return
  }
  drawFullBleed(ctx, image, face.half)
  meltIntoPage(ctx, seed)
}

/** The generated replica of the handmade cover (used when no scan exists). */
function paintGeneratedCover(
  ctx: CanvasRenderingContext2D,
  cover: 'front' | 'back',
  seed: number,
) {
  const centerX = FACE_WIDTH / 2
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  if (cover === 'front') {
    // Scattered red hearts, like the sticker confetti on the real cover.
    const random = makeRandom(seed + 17)
    for (let i = 0; i < 11; i++) {
      const x = 70 + random() * (FACE_WIDTH - 140)
      const y = 60 + random() * (FACE_HEIGHT - 160)
      // Keep the middle clear for the lettering.
      if (Math.abs(x - centerX) < 250 && y > 160 && y < 500) {
        continue
      }
      drawHeart(
        ctx,
        x,
        y,
        16 + random() * 18,
        'rgba(217,38,55,0.92)',
        (random() - 0.5) * 0.9,
      )
    }

    ctx.save()
    ctx.translate(centerX, FACE_HEIGHT * 0.34)
    ctx.rotate(-0.05)
    ctx.shadowColor = 'rgba(255,255,255,0.4)'
    ctx.shadowBlur = 16
    ctx.fillStyle = '#e9e9ee'
    ctx.font = '108px Parisienne, cursive'
    ctx.fillText(bookContent.coverTitle, 0, 0)
    ctx.restore()

    ctx.save()
    ctx.shadowColor = 'rgba(255,255,255,0.3)'
    ctx.shadowBlur = 10
    ctx.fillStyle = '#dcdce2'
    ctx.font = '58px Parisienne, cursive'
    ctx.fillText(bookContent.coverSubtitle, centerX, FACE_HEIGHT * 0.55)
    ctx.restore()

    drawArrow(ctx, centerX, FACE_HEIGHT * 0.66)
    drawBow(ctx, centerX, FACE_HEIGHT * 0.87)
  } else {
    ctx.save()
    ctx.shadowColor = 'rgba(247,184,212,0.5)'
    ctx.shadowBlur = 14
    ctx.fillStyle = 'rgba(247,184,212,0.9)'
    ctx.font = '46px Parisienne, cursive'
    ctx.fillText(bookContent.dedication, centerX, FACE_HEIGHT * 0.47)
    ctx.restore()
    drawHeart(ctx, centerX, FACE_HEIGHT * 0.6, 34, 'rgba(217,38,55,0.85)', 0)
  }
}

// ---------------------------------------------------------------------------
// Public API — cached async face painting
// ---------------------------------------------------------------------------

const faceCache = new Map<string, Promise<HTMLCanvasElement>>()
const FACE_CACHE_LIMIT = 30

/**
 * Paint (or reuse) the canvas for one face. Scans load lazily; a failed
 * image quietly leaves black cardstock. Font faces are awaited once so the
 * cover lettering renders in Parisienne, not the fallback cursive.
 */
export function makeFaceCanvas(face: SheetFace): Promise<HTMLCanvasElement> {
  const key = JSON.stringify(face)
  const cached = faceCache.get(key)
  if (cached) {
    return cached
  }

  const promise = (async () => {
    await document.fonts?.ready?.catch?.(() => undefined)
    const [canvas, ctx] = makeCanvas()
    const seed =
      1 + [...key].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 99991, 7)

    if (face.kind === 'cover') {
      drawPaper(ctx, seed, '#0b0b0f')
      if (face.src) {
        const image = await loadImage(face.src)
        if (image && image.width > 0) {
          drawFullBleed(ctx, image)
          meltIntoPage(ctx, seed)
        } else {
          paintGeneratedCover(ctx, face.cover, seed)
        }
      } else {
        paintGeneratedCover(ctx, face.cover, seed)
      }
    } else {
      drawPaper(ctx, seed)
      if (face.kind === 'photo') {
        await paintPhotoFace(ctx, face, seed)
      }
    }
    return canvas
  })()

  faceCache.set(key, promise)
  // Simple FIFO eviction — long books don't hoard canvases forever.
  if (faceCache.size > FACE_CACHE_LIMIT) {
    const oldest = faceCache.keys().next().value
    if (oldest !== undefined) {
      faceCache.delete(oldest)
    }
  }
  return promise
}
