import {
  createFinaleVariant,
  FIELD_HEADER,
  HERO_HEADER,
} from './variantScaffold'

/**
 * № 2 — ENGRAVED GOLD · Cinzel
 * The signature as a museum inscription: Cinzel's roman capitals stitched in
 * gold thread, row by row, like a name embroidered into velvet — or engraved
 * on a plaque and catching lamplight. The N unpicks itself and re-stitches
 * as the S; the final line weaves in the same ceremonial way.
 */

const FIELD_VERTEX = /* glsl */ `
  ${FIELD_HEADER}
  void main() {
    float slideDir = sign(fract(aSeed * 0.531) - 0.5);

    // Stitch the word: gather to an entry point off the row's edge, slide in.
    float st = aRow * 0.55 + fract(aSeed * 0.371) * 0.12;
    float local = smoothstep(st, st + 0.33, uForm);
    vec3 entry = aWord + vec3(slideDir * (2.6 + fract(aSeed * 0.713) * 4.0), 0.0, 0.0);
    vec3 p = mix(aScatter, entry, smoothstep(0.0, max(st, 0.06), uForm));
    p = mix(p, aWord, local);

    // The a-v-y-a threads pull away on the wind.
    float ashStagger = fract(aSeed * 0.437) * 0.3;
    p = mix(p, aAsh, smoothstep(ashStagger, ashStagger + 0.7, uAsh));

    // The final line weaves itself the same way.
    float stL = aRow * 0.5 + fract(aSeed * 0.617) * 0.1;
    float localL = smoothstep(stL, stL + 0.35, uLine);
    vec3 entryL = aLine + vec3(slideDir * (2.2 + fract(aSeed * 0.813) * 3.0), 0.0, 0.0);
    vec3 stitched = mix(entryL, aLine, localL);
    p = mix(p, stitched, smoothstep(0.0, 0.22, uLine));

    p.y += sin(uTime * 1.8 + aSeed * 23.0) * (0.007 + uChurn * 0.4);
    vColor = aColor;
    vTwinkle = 0.7 + 0.3 * sin(uTime * 3.2 + aSeed * 47.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`

const HERO_VERTEX = /* glsl */ `
  ${HERO_HEADER}
  void main() {
    // The N unpicks row by row and re-stitches as the S.
    float stM = aRow * 0.5 + fract(aSeed * 0.617) * 0.12;
    float localM = smoothstep(stM, stM + 0.38, uMorph);
    float stagger = fract(aSeed * 0.437) * 0.4;
    vec3 p = mix(aScatter, aN, smoothstep(stagger, stagger + 0.6, uForm));
    p = mix(p, aS, localM);

    p.y += sin(uTime * 1.9 + aSeed * 27.0) * (0.006 + uChurn * 0.5);
    vColor = aColor;
    vTwinkle = 0.7 + 0.3 * sin(uTime * 3.4 + aSeed * 51.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`

const FRAGMENT = /* glsl */ `
  uniform float uAlpha;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    // A tiny horizontal thread dash with a satin sheen.
    float a = exp(-pow(c.x / 0.5, 2.0) * 2.2) * exp(-pow(c.y / 0.16, 2.0) * 3.0);
    float sheen = 0.78 + 0.5 * pow(vTwinkle, 3.0);
    gl_FragColor = vec4(vColor * sheen, a * uAlpha * 0.95);
  }
`

export const EngravedGoldFinale = createFinaleVariant({
  font: {
    prefix: '600',
    family: 'Cinzel, "Times New Roman", serif',
    fallback: '"Times New Roman", serif',
    loadSpec: '600 200px Cinzel',
  },
  heroCount: 3200,
  fieldCount: 9200,
  palette: ['#f4d9a6', '#ffe9c4', '#e8bd7f', '#f4d9a6', '#f7b8d4'],
  glowRange: [0.75, 1.25],
  fieldSize: [0.045, 0.095],
  heroSize: [0.05, 0.105],
  fieldVertex: FIELD_VERTEX,
  heroVertex: HERO_VERTEX,
  fragment: FRAGMENT,
})
