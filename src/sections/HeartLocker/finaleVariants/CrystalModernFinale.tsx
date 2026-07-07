import {
  createFinaleVariant,
  FIELD_BLEND,
  FIELD_HEADER,
  HERO_BLEND,
  HERO_HEADER,
} from './variantScaffold'

/**
 * № 4 — CRYSTAL MODERN · DM Sans bold
 * The signature cut from ice light in clean geometric sans: thousands of tiny
 * faceted shards tumble in the dark, glinting as they turn. During the
 * transitions the shards spin faster — the N shatters into diamond dust and
 * refreezes, facet by facet, as the S. Minimal, sharp, luxurious.
 */

const SPARKLE = /* glsl */ `
  float amp = 0.012 + uChurn * 0.65;
  p.x += sin(uTime * 1.7 + aSeed * 19.0) * amp * 0.4;
  p.y += cos(uTime * 2.0 + aSeed * 29.0) * amp * 0.34;
  p.z += sin(uTime * 1.3 + aSeed * 37.0) * amp * 0.3;

  float spinDir = fract(aSeed * 0.371) > 0.5 ? 1.0 : -1.0;
  vRot = aSeed * 6.2831 + uTime * (0.5 + uChurn * 3.5) * spinDir;
  vFlash = pow(0.5 + 0.5 * sin(uTime * 2.7 + aSeed * 91.0), 10.0) * 1.8;
  vColor = aColor;
  vTwinkle = 0.78 + 0.22 * sin(uTime * 2.2 + aSeed * 43.0);
`

const FIELD_VERTEX = /* glsl */ `
  ${FIELD_HEADER}
  varying float vRot;
  varying float vFlash;
  void main() {
    ${FIELD_BLEND}
    ${SPARKLE}
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`

const HERO_VERTEX = /* glsl */ `
  ${HERO_HEADER}
  varying float vRot;
  varying float vFlash;
  void main() {
    ${HERO_BLEND}
    ${SPARKLE}
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`

const FRAGMENT = /* glsl */ `
  uniform float uAlpha;
  varying vec3 vColor;
  varying float vTwinkle;
  varying float vRot;
  varying float vFlash;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float ca = cos(vRot);
    float sa = sin(vRot);
    vec2 r = vec2(c.x * ca - c.y * sa, c.x * sa + c.y * ca);
    // A rotating faceted shard: diamond silhouette + glint sweeping as it turns.
    float d = abs(r.x) + abs(r.y);
    float shard = smoothstep(0.5, 0.34, d);
    float facet = 0.5 + 0.5 * sin(vRot * 2.0);
    gl_FragColor = vec4(
      vColor * (0.5 + facet * 0.62 + vFlash) * vTwinkle,
      shard * uAlpha * 0.95
    );
  }
`

export const CrystalModernFinale = createFinaleVariant({
  font: {
    prefix: '700',
    family: '"DM Sans", system-ui, sans-serif',
    fallback: 'system-ui, sans-serif',
    loadSpec: '700 200px "DM Sans"',
  },
  heroCount: 3400,
  fieldCount: 10200,
  palette: ['#f5f0ff', '#ffffff', '#dcd0ff', '#c894fc', '#f5f0ff'],
  glowRange: [0.7, 1.2],
  fieldSize: [0.028, 0.07],
  heroSize: [0.032, 0.078],
  fieldVertex: FIELD_VERTEX,
  heroVertex: HERO_VERTEX,
  fragment: FRAGMENT,
})
