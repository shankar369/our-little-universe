# App Config and Registry

## Purpose

App-level orchestration data: `appConfig`, `experienceRegistry`. Not UI, not personal copy.

## Ownership

Owns storage keys, timing constants, and the section catalog. Consumed by `App.tsx`, `JourneyHub`, and `FloatingHeartMenu`.

## Local Contracts

- `ExperienceSection` shape: `id`, `label`, `status`, `path`, `description`, `icon`
- `icon` (LucideIcon) is the canonical chapter icon — nav, hub cards, and the
  chapter curtain all read it from the registry (no duplicate icon maps)
- `status` is `'live' | 'planned'`
- Paths must match routes wired in `App.tsx`
- New localStorage keys only in `appConfig.storageKeys`

## Work Guidance

- Add section metadata to `experienceRegistry.ts` before hub or nav work
- Update hub filter in `JourneyHub.tsx` when a section should appear in the picker
- Wire the route in `App.tsx`; lazy-load heavy sections with `React.lazy`
- Keep `App.tsx` as orchestration only: background, gate state, top-level screen switching

## Verification

- `npm run build`
- Grep for path consistency across registry, routes, and hub filter

## Child DOX Index

| DOX | Scope |
|-----|-------|
| [../sections/AGENTS.md](../sections/AGENTS.md) | Routed chapters |
| [../features/AGENTS.md](../features/AGENTS.md) | Gate and hero screens |
| [../content/AGENTS.md](../content/AGENTS.md) | Personal content |
