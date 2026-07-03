import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useScroll, useSpring, useVelocity, type MotionValue } from 'motion/react'
import {
  emberColors,
  emberScalars,
  makeEmberMaterial,
  scatterVolume,
} from '../../shared/lib/emberGlsl'

/**
 * The locker's ember atmosphere: one fixed WebGL layer of sparse embers that
 * lives behind every act of the scroll cinema. Scrolling stirs it — embers
 * drift with your scroll speed and glow a touch brighter while you move — and
 * as the finale approaches it fades low so FinaleEmbers reads as the crescendo
 * of the same field, not a separate scene.
 *
 * Mounted only when `useRichMotion().rich` is true; the acts keep their static
 * glows otherwise.
 */

const CAMERA_Z = 10
const FOV = 50
const COUNT_DESKTOP = 1000
const COUNT_COMPACT = 450
const MAX_SCROLL_SPEED = 4000 // px/s — rubber-band bounces can't fling the field

type LockerAtmosphereProps = {
  compact: boolean
  /** Wrapper around FinaleAct — the atmosphere dims as it enters. */
  finaleRef: RefObject<HTMLDivElement | null>
  /** 0..1 — embers smear into horizontal light streaks (driven by Act II). */
  streak?: MotionValue<number>
}

const ATMOSPHERE_VERTEX = /* glsl */ `
  attribute vec3 aBase;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPx;
  uniform float uDrift;
  uniform float uGlow;
  uniform float uSpanY;
  uniform float uWarm;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    // Each ember rises at its own gentle pace; scroll drift adds a shared
    // current (per-ember factor keeps the field from moving as one plate).
    float rise = 0.05 + fract(aSeed * 0.371) * 0.09;
    float y = aBase.y + uTime * rise + uDrift * (0.55 + fract(aSeed * 0.731) * 0.9);
    y = mod(y + uSpanY * 0.5, uSpanY) - uSpanY * 0.5;
    float sway = sin(uTime * (0.4 + fract(aSeed * 0.517)) + aSeed) * 0.12;
    vec3 p = vec3(aBase.x + sway, y, aBase.z);

    // The whole field warms toward gold as the cinema deepens.
    float lum = max(aColor.r, max(aColor.g, aColor.b));
    vColor = mix(aColor, vec3(1.0, 0.86, 0.58) * lum, uWarm);
    vTwinkle = 0.7 + 0.3 * sin(uTime * 2.2 + aSeed * 43.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * vTwinkle * (1.0 + uGlow * 0.5) * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`

type AtmosphereSceneProps = {
  count: number
  drift: MotionValue<number>
  pageProgress: MotionValue<number>
  finaleProgress: MotionValue<number>
  streak?: MotionValue<number>
}

function AtmosphereScene({
  count,
  drift,
  pageProgress,
  finaleProgress,
  streak,
}: AtmosphereSceneProps) {
  const { viewport, size } = useThree()
  const pointsRef = useRef<THREE.Points>(null)
  const driftWorld = useRef(0)
  const appear = useRef(0)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute(
      'aBase',
      new THREE.BufferAttribute(
        scatterVolume(count, viewport.width * 0.55, viewport.height * 0.58),
        3,
      ),
    )
    geo.setAttribute('aColor', new THREE.BufferAttribute(emberColors(count), 3))
    geo.setAttribute(
      'aSize',
      new THREE.BufferAttribute(emberScalars(count, 0.018, 0.05), 1),
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
  }, [count, viewport.width, viewport.height])

  const material = useMemo(
    () =>
      makeEmberMaterial(ATMOSPHERE_VERTEX, {
        uDrift: { value: 0 },
        uGlow: { value: 0 },
        uSpanY: { value: 10 },
        uWarm: { value: 0 },
      }),
    [],
  )

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  useFrame((state, delta) => {
    const velocity = THREE.MathUtils.clamp(
      drift.get(),
      -MAX_SCROLL_SPEED,
      MAX_SCROLL_SPEED,
    )
    // px/s → world units/s; scrolling down sends the field gently upward.
    const worldPerPx = viewport.height / size.height
    driftWorld.current += velocity * worldPerPx * delta * 0.35
    appear.current = Math.min(appear.current + delta / 1.2, 1)

    const glow = Math.min(Math.abs(velocity) / 2500, 1)
    const finaleDim = 1 - finaleProgress.get() * 0.75

    const active = pointsRef.current?.material as THREE.ShaderMaterial | undefined
    if (!active) {
      return
    }
    const u = active.uniforms
    u.uTime.value = state.clock.elapsedTime
    u.uPx.value = size.height / (2 * Math.tan((FOV * Math.PI) / 360))
    u.uDrift.value = driftWorld.current
    u.uGlow.value = glow
    u.uSpanY.value = viewport.height * 1.16
    u.uWarm.value = pageProgress.get() * 0.55
    u.uAlpha.value = appear.current * 0.85 * finaleDim
    u.uStretch.value = streak?.get() ?? 0
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

export function LockerAtmosphere({
  compact,
  finaleRef,
  streak,
}: LockerAtmosphereProps) {
  const { scrollY, scrollYProgress } = useScroll()
  const velocity = useVelocity(scrollY)
  const drift = useSpring(velocity, { stiffness: 60, damping: 24, mass: 0.8 })
  const { scrollYProgress: finaleProgress } = useScroll({
    target: finaleRef,
    offset: ['start end', 'start start'],
  })

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, CAMERA_Z], fov: FOV, near: 0.1, far: 60 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <AtmosphereScene
          count={compact ? COUNT_COMPACT : COUNT_DESKTOP}
          drift={drift}
          pageProgress={scrollYProgress}
          finaleProgress={finaleProgress}
          streak={streak}
        />
      </Canvas>
    </div>
  )
}
