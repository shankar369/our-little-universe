import { useEffect, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { curtainScreenTransition, screenTransition } from '../../design/motion'

/**
 * Mounts fresh with every screen (the parent motion.div is keyed), so the
 * scroll reset fires exactly when the new page appears — under the closed
 * chapter curtain, never as a visible jump. Without it, leaving a scrolled
 * page (e.g. the cake act at the foot of the opening) lands the next route
 * already scrolled to the bottom.
 */
function ScrollReset() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return null
}

type ScreenTransitionProps = {
  children: ReactNode
  screenKey: string
  /**
   * 'curtain' (default) syncs the page swap to the chapter curtain: the old
   * page holds while the veil covers it, the new page rises as it parts.
   * 'fade' is the quick standalone fade (login gate, reduced motion).
   */
  variant?: 'curtain' | 'fade'
}

export function ScreenTransition({
  children,
  screenKey,
  variant = 'curtain',
}: ScreenTransitionProps) {
  const reduceMotion = useReducedMotion()
  const preset =
    variant === 'fade' || reduceMotion ? screenTransition : curtainScreenTransition

  return (
    <motion.div key={screenKey} {...preset}>
      <ScrollReset />
      {children}
    </motion.div>
  )
}
