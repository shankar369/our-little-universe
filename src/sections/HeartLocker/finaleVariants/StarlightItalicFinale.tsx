import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'
import {
  cloudToSegments,
  finaleBeats,
  type FinaleTargets,
} from './finaleEngine'
import { HeroRig } from './HeroRig'
import {
  createFinaleVariant,
  FIELD_BLEND,
  FIELD_HEADER,
  HERO_BLEND,
  HERO_HEADER,
  POINT_OUT,
} from './variantScaffold'

/**
 * № 3 — STARLIGHT ITALIC · Fraunces italic
 * The signature written in the app's own sky language, in Fraunces' soft
 * italic: crisp four-ray stars with faint constellation lines joining each
 * letter's named stars. The lines dissolve with the ash, and the N's
 * constellation flips, turns, and re-links itself as the S.
 */

const FIELD_VERTEX = /* glsl */ `
  ${FIELD_HEADER}
  void main() {
    ${FIELD_BLEND}
    float amp = 0.01 + uChurn * 0.55;
    p.x += sin(uTime * 1.4 + aSeed * 19.0) * amp * 0.4;
    p.y += cos(uTime * 1.7 + aSeed * 29.0) * amp * 0.33;
    p.z += sin(uTime * 1.1 + aSeed * 37.0) * amp * 0.3;
    vColor = aColor;
    vTwinkle = 0.55 + 0.45 * pow(0.5 + 0.5 * sin(uTime * 2.1 + aSeed * 43.0), 2.0);
    ${POINT_OUT}
  }
`

const HERO_VERTEX = /* glsl */ `
  ${HERO_HEADER}
  void main() {
    ${HERO_BLEND}
    float amp = 0.009 + uChurn * 0.7;
    p.x += sin(uTime * 1.5 + aSeed * 23.0) * amp * 0.4;
    p.y += cos(uTime * 1.9 + aSeed * 31.0) * amp * 0.34;
    p.z += sin(uTime * 1.2 + aSeed * 41.0) * amp * 0.3;
    vColor = aColor;
    vTwinkle = 0.55 + 0.45 * pow(0.5 + 0.5 * sin(uTime * 2.4 + aSeed * 47.0), 2.0);
    ${POINT_OUT}
  }
`

const FRAGMENT = /* glsl */ `
  uniform float uAlpha;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float core = smoothstep(0.3, 0.02, d);
    float rayX = (1.0 - smoothstep(0.0, 0.5, abs(c.x))) *
                 (1.0 - smoothstep(0.0, 0.045, abs(c.y)));
    float rayY = (1.0 - smoothstep(0.0, 0.5, abs(c.y))) *
                 (1.0 - smoothstep(0.0, 0.045, abs(c.x)));
    float a = clamp(core + (rayX + rayY) * 0.6 * vTwinkle, 0.0, 1.0);
    gl_FragColor = vec4(vColor * (0.75 + 0.4 * vTwinkle), a * uAlpha);
  }
`

/** Faint constellation lines linking each letterform's anchor stars. */
// eslint-disable-next-line react-refresh/only-export-components
function ConstellationLines({
  targets,
  progress,
}: {
  targets: FinaleTargets
  progress: MotionValue<number>
}) {
  const wordRef = useRef<THREE.LineSegments>(null)
  const heroNRef = useRef<THREE.LineSegments>(null)
  const heroSRef = useRef<THREE.LineSegments>(null)

  const { wordGeo, heroNGeo, heroSGeo, materials } = useMemo(() => {
    const wordSegments: number[] = []
    for (const cloud of targets.wordChars) {
      if (cloud) {
        wordSegments.push(...cloudToSegments(cloud.points, 7))
      }
    }
    const toGeo = (values: number[]) => {
      const geo = new THREE.BufferGeometry()
      geo.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(values), 3),
      )
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 100)
      return geo
    }
    const makeLineMaterial = () =>
      new THREE.LineBasicMaterial({
        color: '#c894fc',
        transparent: true,
        opacity: 0,
      })
    return {
      wordGeo: toGeo(wordSegments),
      heroNGeo: toGeo(cloudToSegments(targets.heroGlyph.points, 9)),
      heroSGeo: toGeo(cloudToSegments(targets.sTargets, 9)),
      materials: [makeLineMaterial(), makeLineMaterial(), makeLineMaterial()],
    }
  }, [targets])

  useEffect(() => {
    return () => {
      wordGeo.dispose()
      heroNGeo.dispose()
      heroSGeo.dispose()
      materials.forEach((entry) => entry.dispose())
    }
  }, [wordGeo, heroNGeo, heroSGeo, materials])

  useFrame(() => {
    const beats = finaleBeats(progress.get())
    const settle = 1 - beats.line * 0.65
    const word = wordRef.current?.material as THREE.LineBasicMaterial | undefined
    if (word) {
      word.opacity = beats.appear * beats.form * (1 - beats.ash) * 0.3
    }
    const heroN = heroNRef.current?.material as THREE.LineBasicMaterial | undefined
    if (heroN) {
      heroN.opacity = beats.appear * beats.form * (1 - beats.morph) * 0.36 * settle
    }
    const heroS = heroSRef.current?.material as THREE.LineBasicMaterial | undefined
    if (heroS) {
      heroS.opacity = beats.appear * beats.morph * 0.36 * settle
    }
  })

  return (
    <>
      <lineSegments ref={wordRef} geometry={wordGeo} material={materials[0]} frustumCulled={false} />
      <HeroRig targets={targets} progress={progress}>
        <lineSegments ref={heroNRef} geometry={heroNGeo} material={materials[1]} frustumCulled={false} />
        <lineSegments ref={heroSRef} geometry={heroSGeo} material={materials[2]} frustumCulled={false} />
      </HeroRig>
    </>
  )
}

export const StarlightItalicFinale = createFinaleVariant({
  font: {
    prefix: 'italic 600',
    family: 'Fraunces, Georgia, serif',
    fallback: 'Georgia, serif',
    loadSpec: 'italic 600 200px Fraunces',
  },
  heroCount: 3000,
  fieldCount: 9500,
  palette: ['#f5f0ff', '#f5f0ff', '#dcd0ff', '#c894fc', '#f4d9a6'],
  glowRange: [0.8, 1.35],
  fieldSize: [0.022, 0.055],
  heroSize: [0.026, 0.062],
  fieldVertex: FIELD_VERTEX,
  heroVertex: HERO_VERTEX,
  fragment: FRAGMENT,
  extras: (targets, progress) => (
    <ConstellationLines targets={targets} progress={progress} />
  ),
})
