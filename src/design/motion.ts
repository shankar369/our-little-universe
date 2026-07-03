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

/**
 * Chapter curtain timing (seconds). The veil sweeps over (`close`), holds for
 * the title card (`hold`), then parts (`open`) — total ≈ 1.3s. The page enter
 * below is synced to these numbers; tune everything here, nowhere else.
 */
export const curtain = {
  close: 0.45,
  hold: 0.35,
  open: 0.5,
} as const

/**
 * Route transition used under the chapter curtain: the old page holds
 * unchanged while the veil covers it; the new page rises just as the veil
 * begins to part.
 */
export const curtainScreenTransition = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: curtain.close - 0.13, ease: softEase },
  },
  exit: { opacity: 1, transition: { duration: curtain.close } },
} as const
