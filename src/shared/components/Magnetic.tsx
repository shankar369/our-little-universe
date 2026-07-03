import { useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion, useSpring } from 'motion/react'

const MAX_PULL = 4

/**
 * A gentle magnetic hover: the child drifts up to ±4px toward the pointer and
 * springs back on leave. Desktop fine-pointers only — on touch or reduced
 * motion it renders the children untouched. Scope: heart FAB + fullscreen
 * toggle only (anything more feels gimmicky).
 */
export function Magnetic({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()
  const [finePointer] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(0, { stiffness: 260, damping: 22 })
  const y = useSpring(0, { stiffness: 260, damping: 22 })

  if (reduceMotion || !finePointer) {
    return <>{children}</>
  }

  function handlePointerMove(event: React.PointerEvent) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) {
      return
    }
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    x.set(Math.max(-1, Math.min(1, dx)) * MAX_PULL)
    y.set(Math.max(-1, Math.min(1, dy)) * MAX_PULL)
  }

  function handlePointerLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </motion.div>
  )
}
