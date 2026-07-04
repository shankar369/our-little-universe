import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { MuseumInput } from '../useMuseumInput'
import { EYE_HEIGHT, WALL_MARGIN, type MuseumLayout } from '../museumLayout'
import type { MuseumPhase } from '../museumTypes'

/**
 * The visitor: a first-person camera rig with five moods —
 * standing at the entrance (idle sway), the dolly through the opening doors,
 * free walking (keys / joystick / drag-look, walls respected), gliding into a
 * photo (focus), and gliding back out. All motion lives in refs; React only
 * tells the rig which mood to be in.
 */

export type FocusTarget = {
  index: number
  position: [number, number, number]
  normal: [number, number, number]
  width: number
  height: number
}

type RigMode = 'entrance' | 'dolly' | 'free' | 'toFocus' | 'focused' | 'fromFocus'

type PoseAnim = {
  t: number
  duration: number
  fromPos: THREE.Vector3
  toPos: THREE.Vector3
  fromYaw: number
  toYaw: number
  fromPitch: number
  toPitch: number
  after: RigMode
}

type FirstPersonRigProps = {
  layout: MuseumLayout
  phase: MuseumPhase
  input: MuseumInput
  focus: FocusTarget | null
  onDollyDone: () => void
}

const WALK_SPEED = 3.1
const LOOK_SENSITIVITY = 0.0042
const PITCH_LIMIT = 0.85

function ease(t: number) {
  return t * t * (3 - 2 * t)
}

/** Shortest signed angle from `from` to `to`. */
function angleDelta(from: number, to: number) {
  return THREE.MathUtils.euclideanModulo(to - from + Math.PI, Math.PI * 2) - Math.PI
}

export function FirstPersonRig({
  layout,
  phase,
  input,
  focus,
  onDollyDone,
}: FirstPersonRigProps) {
  const { camera } = useThree()
  const pos = useRef(new THREE.Vector3(...layout.entranceCam))
  const yaw = useRef(0)
  const pitch = useRef(0)
  const velocity = useRef(new THREE.Vector2(0, 0))
  const walkPhase = useRef(0)
  const mode = useRef<RigMode>('entrance')
  const anim = useRef<PoseAnim | null>(null)
  const savedPose = useRef<{ pos: THREE.Vector3; yaw: number; pitch: number } | null>(null)

  // Doors opening → dolly from the porch to just inside.
  useEffect(() => {
    if (phase === 'opening' && mode.current === 'entrance') {
      anim.current = {
        t: 0,
        duration: 2.7,
        fromPos: pos.current.clone(),
        toPos: new THREE.Vector3(...layout.insideStart),
        fromYaw: yaw.current,
        toYaw: yaw.current + angleDelta(yaw.current, 0),
        fromPitch: pitch.current,
        toPitch: 0,
        after: 'free',
      }
      mode.current = 'dolly'
    }
  }, [phase, layout])

  // Focus in / out of a photo.
  useEffect(() => {
    if (focus) {
      savedPose.current = {
        pos: pos.current.clone(),
        yaw: yaw.current,
        pitch: pitch.current,
      }

      // Stand back far enough that the whole photo fits the view.
      const persp = camera as THREE.PerspectiveCamera
      const vHalf = Math.tan(THREE.MathUtils.degToRad(persp.fov) / 2)
      const hHalf = vHalf * persp.aspect
      const distance =
        Math.max(focus.height / 2 / vHalf, focus.width / 2 / hHalf) * 1.16 + 0.12
      const normal = new THREE.Vector3(...focus.normal)
      const photoCentre = new THREE.Vector3(...focus.position)
      const toPos = photoCentre.clone().addScaledVector(normal, distance)
      const toYaw = Math.atan2(normal.x, normal.z)
      const toPitch = Math.atan2(photoCentre.y - toPos.y, distance) * 0.9

      anim.current = {
        t: 0,
        duration: 1.1,
        fromPos: pos.current.clone(),
        toPos,
        fromYaw: yaw.current,
        toYaw: yaw.current + angleDelta(yaw.current, toYaw),
        fromPitch: pitch.current,
        toPitch,
        after: 'focused',
      }
      mode.current = 'toFocus'
    } else if (savedPose.current) {
      const saved = savedPose.current
      anim.current = {
        t: 0,
        duration: 0.9,
        fromPos: pos.current.clone(),
        toPos: saved.pos.clone(),
        fromYaw: yaw.current,
        toYaw: yaw.current + angleDelta(yaw.current, saved.yaw),
        fromPitch: pitch.current,
        toPitch: saved.pitch,
        after: 'free',
      }
      mode.current = 'fromFocus'
      savedPose.current = null
    }
  }, [focus, camera])

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 20)
    const time = state.clock.elapsedTime
    const rigCamera = state.camera
    let bob = 0

    // Yaw-then-pitch ordering keeps drag-look free of roll.
    rigCamera.rotation.order = 'YXZ'

    // Drop look input accumulated while the rig is driving the camera —
    // otherwise it lands as one violent snap when control returns.
    const lookRef = input.lookRef
    if (mode.current !== 'free') {
      lookRef.current.dx = 0
      lookRef.current.dy = 0
    }

    if (mode.current === 'entrance') {
      // Standing on the porch, breathing.
      yaw.current = Math.sin(time * 0.24) * 0.025
      pitch.current = Math.sin(time * 0.31) * 0.012
      bob = Math.sin(time * 0.9) * 0.015
    } else if (
      mode.current === 'dolly' ||
      mode.current === 'toFocus' ||
      mode.current === 'fromFocus'
    ) {
      const active = anim.current
      if (active) {
        active.t = Math.min(active.t + delta, active.duration)
        const s = ease(active.t / active.duration)
        pos.current.lerpVectors(active.fromPos, active.toPos, s)
        yaw.current = THREE.MathUtils.lerp(active.fromYaw, active.toYaw, s)
        pitch.current = THREE.MathUtils.lerp(active.fromPitch, active.toPitch, s)
        if (active.t >= active.duration) {
          const finished = mode.current
          mode.current = active.after
          anim.current = null
          if (finished === 'dolly') {
            onDollyDone()
          }
        }
      } else {
        mode.current = 'free'
      }
    } else if (mode.current === 'focused') {
      // Standing with the photo — the faintest breath so it stays alive.
      bob = Math.sin(time * 0.8) * 0.008
    } else {
      // Free walking.
      yaw.current -= lookRef.current.dx * LOOK_SENSITIVITY
      pitch.current = THREE.MathUtils.clamp(
        pitch.current - lookRef.current.dy * LOOK_SENSITIVITY,
        -PITCH_LIMIT,
        PITCH_LIMIT,
      )
      lookRef.current.dx = 0
      lookRef.current.dy = 0

      const keys = input.keysRef.current
      const stick = input.stickRef.current
      let moveX = THREE.MathUtils.clamp(keys.x + stick.x, -1, 1)
      let moveY = THREE.MathUtils.clamp(keys.y + stick.y, -1, 1)
      const magnitude = Math.hypot(moveX, moveY)
      if (magnitude > 1) {
        moveX /= magnitude
        moveY /= magnitude
      }

      // Ease velocity toward the target for a little human weight.
      const targetX = moveX * WALK_SPEED
      const targetY = moveY * WALK_SPEED
      const smoothing = Math.min(1, delta * 9)
      velocity.current.x += (targetX - velocity.current.x) * smoothing
      velocity.current.y += (targetY - velocity.current.y) * smoothing

      const sin = Math.sin(yaw.current)
      const cos = Math.cos(yaw.current)
      pos.current.x += (-sin * velocity.current.y + cos * velocity.current.x) * delta
      pos.current.z += (-cos * velocity.current.y - sin * velocity.current.x) * delta

      // Walls are walls.
      const xLimit = layout.width / 2 - WALL_MARGIN
      pos.current.x = THREE.MathUtils.clamp(pos.current.x, -xLimit, xLimit)
      pos.current.z = THREE.MathUtils.clamp(
        pos.current.z,
        -layout.length / 2 + WALL_MARGIN,
        layout.doorZ - WALL_MARGIN,
      )
      pos.current.y = EYE_HEIGHT

      const speed = velocity.current.length()
      if (speed > 0.4) {
        walkPhase.current += delta * (4.4 + speed)
        bob = Math.sin(walkPhase.current) * 0.032
      }
    }

    rigCamera.position.set(pos.current.x, pos.current.y + bob, pos.current.z)
    rigCamera.rotation.set(pitch.current, yaw.current, 0)
  })

  return null
}
