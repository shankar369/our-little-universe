import * as THREE from 'three'

/**
 * The shared ember DNA: palette, buffer builders, and the soft point-sprite
 * fragment shader used by every ember scene (locker atmosphere, photo
 * dissolve, heart iris). FinaleEmbers keeps its own private copy of this
 * language — the showpiece stays untouched — but new scenes draw from here so
 * all embers read as one material.
 */

/** Warm ember palette — champagne-heavy, kissed with blush and orchid. */
export const EMBER_PALETTE = [
  '#f4d9a6',
  '#f4d9a6',
  '#ffe9c4',
  '#f7b8d4',
  '#f7b8d4',
  '#c894fc',
]

/**
 * Soft radial ember sprite. `uStretch` widens the sprite horizontally so
 * fast-scroll embers smear into brief light streaks (0 = round).
 */
export const EMBER_FRAGMENT = /* glsl */ `
  uniform float uAlpha;
  uniform float uStretch;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    c.x /= (1.0 + uStretch * 2.5);
    float d = length(c);
    float a = smoothstep(0.5, 0.06, d);
    gl_FragColor = vec4(vColor * (0.8 + 0.35 * vTwinkle), a * uAlpha);
  }
`

/** Per-particle ember colors with a random glow lift, as vec3 buffer. */
export function emberColors(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  const color = new THREE.Color()
  for (let i = 0; i < count; i += 1) {
    color.set(EMBER_PALETTE[(Math.random() * EMBER_PALETTE.length) | 0])
    const glow = 0.75 + Math.random() * 0.45
    out[i * 3] = color.r * glow
    out[i * 3 + 1] = color.g * glow
    out[i * 3 + 2] = color.b * glow
  }
  return out
}

/** Uniformly random scalar attribute buffer in [min, max). */
export function emberScalars(
  count: number,
  min: number,
  max: number,
): Float32Array {
  const out = new Float32Array(count)
  for (let i = 0; i < count; i += 1) {
    out[i] = min + Math.random() * (max - min)
  }
  return out
}

/** Random positions across a centred box volume, as vec3 buffer. */
export function scatterVolume(
  count: number,
  rx: number,
  ry: number,
  rz = 1.2,
): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    out[i * 3] = (Math.random() * 2 - 1) * rx
    out[i * 3 + 1] = (Math.random() * 2 - 1) * ry
    out[i * 3 + 2] = (Math.random() * 2 - 1) * rz
  }
  return out
}

/**
 * Standard ember points material: additive light, no depth write.
 *
 * Blending is custom rather than THREE.AdditiveBlending: colour adds to the
 * framebuffer but alpha is pinned at zero, so a transparent overlay canvas
 * only ever ADDS light to the page beneath it. (Stock additive blending also
 * accumulates framebuffer alpha, which the compositor then uses to occlude
 * the page — dim embers would show as dark specks over bright content.)
 */
export function makeEmberMaterial(
  vertexShader: string,
  extraUniforms: Record<string, THREE.IUniform> = {},
): THREE.ShaderMaterial {
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: EMBER_FRAGMENT,
    uniforms: {
      uTime: { value: 0 },
      uPx: { value: 800 },
      uAlpha: { value: 0 },
      uStretch: { value: 0 },
      ...extraUniforms,
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.CustomBlending,
  })
  material.blendEquation = THREE.AddEquation
  material.blendSrc = THREE.SrcAlphaFactor
  material.blendDst = THREE.OneFactor
  material.blendEquationAlpha = THREE.AddEquation
  material.blendSrcAlpha = THREE.ZeroFactor
  material.blendDstAlpha = THREE.OneFactor
  return material
}
