# PhotoUniverse Section

## Purpose
Photo Universe is the interactive 3D photo globe. It presents a reusable sphere of tappable photo cards with smooth drag rotation, pinch or wheel zoom, idle spin, and the shared framed reveal modal.

## Layout
Maximally immersive, centered single column on all breakpoints (design-system.md §4): a short floating header (eyebrow + one aurora line only — no paragraph) over a `PhotoSphere` sized to claim the viewport (`h-[74svh] → lg:h-[82svh]`, full width), with just the `drag · pinch · tap` whisper beneath it. There are no on-page action buttons; tapping a planet opens the reveal modal and the `FloatingHeartMenu` handles navigation back. No 2-column grid — the galaxy is the entire stage.

## Technical Notes
- Route: `/photo-universe`
- Component: `PhotoUniverse.tsx`
- Data source: `src/content/photoUniverse.ts`
- Type: `PhotoUniverseItem` in `src/content/types.ts`
- Expected photo folder: `public/photoUniverse/`
- 3D primitive: `src/shared/components/PhotoSphere/PhotoSphere.tsx`
- Shared reveal: `src/shared/components/PhotoReveal/PhotoRevealDialog.tsx`
- The route is still lazy-loaded from `src/App.tsx` because React Three Fiber, Drei, and Three.js are heavier than the opening flow.

## Interaction Model
- Drag rotates the sphere on mobile and desktop.
- Pinch and mouse wheel zoom through Drei `OrbitControls`.
- Tapping or clicking a photo card opens the shared reveal modal; the modal's own controls step through neighbouring photos.
- `prefers-reduced-motion` disables idle spin inside the sphere.

## Asset Expectations
Photo paths should be referenced as `/photoUniverse/<file-name>`. Current placeholder entries use `/photoUniverse/universe-01.jpg` through `/photoUniverse/universe-50.jpg`. Missing images degrade to designed generated textures inside the sphere and a gradient placeholder inside the modal.

## Extensibility
Keep route copy and layout in this folder. Keep reusable globe mechanics in `src/shared/components/PhotoSphere` and reusable preview behavior in `src/shared/components/PhotoReveal`. If future sections need different globe density, expose small props on `PhotoSphere` instead of forking the canvas implementation.
