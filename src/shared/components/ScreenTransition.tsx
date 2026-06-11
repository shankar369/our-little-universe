import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { screenTransition } from '../../design/motion'

type ScreenTransitionProps = {
  children: ReactNode
  screenKey: string
}

export function ScreenTransition({ children, screenKey }: ScreenTransitionProps) {
  return (
    <motion.div key={screenKey} {...screenTransition}>
      {children}
    </motion.div>
  )
}
