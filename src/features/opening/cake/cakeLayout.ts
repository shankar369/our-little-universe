/**
 * Shared dimensions for the drip cake, matched to the bdaycake.com reference:
 * three squat-to-slender tiers, each wearing a glaze cap whose drip curtain
 * spills over the edge; candles stand on the exposed ledges of every tier.
 * Everything in scene units; the plate's top face defines PLATE_TOP.
 */

export type TierSpec = {
  radius: number
  height: number
  /** y of the tier's underside. */
  bottom: number
  /** y of the tier's top face (sponge, before the glaze cap). */
  top: number
}

export const PLATE_RADIUS = 1.97
/** Top surface of the plate where the bottom tier sits. */
export const PLATE_TOP = 0.06
/** The glaze cap rises this much above each tier's sponge top. */
export const CAP_LIFT = 0.07

function stack(specs: Array<{ radius: number; height: number }>): TierSpec[] {
  let y = PLATE_TOP
  return specs.map(({ radius, height }) => {
    const tier = { radius, height, bottom: y, top: y + height }
    // The next tier stands on this tier's glaze cap.
    y += height + CAP_LIFT
    return tier
  })
}

/** Bottom → top. Proportions eyeballed from the reference cake. */
export const TIERS = stack([
  { radius: 1.42, height: 0.92 },
  { radius: 1.02, height: 0.82 },
  { radius: 0.66, height: 0.68 },
])

/** Top face of the smallest tier's glaze — the topper lives here. */
export const CAKE_TOP_Y = TIERS[2].top + CAP_LIFT

/** Deterministic PRNG so the drips never reshuffle between renders. */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type CandleSpec = {
  x: number
  z: number
  /** y of the surface the candle stands on. */
  baseY: number
  height: number
  /** Which stripe texture the candle wears (index into the stripe palette). */
  stripe: number
}

function onTierTop(angle: number, radius: number, height: number, stripe: number): CandleSpec {
  return {
    x: Math.cos(angle) * radius,
    z: Math.sin(angle) * radius,
    baseY: CAKE_TOP_Y,
    height,
    stripe,
  }
}

/** A candle standing on the exposed glaze ledge of tier `tierIndex`. */
function onLedge(angle: number, tierIndex: number, height: number, stripe: number): CandleSpec {
  const lower = TIERS[tierIndex]
  const upper = TIERS[tierIndex + 1]
  const radius = upper.radius + (lower.radius - upper.radius) * 0.58
  return {
    x: Math.cos(angle) * radius,
    z: Math.sin(angle) * radius,
    baseY: lower.top + CAP_LIFT,
    height,
    stripe,
  }
}

/**
 * Nine candles — three on the crown and three on each ledge, so every step
 * of the cake carries fire. Angles keep the very front (positive z, toward
 * the camera) open for the name tag and stagger between rings so no candle
 * hides directly behind another.
 */
export const CANDLES: CandleSpec[] = [
  // Crown ring
  onTierTop(-2.1, 0.34, 0.66, 0),
  onTierTop(0.6, 0.36, 0.74, 1),
  onTierTop(2.4, 0.33, 0.58, 2),
  // Middle ledge
  onLedge(-0.4, 1, 0.54, 2),
  onLedge(2.0, 1, 0.5, 0),
  onLedge(3.9, 1, 0.56, 1),
  // Bottom ledge
  onLedge(0.55, 0, 0.5, 1),
  onLedge(2.6, 0, 0.54, 2),
  onLedge(4.4, 0, 0.48, 0),
]
