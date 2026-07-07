import {
  createFinaleVariant,
  FIELD_BLEND,
  FIELD_HEADER,
  HERO_BLEND,
  HERO_HEADER,
} from './variantScaffold'

/**
 * № 5 — EDITORIAL WALTZ · Playfair Display italic
 * Classic romance: Playfair's high-contrast italic drawn by a garden of warm
 * bokeh fireflies, each waltzing a tiny orbit around its place in the
 * letters, breathing light in and out. Soft-focus and alive — a memory, not
 * a caption. The N drifts apart into fireflies that waltz back in as the S.
 */

const WALTZ = /* glsl */ `
  float f1 = 0.6 + fract(aSeed * 0.371) * 0.9;
  float f2 = 0.5 + fract(aSeed * 0.713) * 0.8;
  float orbit = 0.04 + fract(aSeed * 0.531) * 0.05 + uChurn * 0.55;
  p.x += sin(uTime * f1 + aSeed * 7.0) * orbit;
  p.y += cos(uTime * f2 + aSeed * 13.0) * orbit * 0.8;
  p.z += sin(uTime * 0.7 + aSeed * 29.0) * orbit * 0.5;

  vPulse = 0.5 + 0.5 * sin(uTime * (0.9 + fract(aSeed * 0.617) * 1.3) + aSeed * 17.0);
  vColor = aColor * (0.68 + 0.62 * vPulse);
  vTwinkle = 0.8 + 0.2 * vPulse;
`

const FIELD_VERTEX = /* glsl */ `
  ${FIELD_HEADER}
  varying float vPulse;
  void main() {
    ${FIELD_BLEND}
    ${WALTZ}
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`

const HERO_VERTEX = /* glsl */ `
  ${HERO_HEADER}
  varying float vPulse;
  void main() {
    ${HERO_BLEND}
    ${WALTZ}
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`

const FRAGMENT = /* glsl */ `
  uniform float uAlpha;
  varying vec3 vColor;
  varying float vTwinkle;
  varying float vPulse;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    // Soft bokeh orb with a faint bright core.
    float orb = exp(-d * d * 9.0) - 0.012;
    float core = smoothstep(0.16, 0.02, d) * 0.5;
    float a = max(orb, 0.0) * (0.5 + 0.5 * vPulse) + core * vPulse;
    gl_FragColor = vec4(vColor, a * uAlpha * 0.8);
  }
`

export const EditorialWaltzFinale = createFinaleVariant({
  font: {
    prefix: 'italic 700',
    family: '"Playfair Display", Georgia, serif',
    fallback: 'Georgia, serif',
    loadSpec: 'italic 700 200px "Playfair Display"',
  },
  heroCount: 1200,
  fieldCount: 3200,
  palette: ['#f4d9a6', '#ffe9c4', '#f7b8d4', '#f4d9a6'],
  glowRange: [0.8, 1.3],
  fieldSize: [0.1, 0.19],
  heroSize: [0.11, 0.2],
  fieldVertex: FIELD_VERTEX,
  heroVertex: HERO_VERTEX,
  fragment: FRAGMENT,
})
