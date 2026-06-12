# Design Tokens

## Purpose

Shared motion constants. Complements the Midnight Velvet tokens and component classes in `src/index.css`. The binding design contract is [docs/design-system.md](../../docs/design-system.md).

## Ownership

- `motion.ts` — easing curves and Motion presets
- `src/index.css` owns: `@theme` color tokens (`night`, `deep`, `plum`, `starlight`, `moon`, `faint`, `orchid`, `blush`, `champagne`), fonts, surface classes (`glass-panel`, `glass-chip`, `btn-primary`, `btn-ghost`, `polaroid`), type roles (`type-eyebrow`, `type-quote`, `text-aurora`, `text-glow`, `night-veil`), and the `aurora-drift` keyframes

## Local Contracts

- Export named presets: `softEase`, `screenTransition`, `riseIn`
- Motion spread pattern for Framer Motion consumers
- Respect global `prefers-reduced-motion` rules in CSS
- Typography roles and usage limits (one `.text-aurora` per screen, clamp-size caps) are defined in docs/design-system.md §3

## Work Guidance

- Add reusable motion presets here; one-off section animation can stay local
- Do not duplicate easing magic numbers across files
- Never add raw Tailwind palette colors or ad-hoc glass styles in components; extend tokens/classes in `index.css` and document them in docs/design-system.md

## Verification

- Visual check on mobile and desktop
- Toggle `prefers-reduced-motion` and confirm decorative movement reduces safely

## Child DOX Index

| DOX | Scope |
|-----|-------|
| [../shared/AGENTS.md](../shared/AGENTS.md) | `ScreenTransition` and shared UI |
| [../features/AGENTS.md](../features/AGENTS.md) | Feature screens |
| [../sections/AGENTS.md](../sections/AGENTS.md) | Routed chapters |
