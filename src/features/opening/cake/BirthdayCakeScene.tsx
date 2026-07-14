import { useEffect, useRef, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { CakeModel } from './CakeModel'
import { Candles } from './Candles'
import { HeartBalloons3D } from './HeartBalloons3D'
import { driftCakeSpin, type CakePhase, type CakeSpin } from './cakeShared'

/**
 * The lazy-loaded WebGL half of the cake act. Transparent canvas — the
 * constellation sky stays the backdrop. Like the reference site, the scene
 * carries no direct lights: everything is lit by a procedural studio
 * environment (soft ceiling key + pastel side fills), which is what gives
 * the glaze its long soft highlights. Long lens (fov 30) for the
 * product-shot framing.
 */

type BirthdayCakeSceneProps = {
  phase: CakePhase
  /** Mutable drag-to-spin state owned by the DOM wrapper, passed as a ref. */
  spin: RefObject<CakeSpin>
  /** Heart balloons fly while true. */
  balloons: boolean
  onTapCandle: () => void
  compact: boolean
  name: string
}

function CakeStage({
  phase,
  spin,
  balloons,
  onTapCandle,
  compact,
  name,
}: BirthdayCakeSceneProps) {
  const clock = useThree((state) => state.clock)

  const cakeGroupRef = useRef<THREE.Group>(null)
  const startRef = useRef<number | null>(null)
  const framedPortrait = useRef<boolean | null>(null)

  // The assembly clock starts the first time the act wakes up.
  useEffect(() => {
    if (phase !== 'waiting' && startRef.current === null) {
      startRef.current = clock.getElapsedTime()
    }
  }, [phase, clock])

  useFrame((state, delta) => {
    // Frame the cake for the viewport: wider lens + further back on portrait.
    // The top ~28% of the frame stays clear for the whisper overlay.
    const portrait = state.size.width / state.size.height < 0.85
    if (framedPortrait.current !== portrait) {
      framedPortrait.current = portrait
      const persp = state.camera as THREE.PerspectiveCamera
      persp.fov = portrait ? 38 : 30
      persp.position.set(0, 2.55, portrait ? 14.2 : 12.8)
      persp.lookAt(0, portrait ? 1.75 : 1.85, 0)
      persp.updateProjectionMatrix()
    }

    const group = cakeGroupRef.current
    const spinState = spin.current
    if (!group || !spinState) {
      return
    }
    driftCakeSpin(spinState, delta)
    const ease = 1 - Math.exp(-6 * delta)
    group.rotation.y += (spinState.target - group.rotation.y) * ease
    const tilt = THREE.MathUtils.clamp(spinState.tilt, -0.14, 0.14)
    group.rotation.x += (tilt - group.rotation.x) * ease
  })

  return (
    <>
      {/* Studio softbox environment — the scene's only light source */}
      <Environment resolution={256}>
        <Lightformer
          intensity={2.1}
          position={[0, 6, 0]}
          rotation-x={Math.PI / 2}
          scale={[12, 12, 1]}
          color="#fff6ea"
        />
        <Lightformer
          intensity={1.5}
          position={[0, 2.5, 8]}
          target={[0, 1.5, 0]}
          scale={[10, 6, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={1.15}
          position={[-7, 2.5, 2]}
          target={[0, 1.5, 0]}
          scale={[8, 5, 1]}
          color="#ffd3e8"
        />
        <Lightformer
          intensity={1.15}
          position={[7, 2.5, 2]}
          target={[0, 1.5, 0]}
          scale={[8, 5, 1]}
          color="#cdd8ff"
        />
        <Lightformer
          intensity={0.9}
          position={[0, 1.5, -7]}
          target={[0, 1.5, 0]}
          scale={[10, 4, 1]}
          color="#e8d8ff"
        />
      </Environment>

      <group ref={cakeGroupRef}>
        <CakeModel startRef={startRef} name={name} />
        <Candles phase={phase} startRef={startRef} onTapCandle={onTapCandle} />
      </group>

      <HeartBalloons3D active={balloons} compact={compact} />

      <Sparkles
        count={compact ? 36 : 70}
        position={[0, 2.2, 0]}
        scale={[7.5, 4.5, 7.5]}
        size={2}
        speed={0.3}
        opacity={0.5}
        color="#e7d9ff"
      />
    </>
  )
}

export default function BirthdayCakeScene(props: BirthdayCakeSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 30, position: [0, 2.55, 10.6] }}
    >
      <CakeStage {...props} />
    </Canvas>
  )
}
