import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Undo2 } from 'lucide-react'
import { softEase } from '../../design/motion'
import type { MoveVector } from './useMuseumInput'

/**
 * The walking chrome: a virtual joystick (touch-first, but mouse users can
 * grab it too), a whispered how-to that fades away, and the immersive photo
 * overlay with its caption and "step back" affordance.
 */

const STICK_RADIUS = 48

type JoystickProps = {
  moveRef: React.RefObject<MoveVector>
}

function Joystick({ moveRef }: JoystickProps) {
  const knobRef = useRef<HTMLDivElement | null>(null)
  const pointerId = useRef<number | null>(null)
  const baseRef = useRef<HTMLDivElement | null>(null)

  function setKnob(dx: number, dy: number) {
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`
    }
  }

  function updateFromPointer(event: React.PointerEvent) {
    const base = baseRef.current
    if (!base) {
      return
    }
    const rect = base.getBoundingClientRect()
    let dx = event.clientX - (rect.left + rect.width / 2)
    let dy = event.clientY - (rect.top + rect.height / 2)
    const length = Math.hypot(dx, dy)
    if (length > STICK_RADIUS) {
      dx = (dx / length) * STICK_RADIUS
      dy = (dy / length) * STICK_RADIUS
    }
    setKnob(dx, dy)
    moveRef.current.x = dx / STICK_RADIUS
    moveRef.current.y = -dy / STICK_RADIUS
  }

  function release() {
    pointerId.current = null
    setKnob(0, 0)
    moveRef.current.x = 0
    moveRef.current.y = 0
  }

  return (
    <div
      ref={baseRef}
      role="application"
      aria-label="Walk around"
      className="pointer-events-auto relative h-32 w-32 rounded-full border border-white/12 bg-deep/40 backdrop-blur-md"
      style={{ touchAction: 'none' }}
      onPointerDown={(event) => {
        if (pointerId.current !== null) {
          return
        }
        pointerId.current = event.pointerId
        event.currentTarget.setPointerCapture(event.pointerId)
        updateFromPointer(event)
      }}
      onPointerMove={(event) => {
        if (pointerId.current === event.pointerId) {
          updateFromPointer(event)
        }
      }}
      onPointerUp={(event) => {
        if (pointerId.current === event.pointerId) {
          release()
        }
      }}
      onPointerCancel={(event) => {
        if (pointerId.current === event.pointerId) {
          release()
        }
      }}
    >
      <div
        ref={knobRef}
        className="absolute left-1/2 top-1/2 -ml-7 -mt-7 h-14 w-14 rounded-full border border-orchid/40 bg-plum/80 shadow-[0_0_18px_rgba(200,148,252,0.35)] transition-transform duration-75"
      >
        <span className="absolute inset-3 rounded-full bg-orchid/25 blur-sm" />
      </div>
    </div>
  )
}

type MuseumHudProps = {
  visible: boolean
  compact: boolean
  moveRef: React.RefObject<MoveVector>
  focusedIndex: number | null
  photoCount: number
  onStepBack: () => void
}

export function MuseumHud({
  visible,
  compact,
  moveRef,
  focusedIndex,
  photoCount,
  onStepBack,
}: MuseumHudProps) {
  const [hintDone, setHintDone] = useState(false)

  useEffect(() => {
    if (!visible || hintDone) {
      return
    }
    const timer = window.setTimeout(() => setHintDone(true), 8000)
    return () => window.clearTimeout(timer)
  }, [visible, hintDone])

  const focused = focusedIndex !== null

  return (
    <>
      {/* Walking hint — whispers once, then leaves you alone */}
      <AnimatePresence>
        {visible && !hintDone && !focused ? (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: softEase }}
            className="type-script night-veil pointer-events-none absolute inset-x-0 top-[max(1.5rem,env(safe-area-inset-top))] z-20 text-center text-moon"
          >
            {compact
              ? 'walk with the pad · drag to look around'
              : 'W A S D to wander · drag to look around'}
          </motion.p>
        ) : null}
      </AnimatePresence>

      {/* Joystick — clear of the fullscreen toggle (bottom-left corner) */}
      <AnimatePresence>
        {visible && !focused ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: softEase }}
            className="pointer-events-none absolute bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.5rem))] left-5 z-20"
          >
            <Joystick moveRef={moveRef} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Immersive photo overlay — tap anywhere to step back */}
      <AnimatePresence>
        {focused ? (
          <motion.button
            type="button"
            aria-label="Step back from the photo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, delay: 0.55, ease: softEase }}
            onClick={onStepBack}
            className="absolute inset-0 z-30 flex cursor-zoom-out flex-col items-center justify-end bg-transparent pb-[max(2rem,env(safe-area-inset-bottom))]"
          >
            <span className="type-script night-veil text-glow mb-3 text-moon">
              exhibit {String((focusedIndex ?? 0) + 1).padStart(2, '0')} of{' '}
              {String(photoCount).padStart(2, '0')} · us
            </span>
            <span className="glass-chip inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-starlight">
              <Undo2 className="h-4 w-4 text-champagne" />
              step back
            </span>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </>
  )
}
