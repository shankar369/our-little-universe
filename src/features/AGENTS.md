# Features

## Purpose

Non-chapter or pre-journey screens: login gate, opening hero, future puzzle features.

## Ownership

- One folder per feature (`auth/`, `opening/`, `heartLocker/`, future `quote-puzzles/`)
- No route-chapter layout; may be routed (`OpeningHero` at `/`) or gated (`LoginScreen`)
- Feature-specific UI lives here, not in `sections/`
- `heartLocker/` owns the secret-locker state (`HeartLockerProvider` + `useHeartLocker`)
  and the password `HeartLockerPrompt`; consumed by `FloatingHeartMenu` (5s hold reveals
  the hub card), `JourneyHub` (the card + prompt), and the `HeartLocker` section
- `opening/` is the three-act Opening Overture (design-system §13c): `OpeningHero`
  orchestrates `WishOverture` (quote entrance) → `StoryOfYou` (scroll cinema in three
  verses — born / princess / mine — fed by `src/content/openingPhotos/group1|2|3/`
  via `content/openingStory.ts`) → `CakeMoment` (interactive 3D drip cake). The cake's
  WebGL scene lives in `opening/cake/` as a lazy chunk (`BirthdayCakeScene` +
  procedural geometry/textures + `cakeShared.ts` phase/timing contract shared with the
  DOM side). Copy lives in `siteContent.hero.*` (incl. `hero.story.*` — the verse
  lines — and `hero.cake.*` — the name on the cake tag, whispers, CTA)
- `opening/BirthdayWish.tsx` (tappable CSS candle) survives as the reduced-motion /
  no-WebGL fallback beat inside `OpeningHero`'s static column, which also keeps an
  ungated CTA so the journey is never locked behind the wish

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
