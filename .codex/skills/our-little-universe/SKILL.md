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
- Shared hooks, components, and utilities live in `src/shared`.
- Motion constants and visual tokens live in `src/design`.

## Feature Guidance
- Add new major sections as feature folders.
- Add or update content types before adding content-heavy UI.
- Register major phases in `src/app/experienceRegistry.ts`.
- Lazy-load heavy future sections, especially the 3D photo universe.
- Keep localStorage keys in `src/app/appConfig.ts`.

## Design Guidance
- Design mobile first; desktop should enhance, not define, the experience.
- Use tap interactions, bottom-sheet-friendly layouts, and comfortable touch targets.
- Avoid hover-only behavior.
- Respect reduced motion.
- Keep decorative effects subtle enough that text remains readable.
- Background effects should feel alive and magical, but content always wins: never let ambience obscure headings, buttons, forms, or photo cards.
- Use Liquid Glass-inspired styling through blur, saturation, translucency, reflective edges, and depth shadows. Avoid noisy glass or transparent panels that make text fight the background.

## Verification
- Run `npm run build` after code changes.
- Use mobile viewport visual checks for layout-sensitive work.
- No formal tests are required for now because this is a personal website.
