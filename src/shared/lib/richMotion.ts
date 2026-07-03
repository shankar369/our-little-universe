import { useSyncExternalStore } from 'react'
import { useReducedMotion } from 'motion/react'

const COMPACT_QUERY = '(max-width: 640px)'

// Probed once per session — context support does not change at runtime.
let webglProbe: boolean | null = null

function canUseWebgl(): boolean {
  if (webglProbe === null) {
    try {
      const canvas = document.createElement('canvas')
      webglProbe = Boolean(
        canvas.getContext('webgl2') ?? canvas.getContext('webgl'),
      )
    } catch {
      webglProbe = false
    }
  }
  return webglProbe
}

function subscribeToCompact(onChange: () => void) {
  const media = window.matchMedia(COMPACT_QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

export type RichMotion = {
  /** Viewer prefers reduced motion — decorative movement must be static. */
  reduced: boolean
  /** Rich WebGL effects may mount (WebGL available and motion welcome). */
  rich: boolean
  /** Phone-sized viewport — halve particle budgets. */
  compact: boolean
}

/**
 * Capability gate for the rich transition layers (ember atmosphere, silk
 * curtain, ember iris). Every WebGL effect mounts only when `rich` is true;
 * its DOM/static fallback renders otherwise.
 */
export function useRichMotion(): RichMotion {
  const reduced = useReducedMotion() ?? false
  const compact = useSyncExternalStore(
    subscribeToCompact,
    () => window.matchMedia(COMPACT_QUERY).matches,
    () => false,
  )
  return { reduced, compact, rich: !reduced && canUseWebgl() }
}
