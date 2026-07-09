# The Book Section

## Purpose
The Book is a **3D digital replica of the real spiral-bound scrapbook** ("The
story of us" — Navya'Shankar), floating in the app's constellation sky. Each
page screenshot renders **full-bleed** — the scan _is_ the page, handwriting
and stickers included — on black cardstock leaves threaded through black wire
rings. Entry is deliberately simple: the route transition fades the page in
while the book eases up from 95% scale into place (no camera moves — earlier
fly-in/dolly arrivals were tried and cut). Swiping (or dragging, tapping the
page edges, or pressing the arrow keys) curls a leaf over like real card —
the ring edge leads, the free edge lags, and the page bows toward the reader
mid-turn.

Route: `/the-book` · registered in `experienceRegistry` (icon `BookHeart`),
a Journey Hub chapter card and listed in the `FloatingHeartMenu`.
Lazy-loaded from `App.tsx`.

## Files (everything book lives here)
- `TheBook.tsx` — orchestration: title overlay, reading chrome (44px
  prev/next, leaf counter, reset, fading swipe hint — all live immediately),
  and the static fallback (`BookFallback`: full-bleed page grid) when
  `useRichMotion().rich` is false.
- `useBookControls.ts` — the gesture model. Drag progress and pointer
  parallax live in a ref the scene reads per frame; React re-renders only
  when a turn commits. Swipe-with-follow (page tracks the finger, settles on
  release), flick detection, tap zones (left/right thirds), arrow keys.
- `bookLayout.ts` — pure math: page dimensions, `HINGE_GAP` (ring slack), and
  `buildSheets(faces, covers)` (folds the flat face list into two-sided
  sheets between the two cover boards; cover screenshots slot in when
  provided).
- `BookScene.tsx` — the R3F canvas (transparent — the ambient sky is the
  room): static camera, warm key light + blush rim, the spiral wire rings,
  drei `Sparkles`, and the book group (idle float, pointer lean, and a
  side-slide so a closed book stays centered on its lone visible cover).
  The entrance is just the first-frame scale snap to 95% + the existing
  scale damp easing it up.
- `PageSheet.tsx` — one leaf: a ring-hinged plane bent per-frame by
  integrating a curl curve outward from the rings (30 columns, height
  segment 1 — cheap; module-level scratch buffers, no per-mesh allocation).
  Cardstock/cover stiffness controls how much it flexes. Front/back faces are
  separate materials on shared geometry groups; the back texture is
  UV-mirrored so it reads correctly. Settled sheets skip all vertex work.
  Textures mount only within ±4 sheets of the open spread (covers always) and
  release on scroll-past, capping GPU memory.
- `pageTextures.ts` — canvas-composited faces: black cardstock (seeded grain,
  faint sheen, edge vignette); page scans drawn **full-bleed** (cover-fit)
  and "melted" in with light grain + edge falloff so they sit in the scene;
  and, when no cover screenshot is supplied, a **handmade replica cover** —
  silver Parisienne script title + name, scattered red hearts, a pink gel-pen
  arrow doodle, and a black satin bow (no font files). Cached with FIFO
  eviction.

## Content
- Copy: `src/content/theBook.ts` (`BookContent` in `content/types.ts`).
- Pages: drop screenshots of the real album into `src/content/bookPages/`,
  name-sorted (`01.jpg`, `02.jpg`, ...), max 40 faces; discovered by
  `src/content/bookGallery.ts`. Each screenshot is one full page.
  - A filename containing `cover` becomes the **front cover**; add `back`
    (e.g. `cover-back.jpg`) for the **back cover**. Missing covers fall back
    to the generated replica.
  - A filename containing `spread` splits across two facing pages.
  - `SINGLE_SIDED` (in `bookGallery.ts`) → set true if only one side of each
    physical page is decorated (every scan then gets a plain black back).
  - TEMP: an empty folder falls back to the hero test photos.

## Controls
- Swipe/drag left = next page, right = previous; the page follows the finger.
- Tap right/left third of the screen, the HUD chevrons, or arrow keys.
- Pinch (two fingers) or mouse-wheel to zoom, 1×–2.6×, softly damped.
- Reset button (HUD, `RotateCcw`) returns to the closed cover at fitted zoom.
- The stage sets `touch-action: none` so page-drags never scroll.

## Sizing
- The fit is dynamic: a closed book is one page wide, an open one two — so
  the cover presents large (key for phones) and the view breathes out as the
  album opens. User zoom multiplies on top of that fit.
- On phones the bottom chrome gets extra clearance (`pb-[5.25rem]`) so it
  sits above the `FloatingHeartMenu`.

## Performance & fallbacks
- DPR `[1, 1.75]`, 30×1-segment sheets, per-sheet work skipped once settled,
  windowed texture mounting with release-on-scroll-past, `Sparkles` 26
  compact / 52 desktop.
- `useRichMotion()` gates the 3D book; reduced motion / no WebGL get the
  full-bleed page grid instead.
