# Shared Primitives

## Purpose

Reusable UI, hooks, and utilities with no route or personal copy ownership.

## Ownership

- Components accept typed props and callbacks
- Never import `content/*` data files (types are OK)
- `AmbientBackground` is app-wide decorative shell
- `FloatingHeartMenu` reads `experienceRegistry` for nav

## Local Contracts

- Photo primitives use `RevealPhotoItem` from `content/types.ts`
- `PhotoSphere`: generic `<TItem extends RevealPhotoItem>`, DPR cap `[1, 1.5]`, no DOM labels in canvas, transparent unboxed canvas with edge mask, fog + Sparkles + nebula scene per design-system.md §9
- `PhotoRevealDialog` and `PhotoShuffleStack` are shared contracts for memory and gallery sections; cards use the `.polaroid` surface
- `AmbientBackground` takes `words?: string[]` (App passes `siteContent.ambientWords`); allowed layers are fixed in design-system.md §8
- `usePersistentBoolean` + `storage.ts` centralize localStorage access

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
| [../sections/AGENTS.md](../sections/AGENTS.md) | Section consumers |
