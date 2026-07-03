import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { animate, useMotionValue } from 'motion/react'
import {
  emberColors,
  emberScalars,
  makeEmberMaterial,
} from '../lib/emberGlsl'
import { samplePathToPoints } from '../lib/pointSampling'

/**
 * Embers riding the heart iris: as the unlock iris blooms open, a swarm of
 * embers traces the growing heart outline and sparks outward; on seal they
 * converge with the closing iris and snuff out at the centre.
 *
 * Decorative only — the SVG mask in CinematicTransition still performs the
 * actual reveal cut. Lazy-loaded; the original SVG rim + hearts remain the
 * fallback while this chunk loads or when WebGL is unavailable.
 */

// Matches HEART_PATH in CinematicTransition (100×100 box).
const HEART_PATH =
  'M50,86 C 22,64 10,45 10,30 C 10,17 19,9 30,9 C 39,9 46,16 50,23 C 54,16 61,9 70,9 C 81,9 90,17 90,30 C 90,45 78,64 50,86 Z'

const COUNT_DESKTOP = 900
const COUNT_COMPACT = 400

// Mirrors the mask animation in CinematicTransition.
const IRIS_EASE = [0.5, 0, 0.22, 1] as const
const UNLOCK_SECONDS = 1.4
const SEAL_SECONDS = 0.75

type HeartIrisEmbersProps = {
  variant: 'unlock' | 'seal'
  compact: boolean
}

const IRIS_VERTEX = /* glsl */ `
  attribute vec2 aOutline;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPx;
  uniform float uScale;   // world units the unit heart box spans right now
  uniform float uSpark;   // 0..1 outward spark energy
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec2 rim = aOutline * uScale;
    // Sparks fly outward along the rim normal-ish direction, each at its own
    // pace, wobbling as they cool.
    vec2 dir = normalize(aOutline + vec2(0.0001));
    float pace = 0.4 + fract(aSeed * 0.713) * 0.9;
    vec2 p = rim + dir * uSpark * pace * 1.6;
    p.x += sin(uTime * 2.1 + aSeed * 23.0) * 0.05 * (0.3 + uSpark);
    p.y += cos(uTime * 2.4 + aSeed * 31.0) * 0.05 * (0.3 + uSpark);

    vColor = aColor;
    vTwinkle = 0.72 + 0.28 * sin(uTime * 3.0 + aSeed * 43.0);
    vec4 mv = modelViewMatrix * vec4(p, 0.0, 1.0);
    gl_PointSize = aSize * vTwinkle * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`

function IrisScene({ variant, compact }: HeartIrisEmbersProps) {
  const { viewport, size } = useThree()
  const pointsRef = useRef<THREE.Points>(null)
  const count = compact ? COUNT_COMPACT : COUNT_DESKTOP

  // 0..1 progress with the same curve the SVG mask uses.
  const progress = useMotionValue(0)
  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: variant === 'unlock' ? UNLOCK_SECONDS : SEAL_SECONDS,
      ease: variant === 'unlock' ? IRIS_EASE : 'easeInOut',
    })
    return () => controls.stop()
  }, [progress, variant])

  const geometry = useMemo(() => {
    const raw = samplePathToPoints(HEART_PATH, count)
    // Centre the outline on the path's own bounding box and normalise to a
    // unit box, so `uScale` maps it straight into world units.
    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    for (let i = 0; i < count; i += 1) {
      minX = Math.min(minX, raw[i * 2])
      maxX = Math.max(maxX, raw[i * 2])
      minY = Math.min(minY, raw[i * 2 + 1])
      maxY = Math.max(maxY, raw[i * 2 + 1])
    }
    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2
    const outline = new Float32Array(count * 2)
    for (let i = 0; i < count; i += 1) {
      outline[i * 2] = (raw[i * 2] - cx) / 100
      outline[i * 2 + 1] = (cy - raw[i * 2 + 1]) / 100
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('aOutline', new THREE.BufferAttribute(outline, 2))
    geo.setAttribute('aColor', new THREE.BufferAttribute(emberColors(count), 3))
    geo.setAttribute(
      'aSize',
      new THREE.BufferAttribute(emberScalars(count, 0.03, 0.07), 1),
    )
    geo.setAttribute(
      'aSeed',
      new THREE.BufferAttribute(emberScalars(count, 0, 100), 1),
    )
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(count * 3), 3),
    )
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 100)
    return geo
  }, [count])

  const material = useMemo(() => makeEmberMaterial(IRIS_VERTEX, {
    uScale: { value: 0 },
    uSpark: { value: 0 },
  }), [])

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  useFrame((state) => {
    const active = pointsRef.current?.material as THREE.ShaderMaterial | undefined
    if (!active) {
      return
    }
    const t = progress.get()
    // The SVG mask scales its heart 0.02→3.4 across a slice-fitted 100-unit
    // viewBox; the world equivalent spans the larger viewport axis.
    const grow = variant === 'unlock' ? t : 1 - t
    const maskScale = 0.02 + grow * (3.4 - 0.02)
    const baseWorld = Math.max(viewport.width, viewport.height)

    const u = active.uniforms
    u.uScale.value = maskScale * baseWorld
    u.uSpark.value = variant === 'unlock' ? t * t : (1 - t) * 0.25
    u.uTime.value = state.clock.elapsedTime
    u.uPx.value = size.height / (2 * Math.tan((50 * Math.PI) / 360))
    // Bright through the middle of the motion, gone at both ends.
    u.uAlpha.value = Math.sin(Math.min(Math.max(t, 0), 1) * Math.PI)
  })

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  )
}

export default function HeartIrisEmbers(props: HeartIrisEmbersProps) {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 60 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <IrisScene {...props} />
      </Canvas>
    </div>
  )
}
