import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { PAGE_HEIGHT, PAGE_WIDTH, type Sheet } from './bookLayout'
import type { BookControlState } from './useBookControls'
import { PageSheet } from './PageSheet'

/**
 * The Book's stage: a transparent canvas floating in the app's constellation
 * sky. Entry is deliberately simple: the route transition fades the page in
 * while the book eases up from a hair smaller into place. A warm key light
 * and a blush rim model the pages; the book idles with a float, leans with
 * the pointer, and slides sideways so a closed book stays centered on its
 * lone visible cover.
 */

type BookSceneProps = {
  sheets: Sheet[]
  turned: number
  controls: React.RefObject<BookControlState>
  compact: boolean
}

export function BookScene({ sheets, turned, controls, compact }: BookSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 45, near: 0.1, far: 30, position: [0, 0, 2.7] }}
    >
      <ambientLight intensity={0.85} color="#8d7ab8" />
      <hemisphereLight args={['#9c86d4', '#0a0616', 0.5]} />
      {/* Warm reading lamp over the right shoulder */}
      <pointLight position={[1.3, 1.5, 2.2]} color="#f4d9a6" intensity={16} decay={1.8} />
      {/* Blush rim from the lower left */}
      <pointLight position={[-1.6, -0.9, 1.4]} color="#f7b8d4" intensity={5} decay={1.9} />

      <BookGroup sheets={sheets} turned={turned} controls={controls} />

      <Sparkles
        count={compact ? 26 : 52}
        scale={[3.8, 2.3, 1.6]}
        size={1.8}
        speed={0.25}
        color="#f4d9a6"
        opacity={0.45}
      />
    </Canvas>
  )
}

// ---------------------------------------------------------------------------
// Spiral binding
// ---------------------------------------------------------------------------

const ringMaterial = new THREE.MeshStandardMaterial({
  color: '#16161c',
  metalness: 0.7,
  roughness: 0.28,
})

const RING_COUNT = 13
const RING_RADIUS = 0.072

/** The black wire O-rings of the album, threaded along the hinge axis. */
function SpiralRings() {
  const ys = useMemo(() => {
    const span = PAGE_HEIGHT * 0.94
    return Array.from(
      { length: RING_COUNT },
      (_, i) => -span / 2 + (span * i) / (RING_COUNT - 1),
    )
  }, [])

  return (
    <group>
      {ys.map((y) => (
        <mesh
          key={y}
          material={ringMaterial}
          position={[0, y, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[RING_RADIUS, 0.0062, 10, 26]} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// The album itself
// ---------------------------------------------------------------------------

/** Resting reading tilt. */
const REST_TILT_X = -0.16

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

function BookGroup({
  sheets,
  turned,
  controls,
}: Pick<BookSceneProps, 'sheets' | 'turned' | 'controls'>) {
  const groupRef = useRef<THREE.Group>(null)
  const shiftRef = useRef<THREE.Group>(null)
  const settledRef = useRef(false)

  const { viewport, size } = useThree()
  const total = sheets.length

  useFrame(({ clock }, delta) => {
    const group = groupRef.current
    const shift = shiftRef.current
    if (!group || !shift) {
      return
    }
    const state = controls.current
    const time = clock.elapsedTime

    // Let the gesture layer convert finger travel into world-space pan.
    state.worldPerPixel = viewport.width / size.width

    // Continuous "how far through the book" including the live drag.
    let through = state.turned
    if (state.drag) {
      through += state.drag.progress - (state.drag.sheet < state.turned ? 1 : 0)
    }

    // Dynamic fit: a closed book is one page wide, an open one is two — so
    // the cover presents big (especially on phones) and the view breathes
    // out as the album opens.
    const openAmount = clamp01(Math.min(through, total - through))
    const visibleWidth = PAGE_WIDTH * (1 + openAmount) + 0.24
    const fitWidth = (viewport.width * 0.94) / visibleWidth
    const fitHeight = (viewport.height * 0.58) / PAGE_HEIGHT
    const baseScale = Math.min(1.45, fitWidth, fitHeight)

    // Fitted scale × user pinch/wheel zoom. First frame starts a hair small;
    // the damp then eases it up into place — the whole entrance transition.
    const targetScale = baseScale * state.zoom
    if (!settledRef.current) {
      settledRef.current = true
      group.scale.setScalar(targetScale * 0.95)
    } else {
      group.scale.setScalar(
        THREE.MathUtils.damp(group.scale.x, targetScale, 4.5, delta),
      )
    }

    // Slide so a closed book stays centered on its lone visible cover.
    const closedRight = 1 - Math.min(1, through)
    const closedLeft = Math.max(0, through - (total - 1))
    const targetX = (PAGE_WIDTH / 2) * (closedLeft - closedRight)
    shift.position.x = THREE.MathUtils.damp(shift.position.x, targetX, 4, delta)

    // Keep the reader's pan inside the zoomed page (no wandering off into
    // the sky); the bounds collapse to 0 as the zoom returns to fitted.
    const maxPanX = Math.max(
      0,
      (visibleWidth * targetScale - viewport.width) / 2 + 0.05,
    )
    const maxPanY = Math.max(
      0,
      (PAGE_HEIGHT * targetScale - viewport.height) / 2 + 0.05,
    )
    state.pan.x = Math.min(maxPanX, Math.max(-maxPanX, state.pan.x))
    state.pan.y = Math.min(maxPanY, Math.max(-maxPanY, state.pan.y))

    // Idle float + pointer lean + a slow sway — all of it calms down as the
    // reader zooms in, so the text holds still under their eyes.
    const calm = 1 / state.zoom
    group.position.z = 0
    group.position.x = THREE.MathUtils.damp(group.position.x, state.pan.x, 8, delta)
    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      state.pan.y + Math.sin(time * 0.55) * 0.018 * calm,
      8,
      delta,
    )
    group.rotation.z = 0
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      (REST_TILT_X + state.pointer.y * 0.09 + Math.sin(time * 0.4) * 0.014) * calm,
      3,
      delta,
    )
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      (state.pointer.x * 0.16 + Math.sin(time * 0.32) * 0.035) * calm,
      3,
      delta,
    )
  })

  return (
    // Resting tilt from frame one — the arrival dolly films a settled book.
    <group ref={groupRef} rotation={[REST_TILT_X, 0, 0]}>
      {/* Closed book starts centered on the cover, not the hinge. */}
      <group ref={shiftRef} position={[-PAGE_WIDTH / 2, 0, 0]}>
        <SpiralRings />

        {sheets.map((sheet, index) => (
          <PageSheet
            key={index}
            index={index}
            front={sheet.front}
            back={sheet.back}
            isCover={sheet.isCover}
            active={sheet.isCover || Math.abs(index - turned) <= 4}
            controls={controls}
          />
        ))}
      </group>
    </group>
  )
}
