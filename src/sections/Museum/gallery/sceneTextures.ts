import * as THREE from 'three'

/**
 * Canvas-generated textures for the museum: in-scene lettering uses the page's
 * own fonts (Fraunces / Parisienne are already loaded by index.html), so no
 * font files or network fetches — and the type matches the rest of the app.
 */

export type TextTexture = {
  texture: THREE.CanvasTexture
  /** width / height of the rendered text block. */
  aspect: number
}

export function makeTextTexture(
  text: string,
  {
    font = '600 96px Fraunces, Georgia, serif',
    color = '#f5f0ff',
    glow = 'rgba(200,148,252,0.55)',
    padding = 48,
  } = {},
): TextTexture {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return { texture: new THREE.CanvasTexture(canvas), aspect: 4 }
  }

  ctx.font = font
  const metrics = ctx.measureText(text)
  const width = Math.ceil(metrics.width) + padding * 2
  const height =
    Math.ceil(
      (metrics.actualBoundingBoxAscent || 72) +
        (metrics.actualBoundingBoxDescent || 24),
    ) +
    padding * 2
  canvas.width = width
  canvas.height = height

  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = glow
  ctx.shadowBlur = 26
  ctx.fillStyle = color
  ctx.fillText(text, width / 2, height / 2)
  // Second pass sharpens the core over the glow.
  ctx.shadowBlur = 0
  ctx.fillText(text, width / 2, height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return { texture, aspect: width / height }
}

/** Soft radial pool of warm light — the fake "picture light" wall wash. */
export function makeGlowTexture(inner = 'rgba(244,217,166,0.5)'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 8, 128, 128, 128)
    gradient.addColorStop(0, inner)
    gradient.addColorStop(0.55, 'rgba(244,217,166,0.14)')
    gradient.addColorStop(1, 'rgba(244,217,166,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/** Long soft gradient for the runner carpet down the hall's spine. */
export function makeRunnerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const across = ctx.createLinearGradient(0, 0, 128, 0)
    across.addColorStop(0, 'rgba(200,148,252,0)')
    across.addColorStop(0.2, 'rgba(200,148,252,0.28)')
    across.addColorStop(0.5, 'rgba(109,40,217,0.42)')
    across.addColorStop(0.8, 'rgba(200,148,252,0.28)')
    across.addColorStop(1, 'rgba(200,148,252,0)')
    ctx.fillStyle = across
    ctx.fillRect(0, 0, 128, 512)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
