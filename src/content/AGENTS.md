# Personal Content

## Purpose

All editable personal data. Types before values. No UI logic.

## Ownership

- `types.ts` is the schema
- One file per domain: `siteContent.ts`, `memoryTimeline.ts`, `photoUniverse.ts`
- Ordered exports via `ordered*Items` arrays where applicable

## Local Contracts

- Type hierarchy: `RevealPhotoItem` base → `MemoryTimelineItem`, `PhotoUniverseItem`
- Photo paths: `/memoryTimeline/...`, `/photoUniverse/...`
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
