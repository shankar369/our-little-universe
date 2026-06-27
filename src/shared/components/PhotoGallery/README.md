# PhotoGallery

## Purpose
`PhotoGalleryModal` is the reusable, full-screen, cinematic photo gallery for the whole
app: pass it an array of image URLs and it renders an aspect-ratio-aware masonry that
blooms in on scroll, with a draggable, swipeable lightbox. Built for Our Little Atlas
"View all", intended for any "show all the photos in this set" surface.

## Props Contract
- `open: boolean` — controlled visibility (animated mount/unmount).
- `photos: string[]` — **resolved, ready-to-use** image src URLs (the caller does any
  path resolution / folder discovery; the component stays pure).
- `title?`, `subtitle?` — header text (title renders as `.text-aurora`).
- `captions?: string[]` — optional per-photo serif captions (indexed with `photos`),
  shown on hover and in the lightbox. Falls back to `moment NN`.
- `onClose()` — close request.

## Design & Behaviour
- **Masonry** via CSS `columns` (2 → 3 → 4) with `break-inside-avoid`; handles portrait,
  landscape, and square together.
- **Aspect-ratio reservation**: each tile sets `aspect-ratio` from a varied placeholder,
  then snaps to the image's true ratio on load. This kills layout shift, gives a blur-up
  shimmer, and (critically) lets the scroll-reveal gate correctly before images decode.
- **Scroll reveal**: tiles fade/rise/scale/deblur via `whileInView` (`once`, low
  `amount`), staggered — they bloom as they enter the viewport.
- **Hover/active**: gentle image zoom + bottom scrim + serif caption with a heart.
- **Ambiance**: solid night backdrop, aurora radial glows, faint film grain.
- **Lightbox**: `object-contain` (no crop for any ratio); directional crossfade between
  photos; drag down to dismiss, swipe left/right to navigate; arrow keys + Esc; tap
  backdrop to close; counter + optional caption. Buttons appear on `sm+`.
- Body scroll locks while open; empty `photos` → a glowing "memories landing here soon".
- Lightbox reset on reopen uses a render-time state adjustment (no synchronous effect).

## Reuse Notes
Because it takes resolved URLs, it works with both build-time globbed assets (atlas) and
`publicAssetPath()`-resolved `public/` images. Keep folder/path logic in the caller.
