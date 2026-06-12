---
name: our-little-universe
description: Work on the Our Little Universe birthday memory app with its mobile-first romantic design system, feature-folder architecture, and typed local content model.
---

# Our Little Universe Skill

Use this skill whenever changing this project.

## Core Intent
- This is a personal birthday memory website, not a generic landing page.
- The primary device is mobile portrait.
- The site must feel stunning on both mobile and desktop; desktop layouts should be intentionally composed, not merely stretched mobile screens.
- The emotional tone is romantic, funny, cinematic, and birthday-like.
- Preserve the luxury purple/black universe theme, visible glowing particles, floating hearts, butterflies, lightning glints, purple glow fields, and Polaroid scrapbook language.
- Keep the aesthetic premium, calm, and separated: text and controls belong on readable glass/dark material surfaces, while ambience stays behind or around them.

## Architecture
- `src/App.tsx` should remain small and orchestration-focused.
- App constants and section metadata live in `src/app`.
- Editable personal content lives in `src/content`.
- Feature UI lives in `src/features/<feature>`.
- Routed sections live in `src/sections/<SectionName>` and each section folder must include a `README.md`.
- Shared hooks, components, and utilities live in `src/shared`.
- Motion constants and visual tokens live in `src/design`.

## Feature Guidance
- Add new major sections as feature folders.
- For routed sections, add a dedicated folder under `src/sections` and document purpose, route, data, and extension notes in that folder's `README.md`.
- Add or update content types before adding content-heavy UI.
- Register major phases in `src/app/experienceRegistry.ts`.
- Lazy-load heavy future sections, especially the 3D photo universe.
- Keep localStorage keys in `src/app/appConfig.ts`.

## Design Guidance
- The binding design contract is `docs/design-system.md` ("Midnight Velvet"). Read it before any UI change.
- Content lives directly in the night sky; never wrap a screen in a full-size glass panel. Glass (`glass-panel`, `glass-chip`) is for cards and controls only.
- Use only the semantic color tokens from `src/index.css` (night/deep/plum, starlight/moon/faint, orchid/blush/champagne) plus `#2b1048` on warm paper.
- One serif-italic `.text-aurora` headline accent per screen; headlines capped at modest clamp sizes.
- Photos always use the warm-paper `.polaroid` treatment with designed fallbacks.
- Design mobile first; desktop is an asymmetric expansion, not a stretch.
- Tap interactions, 44px+ targets, no hover-only behavior, respect reduced motion.
- Ambience (aurora, starfield, butterflies, floating words, hearts) frames content and never obscures headings, forms, or cards.

## Verification
- Run `npm run build` after code changes.
- Use mobile viewport visual checks for layout-sensitive work.
- No formal tests are required for now because this is a personal website.
