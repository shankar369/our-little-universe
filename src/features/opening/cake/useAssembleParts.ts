import { useCallback, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import { backOut, easeOutCubic } from './cakeShared'

/**
 * The cake's entrance choreography: every registered group stays hidden until
 * the assembly clock starts, then pops in with a springy `backOut` scale and a
 * small settle-drop, staggered by its `delay`. All animation lives in
 * `useFrame` refs — zero React state per frame.
 */

type PartConfig = {
  /** Seconds into the assembly timeline before this part appears. */
  delay: number
  /** Grow/settle duration in seconds. */
  duration?: number
  /** How far above its resting spot the part starts. */
  drop?: number
}

type PartRuntime = Required<PartConfig> & {
  group: THREE.Group
  restY: number
}

export function useAssembleParts(startRef: RefObject<number | null>) {
  const partsRef = useRef(new Map<string, PartRuntime>())

  /** Returns a ref callback registering `name` into the assembly timeline. */
  const part = useCallback(
    (name: string, config: PartConfig) => (group: THREE.Group | null) => {
      if (group) {
        // Ref callbacks re-attach on every re-render; if that happens while
        // the part is mid-drop, the group's current (animated) y must NOT
        // become its new resting height — keep the first captured restY for
        // the same group, else parts freeze floating in the air.
        const existing = partsRef.current.get(name)
        partsRef.current.set(name, {
          group,
          restY:
            existing && existing.group === group ? existing.restY : group.position.y,
          delay: config.delay,
          duration: config.duration ?? 0.7,
          drop: config.drop ?? 0.55,
        })
      }
      // Deliberately keep stale entries on detach: React detaches/re-attaches
      // every render, and the map is re-populated right after.
    },
    [],
  )

  useFrame(({ clock }) => {
    const start = startRef.current
    for (const { group, restY, delay, duration, drop } of partsRef.current.values()) {
      if (start === null) {
        group.visible = false
        continue
      }
      const progress = (clock.getElapsedTime() - start - delay) / duration
      if (progress <= 0) {
        group.visible = false
        continue
      }
      group.visible = true
      if (progress >= 1) {
        group.scale.setScalar(1)
        group.position.y = restY
        continue
      }
      group.scale.setScalar(Math.max(0.001, backOut(progress)))
      group.position.y = restY + (1 - easeOutCubic(progress)) * drop
    }
  })

  return part
}
