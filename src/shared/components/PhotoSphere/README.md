# PhotoSphere

## Purpose
`PhotoSphere` is the reusable 3D photo globe used by Photo Universe and future orbital galleries. It receives typed photo JSON and only reports which item was tapped; routes own the preview modal and surrounding copy.

## Data Contract
Pass an array of `RevealPhotoItem`-compatible entries with `photo`, `heading`, `name`, and `text`. Missing images render as generated Polaroid-style textures so the globe still looks intentional before real photos are added.

## Gesture Model
- One-finger drag or mouse drag rotates the sphere.
- Pinch and mouse wheel zoom smoothly through Drei `OrbitControls`.
- Pan is disabled to keep the globe centered and gift-like.
- Tapping or clicking a card opens the route-provided preview.

## Performance Notes
The component caps DPR to `[1, 1.5]`, uses simple materials, avoids DOM labels inside the canvas, and respects `prefers-reduced-motion` by pausing idle spin.
