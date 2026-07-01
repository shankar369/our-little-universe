# PhotoSphere

## Purpose
`PhotoSphere` is the reusable 3D photo globe used by Photo Universe and future orbital galleries. It receives typed photo JSON and only reports which item was tapped; routes own the preview modal and surrounding copy.

## Data Contract
Pass an array of `RevealPhotoItem`-compatible entries with `photo`, `heading`, `name`, and `text`. Missing images render as a generated pastel/heart texture so the globe still looks intentional before real photos are added.

## Card Treatment
- **Frameless and textless**: each photo is a rounded-corner tile (rounded-rect
  `ShapeGeometry` with bounding-box UVs) floating with a soft additive halo — no paper
  frame, no caption (the sphere shows no text).
- **Aspect-correct**: every photo is fit inside a 1×1 box preserving its true ratio, so
  portraits, landscapes, and squares are never squished.

## Gesture Model
- One-finger drag or mouse drag rotates the sphere.
- Pinch and mouse wheel zoom through Drei `OrbitControls` (`minDistance` 4.6 →
  `maxDistance` 26, so the whole galaxy can be framed even on a narrow phone).
- Pan is disabled to keep the globe centered and gift-like.
- A card opens **only on a genuine tap** (<7px pointer travel); dragging to rotate never
  selects. There is no `onClick` fallback — selection is movement-guarded `pointerup`.

## Performance Notes
The component caps DPR to `[1, 1.5]`, uses basic materials and a single shared halo
texture, avoids DOM labels inside the canvas, and respects `prefers-reduced-motion` by
pausing idle spin. Fog `near`/`far` are updated per-frame from the camera distance, so
zooming out fades the sphere's far side without dissolving the whole galaxy.
