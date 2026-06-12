/** The house easing — every entrance and exit in the app should feel like this. */
export const softEase = [0.22, 1, 0.36, 1] as const

export const screenTransition = {
  initial: { opacity: 0, y: 14, scale: 1.01 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.99 },
  transition: { duration: 0.55, ease: softEase },
} as const

export const riseIn = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: softEase },
} as const
