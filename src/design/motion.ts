export const softEase = [0.22, 1, 0.36, 1] as const

export const screenTransition = {
  initial: { opacity: 0, scale: 1.02 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.55, ease: softEase },
} as const

export const riseIn = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: softEase },
} as const
