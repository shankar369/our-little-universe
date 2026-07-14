import * as THREE from 'three'
import { CAP_LIFT, PLATE_RADIUS, PLATE_TOP, mulberry32, type TierSpec } from './cakeLayout'

/**
 * Sculpted glaze geometry, modeled on the bdaycake.com cake: each tier wears
 * a continuous drip *curtain* — a parametric surface that curls over the top
 * lip, hugs the wall, and folds under into rounded tongue tips of varying
 * length — rather than separate drip primitives. Built once per tier with a
 * seeded PRNG, smooth-shaded via computeVertexNormals.
 *
 * All geometry is expressed relative to the tier's bottom (group origin).
 */

const PROFILE_STEPS = 18

/**
 * The scalloped drip-length field L(θ): `count` tongues around the rim, each
 * with its own length, blended through a cosine window so neighbouring
 * tongues merge into a continuous curtain with short "webs" between them.
 */
function makeLengthField(tier: TierSpec, seed: number) {
  const rand = mulberry32(seed)
  const count = Math.max(10, Math.round((Math.PI * 2 * tier.radius) / 0.37))
  const lengths: number[] = []
  for (let k = 0; k < count; k += 1) {
    const base = k % 3 === 0 ? 0.6 : k % 2 === 0 ? 0.44 : 0.3
    const jitter = (rand() - 0.5) * 0.22
    lengths.push(
      tier.height * THREE.MathUtils.clamp(base + jitter, 0.22, 0.85),
    )
  }
  const web = tier.height * 0.14
  return (theta: number) => {
    const u = ((theta / (Math.PI * 2)) % 1) * count
    const k = ((Math.floor(u) % count) + count) % count
    const t = u - Math.floor(u)
    // Cosine window: 1 at the tongue's center, 0 at its edges.
    const window = Math.pow(0.5 - 0.5 * Math.cos(t * Math.PI * 2), 0.72)
    const ripple = 1 + 0.03 * Math.sin(theta * 9.7 + seed)
    return { length: (web + (lengths[k] - web) * window) * ripple, window, count }
  }
}

/** One radial cross-section of the curtain at angle θ, as a smooth curve. */
function profileCurve(tier: TierSpec, length: number, thickness: number) {
  const R = tier.radius
  const capY = tier.height + CAP_LIFT
  const tipY = tier.height - Math.max(length, thickness * 2.1)
  return new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(R - 0.14, capY + 0.004, 0),
      new THREE.Vector3(R + thickness * 0.7, capY - 0.008, 0),
      new THREE.Vector3(R + thickness, tier.height - 0.1, 0),
      new THREE.Vector3(R + thickness, tipY + thickness * 1.15, 0),
      new THREE.Vector3(R + thickness * 0.45, tipY, 0),
      new THREE.Vector3(R + 0.008, tipY + thickness * 0.8, 0),
    ],
    false,
    'centripetal',
  )
}

/** The full drip curtain for one tier — a welded parametric grid. */
export function buildDripCurtain(tier: TierSpec, seed: number): THREE.BufferGeometry {
  const lengthAt = makeLengthField(tier, seed)
  const columns = Math.max(160, Math.round(tier.radius * 170))
  const rows = PROFILE_STEPS
  const thicknessBase = THREE.MathUtils.clamp(tier.radius * 0.05 + 0.015, 0.05, 0.085)

  const positions = new Float32Array(columns * rows * 3)
  const sample = new THREE.Vector3()

  for (let j = 0; j < columns; j += 1) {
    const theta = (j / columns) * Math.PI * 2
    const { length, window } = lengthAt(theta)
    // Tongues run slightly fatter than the webs — that's the bulby tip.
    const thickness = thicknessBase * (0.78 + 0.5 * window)
    const curve = profileCurve(tier, length, thickness)
    const cos = Math.cos(theta)
    const sin = Math.sin(theta)
    for (let i = 0; i < rows; i += 1) {
      curve.getPoint(i / (rows - 1), sample)
      const idx = (j * rows + i) * 3
      positions[idx] = sample.x * cos
      positions[idx + 1] = sample.y
      positions[idx + 2] = sample.x * sin
    }
  }

  // Welded grid indices (θ wraps around, so normals stay seamless).
  const indices: number[] = []
  for (let j = 0; j < columns; j += 1) {
    const jNext = (j + 1) % columns
    for (let i = 0; i < rows - 1; i += 1) {
      const a = j * rows + i
      const b = jNext * rows + i
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

/** The gently domed glaze cap covering a tier's top face. */
export function buildGlazeCap(tier: TierSpec): THREE.BufferGeometry {
  const capY = tier.height + CAP_LIFT
  const points = [
    new THREE.Vector2(0.001, capY + 0.025),
    new THREE.Vector2(tier.radius * 0.4, capY + 0.02),
    new THREE.Vector2(tier.radius * 0.78, capY + 0.01),
    new THREE.Vector2(tier.radius - 0.1, capY + 0.002),
    // Dip below the curtain's starting edge so the seam never shows.
    new THREE.Vector2(tier.radius - 0.02, capY - 0.03),
  ]
  return new THREE.LatheGeometry(points, 72)
}

/**
 * An elegant serving plate: a shallow dish — flat well the cake sits in,
 * a gentle rise to a thin rim, and a short skirt to the ground so it never
 * reads as a floating ring.
 */
export function buildPlate(): THREE.BufferGeometry {
  const R = PLATE_RADIUS
  const points = [
    new THREE.Vector2(0.001, PLATE_TOP),
    new THREE.Vector2(R * 0.68, PLATE_TOP),
    new THREE.Vector2(R * 0.86, PLATE_TOP + 0.028),
    new THREE.Vector2(R * 0.97, PLATE_TOP + 0.065),
    new THREE.Vector2(R, PLATE_TOP + 0.04),
    new THREE.Vector2(R * 0.96, 0.012),
    new THREE.Vector2(R * 0.7, 0.001),
    new THREE.Vector2(0.001, 0.001),
  ]
  return new THREE.LatheGeometry(points, 80)
}
