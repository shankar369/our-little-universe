import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'

/**
 * The ember finale: ~15,000 glowing particles perform the whole signature.
 *
 *  1. Embers drift in the night, then condense into "Navya".
 *  2. The a-v-y-a letters blow away as ash on the wind; the N's swarm holds.
 *  3. Beat 1 — the N swarm flips upside-down, rigidly (group rotation.x → π).
 *  4. Beat 2 — it turns 90° clockwise while inverted (rotation.z → −π/2).
 *     Flip∘turn maps (x, y) → (−y, −x), so the S targets are authored through
 *     the inverse of that map and land as a crisp, true S.
 *  5. Beat 3 — the swarm boils and condenses into the S.
 *  6. The ash returns: every ember condenses into "Navya's Sankar", and the
 *     S-swarm flies into its slot in the line.
 *
 * Letterforms are sampled from the real page font on an offscreen canvas, so
 * the particle text matches the app's typography.
 */

const HERO_COUNT = 3600
const FIELD_COUNT = 11800
const WORD = 'Navya'
const LINE = 'Navya’s Sankar'
const LINE_S_INDEX = 8
const FONT_PX = 200
const CAMERA_Z = 10
const FOV = 50

type EmberProps = {
  progress: MotionValue<number>
}

type CharCloud = {
  points: [number, number][]
  center: [number, number]
  width: number
  height: number
}

const sampleCanvas =
  typeof document !== 'undefined' ? document.createElement('canvas') : null

/** Rasterise `text` and return world-space point candidates per character. */
function sampleText(
  text: string,
  worldSize: number,
  fitBy: 'width' | 'height',
  centerY: number,
  fontFamily: string,
): (CharCloud | null)[] {
  if (!sampleCanvas) {
    return text.split('').map(() => null)
  }

  const ctx = sampleCanvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    return text.split('').map(() => null)
  }

  const font = `600 ${FONT_PX}px ${fontFamily}`
  ctx.font = font
  const fullWidth = Math.ceil(ctx.measureText(text).width)
  const canvasWidth = fullWidth + FONT_PX
  const canvasHeight = Math.ceil(FONT_PX * 1.6)
  sampleCanvas.width = canvasWidth
  sampleCanvas.height = canvasHeight

  const rawByChar: [number, number][][] = []
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (char.trim() === '') {
      rawByChar.push([])
      continue
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.font = font
    ctx.fillStyle = '#fff'
    ctx.textBaseline = 'alphabetic'
    const advance = ctx.measureText(text.slice(0, i)).width
    ctx.fillText(char, FONT_PX / 2 + advance, FONT_PX * 1.15)

    const pixels = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data
    const points: [number, number][] = []
    for (let y = 0; y < canvasHeight; y += 2) {
      for (let x = 0; x < canvasWidth; x += 2) {
        if (pixels[(y * canvasWidth + x) * 4 + 3] > 140) {
          points.push([x, y])
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }
    }
    rawByChar.push(points)
  }

  if (minX > maxX) {
    return text.split('').map(() => null)
  }

  const bboxW = maxX - minX || 1
  const bboxH = maxY - minY || 1
  const scale = fitBy === 'width' ? worldSize / bboxW : worldSize / bboxH
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2

  return rawByChar.map((raw) => {
    if (raw.length === 0) {
      return null
    }
    let cMinX = Infinity
    let cMaxX = -Infinity
    let cMinY = Infinity
    let cMaxY = -Infinity
    const points = raw.map(([x, y]) => {
      if (x < cMinX) cMinX = x
      if (x > cMaxX) cMaxX = x
      if (y < cMinY) cMinY = y
      if (y > cMaxY) cMaxY = y
      return [(x - cx) * scale, (cy - y) * scale + centerY] as [number, number]
    })
    return {
      points,
      center: [
        ((cMinX + cMaxX) / 2 - cx) * scale,
        (cy - (cMinY + cMaxY) / 2) * scale + centerY,
      ] as [number, number],
      width: (cMaxX - cMinX) * scale,
      height: (cMaxY - cMinY) * scale,
    }
  })
}

function pickTargets(
  candidates: [number, number][],
  count: number,
  jitter = 0.014,
): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    const c = candidates[(Math.random() * candidates.length) | 0]
    out[i * 3] = c[0] + (Math.random() - 0.5) * jitter
    out[i * 3 + 1] = c[1] + (Math.random() - 0.5) * jitter
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.1
  }
  return out
}

function scatterVolume(count: number, rx: number, ry: number, rz = 1.4): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    out[i * 3] = (Math.random() * 2 - 1) * rx
    out[i * 3 + 1] = (Math.random() * 2 - 1) * ry
    out[i * 3 + 2] = (Math.random() * 2 - 1) * rz
  }
  return out
}

// Warm ember palette: champagne-heavy, kissed with blush and orchid.
const PALETTE = ['#f4d9a6', '#f4d9a6', '#ffe9c4', '#f7b8d4', '#f7b8d4', '#c894fc']

function emberColors(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  const color = new THREE.Color()
  for (let i = 0; i < count; i += 1) {
    color.set(PALETTE[(Math.random() * PALETTE.length) | 0])
    const glow = 0.75 + Math.random() * 0.45
    out[i * 3] = color.r * glow
    out[i * 3 + 1] = color.g * glow
    out[i * 3 + 2] = color.b * glow
  }
  return out
}

function emberScalars(count: number, min: number, max: number): Float32Array {
  const out = new Float32Array(count)
  for (let i = 0; i < count; i += 1) {
    out[i] = min + Math.random() * (max - min)
  }
  return out
}

const FIELD_VERTEX = /* glsl */ `
  attribute vec3 aWord;
  attribute vec3 aScatter;
  attribute vec3 aAsh;
  attribute vec3 aLine;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aSeed;
  uniform float uForm;
  uniform float uAsh;
  uniform float uLine;
  uniform float uTime;
  uniform float uPx;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec3 p = mix(aScatter, aWord, uForm);
    p = mix(p, aAsh, uAsh);
    p = mix(p, aLine, uLine);
    float churn = uForm * (1.0 - uForm) + uAsh * (1.0 - uAsh) + uLine * (1.0 - uLine);
    float amp = 0.016 + churn * 1.1;
    p.x += sin(uTime * 1.6 + aSeed * 19.0) * amp * 0.4;
    p.y += cos(uTime * 1.9 + aSeed * 29.0) * amp * 0.33;
    p.z += sin(uTime * 1.3 + aSeed * 37.0) * amp * 0.3;
    vColor = aColor;
    vTwinkle = 0.72 + 0.28 * sin(uTime * 2.6 + aSeed * 43.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * vTwinkle * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`

const HERO_VERTEX = /* glsl */ `
  attribute vec3 aN;
  attribute vec3 aS;
  attribute vec3 aScatter;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aSeed;
  uniform float uForm;
  uniform float uMorph;
  uniform float uTime;
  uniform float uPx;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec3 p = mix(aScatter, aN, uForm);
    p = mix(p, aS, uMorph);
    float churn = uForm * (1.0 - uForm) + uMorph * (1.0 - uMorph);
    float amp = 0.014 + churn * 1.5;
    p.x += sin(uTime * 1.7 + aSeed * 23.0) * amp * 0.4;
    p.y += cos(uTime * 2.1 + aSeed * 31.0) * amp * 0.34;
    p.z += sin(uTime * 1.4 + aSeed * 41.0) * amp * 0.3;
    vColor = aColor;
    vTwinkle = 0.74 + 0.26 * sin(uTime * 2.8 + aSeed * 47.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * vTwinkle * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`

const EMBER_FRAGMENT = /* glsl */ `
  uniform float uAlpha;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.06, d);
    gl_FragColor = vec4(vColor * (0.8 + 0.35 * vTwinkle), a * uAlpha);
  }
`

type EmberData = {
  fieldGeometry: THREE.BufferGeometry
  heroGeometry: THREE.BufferGeometry
  wordNCenter: [number, number]
  wordNScale: number
  slotCenter: [number, number]
  slotScale: number
}

function buildEmberData(vw: number, vh: number, fontsLoaded: boolean): EmberData | null {
  const wordWidth = Math.min(vw * 0.76, 6.2)
  // The hero letter must fit the screen even mid-rotation (its height sweeps
  // across the viewport's width during the quarter-turn).
  const bigH = Math.min(vh * 0.52, vw * 0.78)
  const lineWidth = Math.min(vw * 0.88, 8.4)

  // Until the display font arrives, sample the serif fallback (then rebuild).
  const family = fontsLoaded ? 'Fraunces, Georgia, serif' : 'Georgia, serif'
  const wordChars = sampleText(WORD, wordWidth, 'width', vh * 0.02, family)
  const heroGlyph = sampleText('N', bigH, 'height', 0, family)[0]
  const sGlyph = sampleText('S', bigH * 0.92, 'height', 0, family)[0]
  const lineChars = sampleText(LINE, lineWidth, 'width', 0, family)

  const wordN = wordChars[0]
  const slotS = lineChars[LINE_S_INDEX]
  if (!wordN || !heroGlyph || !sGlyph || !slotS) {
    return null
  }

  // --- Hero swarm: the N that becomes the S -------------------------------
  const wordNScale = wordN.height / bigH
  // The S targets, authored through the inverse of flip∘turn: (x, y) → (−y, −x).
  const sTargets: [number, number][] = sGlyph.points.map(([x, y]) => [-y, -x])

  const heroGeometry = new THREE.BufferGeometry()
  heroGeometry.setAttribute(
    'aN',
    new THREE.BufferAttribute(pickTargets(heroGlyph.points, HERO_COUNT), 3),
  )
  heroGeometry.setAttribute(
    'aS',
    new THREE.BufferAttribute(pickTargets(sTargets, HERO_COUNT), 3),
  )
  heroGeometry.setAttribute(
    'aScatter',
    new THREE.BufferAttribute(
      scatterVolume(HERO_COUNT, (vw * 0.75) / wordNScale, (vh * 0.75) / wordNScale, 2.5),
      3,
    ),
  )
  heroGeometry.setAttribute(
    'aColor',
    new THREE.BufferAttribute(emberColors(HERO_COUNT), 3),
  )
  heroGeometry.setAttribute(
    'aSize',
    new THREE.BufferAttribute(emberScalars(HERO_COUNT, 0.024, 0.058), 1),
  )
  heroGeometry.setAttribute(
    'aSeed',
    new THREE.BufferAttribute(emberScalars(HERO_COUNT, 0, 100), 1),
  )
  heroGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(HERO_COUNT * 3), 3),
  )
  heroGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 100)

  // --- Ember field: the ash letters, the dust, and the final line ---------
  const avyaPool: [number, number][] = []
  for (let i = 1; i < wordChars.length; i += 1) {
    const cloud = wordChars[i]
    if (cloud) {
      avyaPool.push(...cloud.points)
    }
  }
  const linePool: [number, number][] = []
  lineChars.forEach((cloud, index) => {
    if (cloud && index !== LINE_S_INDEX) {
      linePool.push(...cloud.points)
    }
  })

  const scatter = scatterVolume(FIELD_COUNT, vw * 0.72, vh * 0.72)
  const wordCount = Math.min(4400, FIELD_COUNT)
  const wordTargets = pickTargets(avyaPool, wordCount)
  const aWord = new Float32Array(FIELD_COUNT * 3)
  aWord.set(wordTargets.subarray(0, wordCount * 3))
  aWord.set(scatter.subarray(wordCount * 3), wordCount * 3)

  // Ash: blown up and to the right on a soft wind.
  const aAsh = new Float32Array(FIELD_COUNT * 3)
  for (let i = 0; i < FIELD_COUNT; i += 1) {
    aAsh[i * 3] = scatter[i * 3] * 0.85 + 1.6 + Math.random() * vw * 0.45
    aAsh[i * 3 + 1] = scatter[i * 3 + 1] * 0.85 + 0.6 + Math.random() * vh * 0.3
    aAsh[i * 3 + 2] = scatter[i * 3 + 2]
  }

  const fieldGeometry = new THREE.BufferGeometry()
  fieldGeometry.setAttribute('aWord', new THREE.BufferAttribute(aWord, 3))
  fieldGeometry.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3))
  fieldGeometry.setAttribute('aAsh', new THREE.BufferAttribute(aAsh, 3))
  fieldGeometry.setAttribute(
    'aLine',
    new THREE.BufferAttribute(pickTargets(linePool, FIELD_COUNT), 3),
  )
  fieldGeometry.setAttribute(
    'aColor',
    new THREE.BufferAttribute(emberColors(FIELD_COUNT), 3),
  )
  fieldGeometry.setAttribute(
    'aSize',
    new THREE.BufferAttribute(emberScalars(FIELD_COUNT, 0.02, 0.05), 1),
  )
  fieldGeometry.setAttribute(
    'aSeed',
    new THREE.BufferAttribute(emberScalars(FIELD_COUNT, 0, 100), 1),
  )
  fieldGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(FIELD_COUNT * 3), 3),
  )
  fieldGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 100)

  return {
    fieldGeometry,
    heroGeometry,
    wordNCenter: wordN.center,
    wordNScale,
    slotCenter: slotS.center,
    slotScale: slotS.height / (bigH * 0.92),
  }
}

function makeMaterial(vertexShader: string, extraUniforms: Record<string, { value: number }>) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: EMBER_FRAGMENT,
    uniforms: {
      uForm: { value: 0 },
      uTime: { value: 0 },
      uPx: { value: 800 },
      uAlpha: { value: 0 },
      ...extraUniforms,
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}

function EmberScene({ progress }: EmberProps) {
  const { viewport, size } = useThree()
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const landRef = useRef<THREE.Group>(null)
  const spinRef = useRef<THREE.Group>(null)
  const flipRef = useRef<THREE.Group>(null)
  const fieldRef = useRef<THREE.Points>(null)
  const heroRef = useRef<THREE.Points>(null)

  useEffect(() => {
    let active = true
    document.fonts?.ready
      .then(() => {
        if (active) {
          setFontsLoaded(true)
        }
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [])

  // Rebuilds once the display font is in so the letterforms match the page.
  const data = useMemo(
    () => buildEmberData(viewport.width, viewport.height, fontsLoaded),
    [viewport.width, viewport.height, fontsLoaded],
  )

  const fieldMaterial = useMemo(
    () => makeMaterial(FIELD_VERTEX, { uAsh: { value: 0 }, uLine: { value: 0 } }),
    [],
  )
  const heroMaterial = useMemo(() => makeMaterial(HERO_VERTEX, { uMorph: { value: 0 } }), [])

  useEffect(() => {
    return () => {
      data?.fieldGeometry.dispose()
      data?.heroGeometry.dispose()
    }
  }, [data])

  useEffect(() => {
    return () => {
      fieldMaterial.dispose()
      heroMaterial.dispose()
    }
  }, [fieldMaterial, heroMaterial])

  useFrame((state) => {
    if (!data) {
      return
    }

    const time = state.clock.elapsedTime
    const p = progress.get()
    const seg = (a: number, b: number) => THREE.MathUtils.smoothstep(p, a, b)

    const px = size.height / (2 * Math.tan((FOV * Math.PI) / 360))
    const appear = seg(0.02, 0.09)
    const form = seg(0.06, 0.2)

    const field = fieldRef.current?.material as THREE.ShaderMaterial | undefined
    if (field) {
      field.uniforms.uTime.value = time
      field.uniforms.uPx.value = px
      field.uniforms.uAlpha.value = appear
      field.uniforms.uForm.value = form
      field.uniforms.uAsh.value = seg(0.24, 0.36)
      field.uniforms.uLine.value = seg(0.78, 0.885)
    }

    const hero = heroRef.current?.material as THREE.ShaderMaterial | undefined
    if (hero) {
      hero.uniforms.uTime.value = time
      hero.uniforms.uPx.value = px
      hero.uniforms.uAlpha.value = appear
      hero.uniforms.uForm.value = form
      hero.uniforms.uMorph.value = seg(0.64, 0.745)
    }

    if (flipRef.current) {
      flipRef.current.rotation.x = Math.PI * seg(0.42, 0.5)
    }
    if (spinRef.current) {
      spinRef.current.rotation.z = (-Math.PI / 2) * seg(0.54, 0.62)
    }
    if (landRef.current) {
      const zoom = seg(0.24, 0.38)
      const land = seg(0.78, 0.885)
      let scale: number
      let x: number
      let y: number
      if (land > 0) {
        scale = THREE.MathUtils.lerp(1, data.slotScale, land)
        x = THREE.MathUtils.lerp(0, data.slotCenter[0], land)
        y = THREE.MathUtils.lerp(0, data.slotCenter[1], land)
      } else {
        scale = THREE.MathUtils.lerp(data.wordNScale, 1, zoom)
        x = THREE.MathUtils.lerp(data.wordNCenter[0], 0, zoom)
        y = THREE.MathUtils.lerp(data.wordNCenter[1], 0, zoom)
      }
      landRef.current.scale.setScalar(scale)
      landRef.current.position.set(x, y, 0)
    }
  })

  if (!data) {
    return null
  }

  return (
    <>
      <points
        ref={fieldRef}
        geometry={data.fieldGeometry}
        material={fieldMaterial}
        frustumCulled={false}
      />
      <group ref={landRef}>
        <group ref={spinRef}>
          <group ref={flipRef}>
            <points
              ref={heroRef}
              geometry={data.heroGeometry}
              material={heroMaterial}
              frustumCulled={false}
            />
          </group>
        </group>
      </group>
    </>
  )
}

export function FinaleEmbers({ progress }: EmberProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, CAMERA_Z], fov: FOV, near: 0.1, far: 60 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <EmberScene progress={progress} />
    </Canvas>
  )
}
