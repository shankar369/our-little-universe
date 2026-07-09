# Shared Primitives

## Purpose

Reusable UI, hooks, and utilities with no route or personal copy ownership.

## Ownership

- Components accept typed props and callbacks
- Never import `content/*` data files (types are OK)
- `AmbientBackground` is the app-wide Constellation Sky (no props; no particle engine — seeded SVG stars + `ConstellationGlyph` letterforms from `constellationData.ts`)
- `FloatingHeartMenu` reads `experienceRegistry` for nav (icons come from the registry)
- `FullscreenToggle` is an app-wide control (bottom-left) using the Fullscreen API. It owns its own transition: a z-[140] "night blink" veil (dip to `#070312`, toggle fullscreen under the veil, settle ~240ms, unveil) — the browser's viewport snap can't be animated, so it's masked instead
- `CinematicTransition` provides `CinematicTransitionProvider` + `useCinematicTransition().play(variant)` and `lastPlayedAt()`; variants: `unlock` (heart-iris), `seal`, `reveal`. Overlays are z-[120], pointer-events-none, reduced-motion aware. Under rich motion the unlock/seal decor is the lazy `HeartIrisEmbers` WebGL swarm; the SVG rim + hearts remain the fallback (and Suspense placeholder)
- `ChapterCurtain` (z-[100]) plays the velvet route-transition sweep; location-driven, suppressed on first load / reduced motion / within 1.5s of a cinematic (see design-system.md §14). Under rich motion the veil is the lazy `VelvetCurtainGL` silk shader (idle-prefetched); the DOM gradient veil remains the fallback. Timing always comes from the `curtain` constants in `design/motion.ts`
- `Magnetic` is the pointer-follow hover wrapper — scoped to the heart FAB and fullscreen toggle only
- `lib/richMotion.ts` — `useRichMotion()` is the capability gate for every WebGL transition layer: `{ rich, reduced, compact }` (rich = WebGL available and motion welcome; compact = ≤640px, halve particle budgets). Every rich effect must render a DOM/static fallback when `rich` is false
- `lib/emberGlsl.ts` — the shared ember DNA (palette, buffer builders, sprite fragment shader, `makeEmberMaterial`). New ember scenes build on this; `FinaleEmbers` keeps its own private copy on purpose. The material's custom blending adds colour but pins framebuffer alpha at 0 so overlay canvases only ever add light
- `lib/pointSampling.ts` — `sampleImageToPoints` (photo → particle grid) and `samplePathToPoints` (SVG path outline → points)

## Local Contracts

- Photo primitives use `RevealPhotoItem` from `content/types.ts`
- `PhotoSphere`: generic `<TItem extends RevealPhotoItem>`, DPR cap `[1, 1.5]`, no DOM labels in canvas, transparent unboxed canvas with edge mask, fog + Sparkles + nebula scene per design-system.md §9
- `PhotoRevealDialog` and `PhotoShuffleStack` are shared contracts for memory and gallery sections; cards use the `.polaroid` surface
- `AtlasMap`: controlled MapLibre map (`activePlaceId` in, `onMarkerClick` out); Carto `dark-matter` basemap, no API key; heart "NS" markers styled in `index.css` `.atlas-marker`; `flyTo`/`jumpTo` per reduced-motion
- `PhotoGallery/PhotoGalleryModal`: reusable full-screen masonry gallery + lightbox; takes **resolved** `photos: string[]` URLs and stays path-agnostic
- `AmbientBackground` takes no props; allowed layers and constellation budgets are fixed in design-system.md §8
- `usePersistentBoolean` + `storage.ts` centralize localStorage access
- `publicAssetPath()` in `lib/assetPath.ts` prefixes photo URLs for gh-pages base path; use in any component that loads `public/` assets

## Work Guidance

- New primitive → subfolder under `components/` with README
- Section-specific layout stays in `sections/`
- Mobile-first; no hover-only interactions
- Respect `prefers-reduced-motion`; reduce particle/3D density on phones
- Abstract only after reuse in 2+ contexts
- Keep expensive visual effects behind focused components

## Verification

- `npm run build`
- Test reuse contexts: timeline stack, photo globe, reveal modal

## Child DOX Index

| DOX | Scope |
|-----|-------|
| [components/PhotoSphere/README.md](components/PhotoSphere/README.md) | R3F globe primitive |
| [components/PhotoReveal/README.md](components/PhotoReveal/README.md) | Framed reveal modal |
| [components/ShuffleCards/README.md](components/ShuffleCards/README.md) | Swipeable photo stack |
| [components/AtlasMap/README.md](components/AtlasMap/README.md) | MapLibre place map + heart markers |
| [components/PhotoGallery/README.md](components/PhotoGallery/README.md) | Full-screen gallery + lightbox |
| [../sections/AGENTS.md](../sections/AGENTS.md) | Section consumers |
