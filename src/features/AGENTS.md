# Features

## Purpose

Non-chapter or pre-journey screens: login gate, opening hero, future puzzle features.

## Ownership

- One folder per feature (`auth/`, `opening/`, future `quote-puzzles/`)
- No route-chapter layout; may be routed (`OpeningHero` at `/`) or gated (`LoginScreen`)
- Feature-specific UI lives here, not in `sections/`

## Local Contracts

- Import from `content/siteContent`, `app/appConfig`, `design/motion`
- Do not import section data files (`memoryTimeline`, `photoUniverse`)
- Do not turn the first screen into a marketing page; keep the private-gift tone

## Work Guidance

- New major non-hub features → new subfolder under `features/`
- Register in `experienceRegistry.ts` if nav-visible
- Keep `App.tsx` thin; feature logic stays in the feature folder
- Design portrait mobile first; tap-friendly controls at least 44px height

## Verification

- Mobile viewport check
- Gate unlock flow works
- Opening CTA navigates to `/journey`

## Child DOX Index

| DOX | Scope |
|-----|-------|
| [../app/AGENTS.md](../app/AGENTS.md) | Registry and config |
| [../content/AGENTS.md](../content/AGENTS.md) | `siteContent` |
| Future: `quote-puzzles/AGENTS.md` when Phase 4 is implemented |
