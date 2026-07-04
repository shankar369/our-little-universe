# mUSeum Section

## Purpose
The mUSeum is a **first-person 3D gallery** — the word says it all: a museum whose
only subject is US. The visitor arrives on a porch at night, whispers a password,
the double doors swing open, and they walk a velvet gallery hall hung with framed
photos. Tapping any exhibit glides the camera right up to it (immersive view).

Route: `/museum` · registered in `experienceRegistry` (icon `Landmark`, "chapter
four" on the curtain). Lazy-loaded from `App.tsx`.

## Files (everything museum lives here)
- `Museum.tsx` — orchestration: phase machine (`entrance → opening → inside`),
  entrance overlay, gate modal state, focused-photo state, and the static
  fallback (`MuseumFallback`: same gate, polaroid grid) when `useRichMotion().rich`
  is false.
- `MuseumGate.tsx` — the password modal, cut from the same glass as
  `HeartLockerPrompt`. Correct answer sets the per-tab sessionStorage flag
  (`appConfig.storageKeys.museumUnlocked`) so re-entry skips the question.
- `MuseumHud.tsx` — walking chrome: virtual joystick (pointer-event based, works
  for touch AND mouse; positioned above the fullscreen toggle's corner), a
  fading how-to whisper, and the immersive-view overlay ("exhibit 03 of 10 · us"
  + step back; tapping anywhere steps back, Escape too).
- `useMuseumInput.ts` — WASD/arrows + joystick + drag-look, all in refs (zero
  React re-renders while walking). Look = pointer drag on the canvas wrapper.
- `museumLayout.ts` — pure layout math: hall sized from photo count, frames
  alternating along both walls, door/camera marks. Single source of truth for
  meshes, collision clamps, and camera positions.
- `museumTypes.ts` — `MuseumPhase`, `PhotoSize`.
- `gallery/GalleryScene.tsx` — the R3F canvas: procedural hall (floor + runner,
  moldings, ceiling light strips), warm point lights, the hinged double doors
  (damped swing once phase leaves `entrance`), exterior facade (canvas-texture
  "mUSeum" lettering in the page's own fonts — no font files), far-wall
  dedication, drei `Sparkles` dust. Transparent canvas: the app's ambient
  constellation sky is the outdoors.
- `gallery/FirstPersonRig.tsx` — the camera state machine: entrance idle sway →
  door dolly-in → free walking (velocity smoothing, head bob, wall clamps from
  the layout) → focus glide to a photo → glide back. Look input accumulated
  outside `free` mode is discarded (no snap).
- `gallery/PhotoFrame.tsx` — one exhibit: gold frame + warm mat + unlit photo
  (colours stay true), additive light-pool on the wall, brass picture light,
  plaque. Hover warms the frame; click is movement-guarded (`event.delta < 8`).
- `gallery/sceneTextures.ts` — canvas-generated textures (text, glow pool,
  runner gradient).

## Content
- Copy: `src/content/museum.ts` (`MuseumContent` in `content/types.ts`) — includes
  the password (`answer`, default `forever`).
- Photos: drop images in `src/content/museumPhotos/` (name-sorted, max 16;
  discovered by `src/content/museumGallery.ts`). TEMP: empty folder falls back to
  the hero test photos.

## Controls
- Desktop: `W A S D` / arrows to walk, mouse-drag to look, click a photo to focus.
- Mobile: joystick to walk, touch-drag to look, tap a photo to focus. The canvas
  wrapper sets `touch-action: none` so look-drags never scroll/refresh the page.

## Performance & fallbacks
- DPR `[1, 1.5]`, antialias on (simple geometry), shared module-level materials,
  ~4 point lights + emissive strips, fake picture-light pools (no per-frame cost),
  `Sparkles` 45 compact / 90 desktop.
- `useRichMotion()` gates the whole 3D experience; reduced motion / no WebGL get
  the gate + polaroid grid instead.
