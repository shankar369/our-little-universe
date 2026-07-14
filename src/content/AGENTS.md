# Personal Content

## Purpose

All editable personal data. Types before values. No UI logic.

## Ownership

- `types.ts` is the schema
- One file per domain: `siteContent.ts`, `memoryTimeline.ts`, `photoUniverse.ts`, `ourLittleAtlas.ts`, `heartLockerGallery.ts`
- Ordered exports via `ordered*Items` arrays where applicable
- `journeyPhotos/<folder>/` holds Our Little Atlas photos, auto-discovered by build-time glob
- `heartLockerPhotos/<folder>/` holds Heart Locker act photos (`photo-stack`, `photo-strip`), same glob pattern via `heartLockerGallery.ts`; empty folders TEMP-fallback to hero test photos
- `bookPages/` holds The Book album pages, discovered by `bookGallery.ts` (name-sorted, max 40 faces, `spread` filenames span two facing pages); empty folder TEMP-fallbacks to hero test photos
- `photoUniversePhotos/` holds Photo Universe sphere photos, same glob pattern via `photoUniverse.ts`; empty folder TEMP-fallbacks to hero test photos
- `openingPhotos/group1|group2|group3/` holds the opening Story-of-You verse photos (born / princess / mine), same glob pattern via `openingStory.ts` (≤4 per verse); empty folders TEMP-fallback to hero test photos

## Local Contracts

- Type hierarchy: `RevealPhotoItem` base → `MemoryTimelineItem`, `PhotoUniverseItem`
- `JourneyPlace` (atlas) is standalone: name, note, lat/lng, `folder`
- Photo paths: `/memoryTimeline/...` (logical public path; `publicAssetPath()` in `src/shared/lib/assetPath.ts` prefixes the Vite base at runtime, and is idempotent so it also safely no-ops on already-resolved glob URLs)
- Atlas, Heart Locker, The Book, Photo Universe, and opening Story-of-You photos are
  build-time-glob folders under `src/content/` (`journeyPhotos/<folder>/`,
  `heartLockerPhotos/<folder>/`, `bookPages/`, `photoUniversePhotos/`,
  `openingPhotos/<group>/`) resolved by `import.meta.glob`, so authors never list
  paths — they just add files and they're auto-discovered, name-sorted
- Use `satisfies` for type safety when defining content arrays
- Keep secrets out of the repo; the login gate is client-side only

## Work Guidance

- Extend `types.ts` before adding content or UI
- Add values in a dedicated content file, not in components
- Map domain types to `RevealPhotoItem` at the section boundary, not in shared components
- Compress images before adding to `public/`
- Store captions, puzzle answers, and stories in content files, not components

## Verification

- `npm run build`
- Spot-check missing-image placeholders still render

## Child DOX Index

| DOX | Scope |
|-----|-------|
| [../sections/AGENTS.md](../sections/AGENTS.md) | Content consumers |
| `public/memoryTimeline/README.md` | Timeline asset drop folder |
| [journeyPhotos/README.md](journeyPhotos/README.md) | Atlas per-place photo drop folders |
| [heartLockerPhotos/README.md](heartLockerPhotos/README.md) | Heart Locker per-act photo drop folders |
| [bookPages/README.md](bookPages/README.md) | The Book album page drop folder |
| [photoUniversePhotos/README.md](photoUniversePhotos/README.md) | Photo universe planet photo drop folder |
| [openingPhotos/README.md](openingPhotos/README.md) | Story-of-You verse photo drop folders |
