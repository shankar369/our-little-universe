# Our Little Universe Instructions

## Product Direction
- Build this as a mobile-first birthday memory experience, with desktop as an enhanced layout.
- Every major screen must look stunning on both mobile and desktop; mobile is the starting point, but desktop cannot feel like an afterthought.
- Keep the tone romantic, funny, cinematic, and personal.
- Preserve the dark purple/black luxury look, visible glowing particles, floating hearts, butterflies, lightning glints, purple glow fields, and scrapbook/Polaroid details.
- Keep the visual system premium and calm: foreground content must sit on clear glass/dark material surfaces, with strong separation from the decorative background.
- Use Liquid Glass-inspired styling intentionally: blur, translucency, edge highlights, and subtle reflection are good; low-contrast transparent text over busy effects is not.
- Do not turn the first screen into a marketing page. The app should feel like a private gift.

## Architecture Rules
- Put feature-specific UI in `src/features/<feature-name>/`.
- Put routed user-facing sections in `src/sections/<SectionName>/`, with a `README.md` in every section folder.
- Put reusable UI, hooks, and utilities in `src/shared/`.
- Put editable personal content in `src/content/`.
- Put app-level constants and section registries in `src/app/`.
- Put shared animation and visual tokens in `src/design/`.
- Keep `src/App.tsx` as orchestration only: background, gate state, and top-level screen switching.

## Extension Rules
- Add each major future phase as a feature folder, for example `src/features/timeline`, `src/features/photo-universe`, or `src/features/quote-puzzles`.
- Add each routed section under `src/sections`, and keep route-specific implementation details inside that section folder.
- Register planned or live sections in `src/app/experienceRegistry.ts` so the project has one map of the experience.
- Prefer typed content models before building new UI. If a section needs memories, puzzles, or photos, add types in `src/content/types.ts`.
- Keep localStorage keys centralized in `src/app/appConfig.ts`.
- Use `React.lazy` and `Suspense` when a future section becomes heavy, especially the 3D photo globe.

## Mobile And Motion Rules
- Design portrait mobile first and avoid hover-only interactions.
- Use tap-friendly controls with at least 44px height for important actions.
- Respect `prefers-reduced-motion`; decorative movement must be safe to reduce or remove.
- Keep expensive visual effects behind focused components, and reduce particle/3D density on phones.
- Background ambience should be clearly visible but never block readability: hearts, butterflies, lightning, glints, and purple glow should frame the content rather than sit on top of it.
- If a screen starts to feel cumbersome, reduce decoration first and strengthen hierarchy before adding more animation.

## Commands
- Install dependencies: `npm install`
- Start local app: `npm run dev`
- Production check: `npm run build`
- Lint check: `npm run lint`
