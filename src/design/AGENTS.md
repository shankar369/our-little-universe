# Design Tokens

## Purpose

Shared motion constants and future visual tokens. Complements `index.css` theme and liquid-glass component classes.

## Ownership

- `motion.ts` — easing curves and Motion presets
- CSS component classes (`liquid-panel`, etc.) live in `src/index.css`
- Global `@theme` color and font tokens belong in `index.css`, not scattered CSS files

## Local Contracts

- Export named presets: `softEase`, `screenTransition`, `riseIn`
- Motion spread pattern for Framer Motion consumers
- Respect global `prefers-reduced-motion` rules in CSS
- Typography lives in `index.css` `@theme`:
  - `--font-display` (`Fraunces`) — headlines, memory titles, quotes, ambient monograms
  - `--font-sans` (`DM Sans`) — body copy, buttons, labels, nav, forms
- Base styles apply `font-display` to `h1`–`h3` and `blockquote`; use `.type-quote` for memory captions

## Work Guidance

- Add reusable motion presets here; one-off section animation can stay local
- Do not duplicate easing magic numbers across files
- Keep the dark purple/black luxury look and liquid-glass styling per root AGENTS.md

## Verification

- Visual check on mobile and desktop
- Toggle `prefers-reduced-motion` and confirm decorative movement reduces safely

## Child DOX Index

| DOX | Scope |
|-----|-------|
| [../shared/AGENTS.md](../shared/AGENTS.md) | `ScreenTransition` and shared UI |
| [../features/AGENTS.md](../features/AGENTS.md) | Feature screens |
| [../sections/AGENTS.md](../sections/AGENTS.md) | Routed chapters |
