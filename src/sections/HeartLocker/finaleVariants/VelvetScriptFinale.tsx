import {
  createFinaleVariant,
  FIELD_BLEND,
  FIELD_HEADER,
  HERO_BLEND,
  HERO_HEADER,
} from './variantScaffold'

/**
 * № 1 — VELVET SCRIPT · Parisienne
 * The signature handwritten out of tiny hearts, colour-graded blush →
 * orchid → champagne down every letter. Kept deliberately quiet: the
 * ambient hearts around the words are small and faint (they only brighten
 * when the final line calls everyone in), letterform hearts stay delicate so
 * strokes read as strings of little hearts instead of fusing into a white
 * mass, and everything shrinks a touch as it condenses into the closing
 * "Navya's Sankar". The N settles into the S purely through its own
 * flip∘turn — no letterform swap, just the same swarm turned a quarter and
 * found beautiful.
 */

const FLOW = /* glsl */ `
  float amp = 0.035 + uChurn * 0.8;
  vec2 flow = vec2(
    sin(p.y * 1.4 + uTime * 0.55 + aSeed * 0.7),
    cos(p.x * 1.15 - uTime * 0.42 + aSeed * 1.3)
  );
  p.x += flow.x * amp * 0.6;
  p.y += flow.y * amp * 0.45;
  p.z += sin(uTime * 0.5 + aSeed * 11.0) * amp * 0.25;

  vec3 blushTone = vec3(0.97, 0.72, 0.83);
  vec3 orchidTone = vec3(0.78, 0.58, 0.99);
  vec3 champagneTone = vec3(0.96, 0.85, 0.65);
  vec3 grad = mix(blushTone, orchidTone, smoothstep(0.0, 0.55, aRow));
  grad = mix(grad, champagneTone, smoothstep(0.55, 1.0, aRow));
  vColor = mix(aColor, grad, 0.72);
  vTwinkle = 0.75 + 0.25 * sin(uTime * 1.6 + aSeed * 43.0);
`

const FIELD_VERTEX = /* glsl */ `
  ${FIELD_HEADER}
  varying float vFade;
  void main() {
    ${FIELD_BLEND}
    ${FLOW}

    // Ambient hearts whisper (small, faint) until the closing line gathers
    // every heart into the lettering; then everyone shrinks a touch so the
    // line stays delicate instead of fusing solid.
    float lineIn = smoothstep(0.0, 0.45, uLine);
    float present = max(aMember, lineIn);
    vFade = mix(0.28, 1.0, present);
    float sizeScale = mix(0.55, 1.0, present) * mix(1.0, 0.58, lineIn);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * sizeScale * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`

const HERO_VERTEX = /* glsl */ `
  ${HERO_HEADER}
  varying float vFade;
  void main() {
    ${HERO_BLEND}
    ${FLOW}
    vFade = 1.0;
    // The rig scales the swarm's positions into the line's S-slot, but sprite
    // sizes don't inherit that — shrink them alongside.
    float sizeScale = mix(1.0, 0.42, uLine);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * sizeScale * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`

// A tiny upright heart per particle: the classic implicit heart curve
// (x²+y²-1)³ = x²y³, soft-edged so it glows like an ember rather than
// reading as a hard sticker.
const FRAGMENT = /* glsl */ `
  uniform float uAlpha;
  varying vec3 vColor;
  varying float vTwinkle;
  varying float vFade;
  void main() {
    vec2 hp = vec2(
      (gl_PointCoord.x - 0.5) * 2.6,
      -(gl_PointCoord.y - 0.5) * 2.6 - 0.16
    );
    float hx2 = hp.x * hp.x;
    float hy2 = hp.y * hp.y;
    float val = pow(hx2 + hy2 - 1.0, 3.0) - hx2 * hy2 * hp.y;
    float heart = 1.0 - smoothstep(-0.12, 0.05, val);

    gl_FragColor = vec4(
      vColor * (0.68 + 0.32 * vTwinkle),
      heart * uAlpha * 0.58 * vFade
    );
  }
`

export const VelvetScriptFinale = createFinaleVariant({
  font: {
    prefix: '400',
    family: 'Parisienne, cursive',
    fallback: '"Segoe Script", "Brush Script MT", cursive',
    loadSpec: '400 200px Parisienne',
  },
  heroCount: 1900,
  fieldCount: 5200,
  palette: ['#f7b8d4', '#c894fc', '#f4d9a6', '#f5f0ff'],
  glowRange: [0.62, 0.98],
  fieldSize: [0.05, 0.105],
  heroSize: [0.055, 0.115],
  fieldVertex: FIELD_VERTEX,
  heroVertex: HERO_VERTEX,
  fragment: FRAGMENT,
})
