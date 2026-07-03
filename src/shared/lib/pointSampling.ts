/**
 * Point-cloud samplers for the ember scenes. FinaleEmbers rasterises text its
 * own way; these cover the other sources — photos (the dissolve bridge) and
 * SVG paths (the heart iris).
 */

export type ImagePoints = {
  /** (u, v) pairs in 0..1 image space, v = 0 at the top. */
  coords: Float32Array
  /** Linear-ish RGB triplets in 0..1 per point. */
  colors: Float32Array
  count: number
}

/**
 * Sample an image into a cols×rows grid of points with pixel colors.
 * The image is drawn once into an offscreen canvas at grid resolution, so
 * every grid cell reads an averaged pixel — cheap and stable.
 */
export function sampleImageToPoints(
  image: HTMLImageElement,
  cols: number,
  rows: number,
): ImagePoints | null {
  const canvas = document.createElement('canvas')
  canvas.width = cols
  canvas.height = rows
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    return null
  }

  try {
    ctx.drawImage(image, 0, 0, cols, rows)
  } catch {
    return null
  }

  let pixels: Uint8ClampedArray
  try {
    pixels = ctx.getImageData(0, 0, cols, rows).data
  } catch {
    // Tainted canvas (cross-origin image) — the caller falls back gracefully.
    return null
  }

  const count = cols * rows
  const coords = new Float32Array(count * 2)
  const colors = new Float32Array(count * 3)

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const i = row * cols + col
      coords[i * 2] = (col + 0.5) / cols
      coords[i * 2 + 1] = (row + 0.5) / rows
      colors[i * 3] = pixels[i * 4] / 255
      colors[i * 3 + 1] = pixels[i * 4 + 1] / 255
      colors[i * 3 + 2] = pixels[i * 4 + 2] / 255
    }
  }

  return { coords, colors, count }
}

/**
 * Sample `count` points along an SVG path outline (e.g. the heart iris).
 * Returns (x, y) pairs in the path's own coordinate space.
 */
export function samplePathToPoints(pathD: string, count: number): Float32Array {
  const svgNS = 'http://www.w3.org/2000/svg'
  const path = document.createElementNS(svgNS, 'path')
  path.setAttribute('d', pathD)

  const out = new Float32Array(count * 2)
  const total = path.getTotalLength()
  for (let i = 0; i < count; i += 1) {
    const point = path.getPointAtLength((i / count) * total)
    out[i * 2] = point.x
    out[i * 2 + 1] = point.y
  }
  return out
}
