import * as THREE from 'three'

/**
 * Canvas-generated textures for the birthday cake: candy stripes for the
 * candles, the warm-paper name tag, and a soft smoke puff. Same approach as
 * the museum's `sceneTextures` — the page's own fonts (DM Sans / Parisienne
 * from index.html), no network fetches.
 */

/**
 * Barber-pole candy stripes on warm wax. Drawn diagonally so they read as a
 * spiral once wrapped around the candle cylinder (reference candles).
 */
export function makeStripeTexture(stripe: string, base = '#fff7ee'): THREE.CanvasTexture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = base
    ctx.fillRect(0, 0, size, size)
    ctx.strokeStyle = stripe
    ctx.lineWidth = 13
    ctx.lineCap = 'butt'
    // Shallow diagonal bands drawn past both edges → clean wrap seam.
    for (let x = -size * 2; x <= size * 2; x += 42) {
      ctx.beginPath()
      ctx.moveTo(x, -8)
      ctx.lineTo(x + size * 1.6, size + 8)
      ctx.stroke()
    }
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 1)
  texture.anisotropy = 4
  return texture
}

/**
 * The sponge's crumb: a speckled tile with a baked ambient-occlusion
 * gradient (darker just under the glaze lip, a whisper at the foot). Used as
 * both `map` (tinted by the material color) and `bumpMap` — the reference
 * cake gets this from a fabric normal/roughness texture.
 */
export function makeCrumbTexture(): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)
    // Crumb speckle: thousands of soft micro-dots.
    for (let i = 0; i < 4200; i += 1) {
      const shade = 195 + Math.floor(Math.random() * 60)
      ctx.fillStyle = `rgba(${shade},${shade - 6},${shade - 12},${0.16 + Math.random() * 0.2})`
      const r = 0.5 + Math.random() * 1.4
      ctx.beginPath()
      ctx.arc(Math.random() * size, Math.random() * size, r, 0, Math.PI * 2)
      ctx.fill()
    }
    // Baked AO: shadow under the glaze lip (top of the wall), toe shadow.
    const top = ctx.createLinearGradient(0, 0, 0, size)
    top.addColorStop(0, 'rgba(58,40,66,0.34)')
    top.addColorStop(0.18, 'rgba(58,40,66,0.1)')
    top.addColorStop(0.34, 'rgba(58,40,66,0)')
    top.addColorStop(0.94, 'rgba(58,40,66,0)')
    top.addColorStop(1, 'rgba(58,40,66,0.16)')
    ctx.fillStyle = top
    ctx.fillRect(0, 0, size, size)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  // v axis maps the wall height exactly once so the AO lands under the lip.
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.repeat.set(3, 1)
  texture.anisotropy = 4
  return texture
}

/**
 * The name tag face: a tiny eyebrow line over her name in the script voice,
 * dark ink on transparent (the plaque mesh underneath provides warm paper).
 * Redrawn once the document fonts land so Parisienne actually renders.
 */
export function makeNameTagTexture(name: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4

  const draw = () => {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(43,16,72,0.55)'
    ctx.font = '600 26px "DM Sans", sans-serif'
    const eyebrow = 'H A P P Y   B I R T H D A Y'
    ctx.fillText(eyebrow, canvas.width / 2, 74)
    ctx.fillStyle = '#2b1048'
    ctx.font = '400 118px Parisienne, cursive'
    ctx.fillText(name, canvas.width / 2, 196)
    texture.needsUpdate = true
  }

  draw()
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    document.fonts.ready.then(draw).catch(() => {})
  }
  return texture
}

/**
 * Soft round ground shadow — a radial black falloff used on small planes
 * under the plate and gifts, so everything reads grounded on the night sky
 * without a real shadow pass.
 */
export function makeShadowTexture(): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 12, 128, 128, 126)
    gradient.addColorStop(0, 'rgba(4,2,14,0.85)')
    gradient.addColorStop(0.55, 'rgba(4,2,14,0.4)')
    gradient.addColorStop(1, 'rgba(4,2,14,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/** Warm radial halo rendered additively behind each live flame. */
export function makeFlameGlowTexture(): THREE.CanvasTexture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 2, 64, 64, 62)
    gradient.addColorStop(0, 'rgba(255,214,150,0.9)')
    gradient.addColorStop(0.4, 'rgba(255,166,84,0.32)')
    gradient.addColorStop(1, 'rgba(255,140,60,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/** Soft grey radial puff for the post-blow smoke wisps. */
export function makeSmokeTexture(): THREE.CanvasTexture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 62)
    gradient.addColorStop(0, 'rgba(214,206,236,0.85)')
    gradient.addColorStop(0.5, 'rgba(190,182,214,0.28)')
    gradient.addColorStop(1, 'rgba(190,182,214,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
