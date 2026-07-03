import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { curtainScreenTransition, screenTransition } from '../../design/motion'

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
      {children}
    </motion.div>
  )
}
