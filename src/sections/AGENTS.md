# Routed Sections

## Purpose

Routed experience chapters. Each folder is a route, a README, and a section component.

## Ownership

- Route layout, copy, and orchestration per section folder
- Interaction primitives delegated to `shared/`
- Every section folder must have a `README.md`

## Local Contracts

- Lazy-load heavy routes from `App.tsx` (e.g. PhotoUniverse, OurLittleAtlas/MapLibre)
- Map content types to `RevealPhotoItem` at the section boundary
- Hub sections filtered explicitly in `JourneyHub.tsx`
- Use shared `PhotoReveal`, `PhotoSphere`, `PhotoShuffleStack`, `AtlasMap`, and
  `PhotoGallery` primitives

## Work Guidance

Follow the add-section checklist:

1. Add content types in `src/content/types.ts` if needed
2. Add content values in a dedicated content file
3. Create routed section folder under `src/sections/` with `README.md`
4. Add metadata to `src/app/experienceRegistry.ts`
5. Wire route in `src/App.tsx`
6. Lazy-load if the section is heavy

Preserve mobile-first gestures, 44px controls, reduced-motion behavior, and foreground/background separation.

## Verification

- `npm run build`
- Route navigation via hub and `FloatingHeartMenu`
- Touch targets at least 44px on important actions

## Child DOX Index

| DOX | Scope |
|-----|-------|
| [JourneyHub/README.md](JourneyHub/README.md) | Journey picker at `/journey` |
| [MemoryTimeline/README.md](MemoryTimeline/README.md) | Timeline stack at `/memory-timeline` |
| [PhotoUniverse/README.md](PhotoUniverse/README.md) | 3D globe at `/photo-universe` |
| [OurLittleAtlas/README.md](OurLittleAtlas/README.md) | MapLibre map at `/our-little-atlas` |
| [Museum/README.md](Museum/README.md) | First-person 3D gallery at `/museum` |
| [HeartLocker/README.md](HeartLocker/README.md) | Hidden scroll cinema at `/heart-locker` |
| [../shared/AGENTS.md](../shared/AGENTS.md) | Shared photo and ambient primitives |
| [../content/AGENTS.md](../content/AGENTS.md) | Section content files |
