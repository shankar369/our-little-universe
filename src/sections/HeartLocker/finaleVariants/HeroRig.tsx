import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'
import { finaleBeats, type FinaleTargets } from './finaleEngine'

/**
 * The shared hero transform: whatever typeface or material a variant dresses
 * its swarm in, the N performs the same signature move — zoom out of the
 * word, flip upside-down, quarter-turn clockwise, then land in the S's slot
 * of the final line. Children are the variant's hero points.
 */
export function HeroRig({
  targets,
  progress,
  children,
}: {
  targets: FinaleTargets
  progress: MotionValue<number>
  children: ReactNode
}) {
  const landRef = useRef<THREE.Group>(null)
  const spinRef = useRef<THREE.Group>(null)
  const flipRef = useRef<THREE.Group>(null)

  useFrame(() => {
    const beats = finaleBeats(progress.get())

    if (flipRef.current) {
      flipRef.current.rotation.x = Math.PI * beats.flip
    }
    if (spinRef.current) {
      spinRef.current.rotation.z = (-Math.PI / 2) * beats.turn
    }
    if (landRef.current) {
      let scale: number
      let x: number
      let y: number
      if (beats.line > 0) {
        scale = THREE.MathUtils.lerp(1, targets.slotScale, beats.line)
        x = THREE.MathUtils.lerp(0, targets.slotCenter[0], beats.line)
        y = THREE.MathUtils.lerp(0, targets.slotCenter[1], beats.line)
      } else {
        scale = THREE.MathUtils.lerp(targets.wordNScale, 1, beats.zoom)
        x = THREE.MathUtils.lerp(targets.wordNCenter[0], 0, beats.zoom)
        y = THREE.MathUtils.lerp(targets.wordNCenter[1], 0, beats.zoom)
      }
      landRef.current.scale.setScalar(scale)
      landRef.current.position.set(x, y, 0)
    }
  })

  return (
    <group ref={landRef}>
      <group ref={spinRef}>
        <group ref={flipRef}>{children}</group>
      </group>
    </group>
  )
}
