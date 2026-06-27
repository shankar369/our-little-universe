# OurLittleAtlas Section

## Purpose
Our Little Atlas is the map chapter: an immersive, full-screen MapLibre map of every
place that became part of "us". It opens on India, pins each place as a heart "NS"
marker, and reveals that place's photos on demand.

## Layout
Immersive single screen (`h-svh`, map `absolute inset-0`). Floating chrome only:
a short header (eyebrow + one aurora line) + a recenter button top, a `Places` pill
bottom-center, and two sheets that slide in over the map. No page scroll.

## Technical Notes
- Route: `/our-little-atlas`
- Component: `OurLittleAtlas.tsx`
- Data source: `src/content/ourLittleAtlas.ts` (`ourLittleAtlasPlaces`, `getPlacePhotos`,
  `indiaDefaultView`, `placeFocusZoom`)
- Type: `JourneyPlace` in `src/content/types.ts`
- Photos: auto-discovered from `src/content/journeyPhotos/<folder>/` at build time — no
  path lists. See `src/content/journeyPhotos/README.md`.
- Lazy-loaded from `App.tsx` (MapLibre is heavy).

## Shared Components
- `src/shared/components/AtlasMap/AtlasMap.tsx` — the controlled MapLibre map: renders
  heart markers, reports marker clicks, and flies the camera to `activePlaceId`.
- `src/shared/components/PhotoGallery/PhotoGalleryModal.tsx` — the reusable full-screen
  scrollable gallery + lightbox used by "View all".
- `PlacesPanel` and `PlacePreview` are section-local layout (in this file): the list
  sheet and the marker preview sheet.

## Interaction Model
- Default view frames all of India with every place pinned.
- `Places` opens the list (bottom sheet on mobile, left drawer on desktop). Selecting a
  place flies the camera in and highlights (pulses) its marker — it does **not** open
  photos.
- Tapping a heart marker opens the preview sheet: place name + note + up to 4 photos
  (with a `+N` overlay) + `View all`.
- `View all` (or tapping a preview photo) opens the full-screen gallery; tapping a
  gallery photo opens the lightbox (swipe/arrow/Esc).
- Selecting a different place flies out-and-in to the new one (MapLibre `flyTo`).
- The compass button (top-right) zooms back out to all of India.
- `prefers-reduced-motion` swaps `flyTo` for an instant `jumpTo`.

## Edge Cases
- A place with no photos yet degrades to a "memories landing here soon" state in both
  the preview and the gallery; the place still pins and flies.
- Heart markers carry a ≥44px tap target; a pointer-move guard is unnecessary because
  MapLibre separates drag from click.
- WebGL unavailable → a graceful fallback message instead of a crash.

## Extensibility
Add a place by appending to `ourLittleAtlasPlaces` (new `folder`) and creating the
matching photo folder. Keep map mechanics in `shared/AtlasMap` and gallery mechanics in
`shared/PhotoGallery`; keep route layout (sheets, header) here.
