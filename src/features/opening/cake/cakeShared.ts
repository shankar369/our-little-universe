/**
 * Contract shared between the DOM side of the cake act (`CakeMoment`) and the
 * lazy-loaded WebGL scene (`BirthdayCakeScene`). Kept tiny and dependency-free
 * so importing it never drags the three.js chunk into the main bundle.
 */

/** The cake act's state machine, owned by `CakeMoment`. */
export type CakePhase =
  | 'waiting' // act not reached yet — the cake is invisible
  | 'assembling' // tiers drop in with a springy overshoot
  | 'lit' // candles burning, waiting for her wish
  | 'blowing' // flames going out in a cascade
  | 'wished' // wish made — confetti, balloons, CTA
  | 'relit' // she tapped again; flames back, CTA stays

/**
 * Drag-to-spin state, mutated by pointer handlers on the canvas wrapper and
 * read inside `useFrame` — never React state, so spinning costs no renders.
 */
export type CakeSpin = {
  /** Target Y rotation in radians (drag adds to it, idle drift advances it). */
  target: number
  /** Small X tilt target from vertical drag, clamped in the scene. */
  tilt: number
  /** True while a pointer drag is active (pauses the idle drift). */
  dragging: boolean
  /** Timestamp (ms) of the last interaction, for resuming the idle drift. */
  lastInteraction: number
}

export function createCakeSpin(): CakeSpin {
  return { target: 0, tilt: 0, dragging: false, lastInteraction: 0 }
}

/**
 * Advance the idle behaviour one frame: the tilt relaxes back to level and,
 * a beat after the last touch, the slow display-case drift resumes.
 */
export function driftCakeSpin(spin: CakeSpin, delta: number): void {
  if (spin.dragging) {
    return
  }
  spin.tilt *= Math.exp(-1.4 * delta)
  if (performance.now() - spin.lastInteraction > 2600) {
    spin.target += delta * 0.12
  }
}

/** Assembly runs ~2.2s of part drops; flames ignite right after. */
export const ASSEMBLE_MS = 2400
/** Per-candle delay while the flames blow out one by one. */
export const CASCADE_STEP_MS = 160
/** Beat between the last flame dying and the confetti/CTA moment. */
export const CASCADE_HOLD_MS = 420
export const CANDLE_COUNT = 9
/** Total time from "blowing" to "wished". */
export const BLOW_TOTAL_MS =
  CANDLE_COUNT * CASCADE_STEP_MS + CASCADE_HOLD_MS

/** Springy overshoot used by every part of the cake assembly. */
export function backOut(t: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1
  const x = Math.min(Math.max(t, 0), 1)
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

export function easeOutCubic(t: number): number {
  const x = Math.min(Math.max(t, 0), 1)
  return 1 - Math.pow(1 - x, 3)
}
