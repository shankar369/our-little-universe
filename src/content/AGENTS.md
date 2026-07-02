# Personal Content

## Purpose

All editable personal data. Types before values. No UI logic.

## Ownership

- `types.ts` is the schema
- One file per domain: `siteContent.ts`, `memoryTimeline.ts`, `photoUniverse.ts`, `ourLittleAtlas.ts`, `heartLockerGallery.ts`
- Ordered exports via `ordered*Items` arrays where applicable
- `journeyPhotos/<folder>/` holds Our Little Atlas photos, auto-discovered by build-time glob
- `heartLockerPhotos/<folder>/` holds Heart Locker act photos (`photo-stack`, `photo-tunnel`), same glob pattern via `heartLockerGallery.ts`; empty folders TEMP-fallback to hero test photos

## Local Contracts

- Type hierarchy: `RevealPhotoItem` base → `MemoryTimelineItem`, `PhotoUniverseItem`
- `JourneyPlace` (atlas) is standalone: name, note, lat/lng, `folder`
- Photo paths: `/memoryTimeline/...`, `/photoUniverse/...` (logical public paths; `publicAssetPath()` in `src/shared/lib/assetPath.ts` prefixes the Vite base at runtime)
- Atlas photos are the exception: dropped into `src/content/journeyPhotos/<folder>/` and
  resolved by `import.meta.glob` in `ourLittleAtlas.ts` (`getPlacePhotos(folder)`), so
  authors never list paths — they just add files
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
| `public/photoUniverse/README.md` | Photo universe asset drop folder |
| [journeyPhotos/README.md](journeyPhotos/README.md) | Atlas per-place photo drop folders |
| [heartLockerPhotos/README.md](heartLockerPhotos/README.md) | Heart Locker per-act photo drop folders |
