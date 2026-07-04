/**
 * Pure layout math for the mUSeum hall: one long gallery sized to the photo
 * count, photos alternating along the two side walls, entrance doors on the
 * south end. Everything (scene meshes, collision clamps, camera marks) reads
 * from this single source so the hall can never disagree with itself.
 */

export const EYE_HEIGHT = 1.6
/** How close the visitor can get to any wall (metres). */
export const WALL_MARGIN = 0.6

export type FramePlacement = {
  index: number
  /** Centre of the frame on the wall. */
  position: [number, number, number]
  /** Rotation so the artwork faces into the hall. */
  rotationY: number
  /** Inward wall normal — the direction the photo looks. */
  normal: [number, number, number]
}

export type MuseumLayout = {
  /** Hall inner width (x), height (y), length (z). */
  width: number
  height: number
  length: number
  /** z of the entrance wall (+z end). */
  doorZ: number
  /** Where the visitor stands outside, admiring the doors. */
  entranceCam: [number, number, number]
  /** Where the dolly-in lands once the doors open. */
  insideStart: [number, number, number]
  frames: FramePlacement[]
}

const WIDTH = 7
const HEIGHT = 4.4
const SPACING = 3.2
const END_MARGIN = 3.2
/** Frames sit proud of the wall by half the frame depth. */
const WALL_OFFSET = 0.06

export function buildMuseumLayout(photoCount: number): MuseumLayout {
  const perWall = Math.max(1, Math.ceil(photoCount / 2))
  const length = (perWall - 1) * SPACING + END_MARGIN * 2 + 3
  const halfLength = length / 2
  const halfWidth = WIDTH / 2

  const frames: FramePlacement[] = Array.from(
    { length: photoCount },
    (_, index) => {
      const onLeft = index % 2 === 0
      const slot = Math.floor(index / 2)
      const z = halfLength - END_MARGIN - 1.4 - slot * SPACING
      return {
        index,
        position: [
          onLeft ? -halfWidth + WALL_OFFSET : halfWidth - WALL_OFFSET,
          1.72,
          z,
        ],
        rotationY: onLeft ? Math.PI / 2 : -Math.PI / 2,
        normal: onLeft ? [1, 0, 0] : [-1, 0, 0],
      }
    },
  )

  return {
    width: WIDTH,
    height: HEIGHT,
    length,
    doorZ: halfLength,
    entranceCam: [0, EYE_HEIGHT, halfLength + 5.4],
    insideStart: [0, EYE_HEIGHT, halfLength - 2.6],
    frames,
  }
}
