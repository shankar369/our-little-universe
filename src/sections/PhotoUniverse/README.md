# PhotoUniverse Section

## Purpose
Photo Universe is the interactive 3D photo globe. It presents a reusable sphere of tappable photo cards with smooth drag rotation, pinch or wheel zoom, idle spin, and the shared full-screen draggable/swipeable lightbox (the same one Our Little Atlas uses).

## Layout
Maximally immersive (design-system.md §4 & §9): the `PhotoSphere` is `absolute inset-0`
and fills the entire screen (`h-svh`), with a short header (eyebrow + one aurora line)
and the `drag · pinch · tap` whisper floating over it, plus top/bottom night scrims for
legibility. There are no on-page action buttons; tapping a planet opens the lightbox
directly on that photo, and the global `FloatingHeartMenu` + `FullscreenToggle` handle
navigation and immersion.

## Technical Notes
- Route: `/photo-universe`
- Component: `PhotoUniverse.tsx`
- Data source: `src/content/photoUniverse.ts`
- Type: `PhotoUniverseItem` in `src/content/types.ts`
- Expected photo folder: `src/content/photoUniversePhotos/`
- 3D primitive: `src/shared/components/PhotoSphere/PhotoSphere.tsx`
- Photo viewer: `PhotoLightbox` from `src/shared/components/PhotoGallery/PhotoGalleryModal.tsx` (same lightbox Our Little Atlas uses) — opened directly on the tapped photo, no masonry grid in front of it.
- The route is still lazy-loaded from `src/App.tsx` because React Three Fiber, Drei, and Three.js are heavier than the opening flow.

## Interaction Model
- Drag rotates the sphere on mobile and desktop.
- Pinch and mouse wheel zoom through Drei `OrbitControls`.
- Tapping or clicking a photo card opens the shared lightbox directly on that photo: drag down to dismiss, swipe left/right (or arrow keys / chevrons) to step through neighbouring photos.
- `prefers-reduced-motion` disables idle spin inside the sphere.

## Asset Expectations
Drop any image (`jpg`, `jpeg`, `png`, `webp`, `avif`) into `src/content/photoUniversePhotos/`; it's picked up automatically by a build-time `import.meta.glob` in `photoUniverse.ts` — no path list to edit, any filename works. Files are name-sorted to set orbit order. An empty folder falls back to the shared hero test photos. Missing/failed loads degrade to designed generated textures inside the sphere and a gradient placeholder inside the modal.

Textures load through a small shared concurrency-limited queue (`src/shared/lib/textureLoadQueue.ts`, max 4 at once) instead of firing all at mount, so a full 50-photo sphere doesn't stall the main thread or the network. Keep source photos reasonably sized (long edge ~1600px) before dropping them in — full-resolution phone photos (4000px+, several MB) will still work but slow first paint.

## Extensibility
Keep route copy and layout in this folder. Keep reusable globe mechanics in `src/shared/components/PhotoSphere` and reusable preview behavior in `src/shared/components/PhotoReveal`. If future sections need different globe density, expose small props on `PhotoSphere` instead of forking the canvas implementation.
