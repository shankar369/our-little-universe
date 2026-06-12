# Maintainability Notes

## Research-Based Decisions
- React recommends sharing state by lifting it to the closest common parent, so this app keeps the soft-gate state in `App` and pushes storage details into a hook.
- React supports `lazy` and `Suspense` for code splitting, so future heavy sections like the 3D photo universe should be lazy-loaded when they are added.
- Vite exposes environment and build-time values through `import.meta.env`, so future environment-specific behavior should use Vite env variables instead of custom global objects.
- Tailwind v4 uses `@theme` variables to define design tokens, so global colors and font tokens belong in `src/index.css` rather than scattered CSS files.

References:
- React state structure: https://react.dev/learn/managing-state
- React lazy loading: https://react.dev/reference/react/lazy
- Vite env and modes: https://vite.dev/guide/env-and-mode
- Tailwind theme variables: https://tailwindcss.com/docs/theme

## Current Project Shape
- `src/app`: app constants, registry, and future top-level orchestration helpers.
- `src/content`: typed editable content for the personal story.
- `src/design`: shared animation constants and future visual tokens.
- `src/features`: self-contained user-facing sections or screens.
- `src/sections`: routed app sections, each with local implementation and a section README.
- `src/shared`: reusable components, hooks, and utilities.

## Reusable Experience Primitives
- Put reusable interaction primitives in `src/shared/components`.
- Keep route-specific copy, orchestration, and layout in `src/sections`.
- Shared photo primitives should accept typed content and callbacks; they should not import section data directly.
- `PhotoShuffleStack`, `PhotoRevealDialog`, and `PhotoSphere` are shared contracts for future memory, puzzle, and gallery sections.
- Preserve mobile-first gestures, 44px controls, reduced-motion behavior, and foreground/background separation whenever these primitives are reused.

## How To Add A New Section
1. Add content types in `src/content/types.ts` if the section has new data.
2. Add content values in `src/content/siteContent.ts` or a dedicated content file.
3. Create a routed section folder under `src/sections` when the feature has its own route, including a `README.md`.
4. Add the section metadata to `src/app/experienceRegistry.ts`.
5. Wire the section into the app flow from `src/App.tsx` or a future journey controller.
6. If the section is heavy, lazy-load it with `React.lazy`.

## Personal Content Policy
- Keep secrets out of this repo. The current login is only a cute client-side gate.
- Store photos in `public/photos` when real assets are added.
- Keep captions, puzzle answers, stories, and wrong-answer messages in content files rather than components.

## Performance Guardrails
- Mobile is the primary target, and desktop must still receive a deliberately composed layout.
- Keep particle counts low on small screens while keeping the ambience visible.
- Follow the Midnight Velvet design contract in [design-system.md](design-system.md): content on the night sky, glass only on cards/controls, semantic color tokens, warm-paper polaroids.
- Preserve a recognizable ambient language: aurora drift, starfield particles, floating words, butterflies, and rising hearts — never so dense that text fights the background.
- Keep the ambience refined. If visual density increases, remove decorative elements before increasing blur or opacity.
- Lazy-load 3D and gallery-heavy features.
- Keep Three.js scenes simple on mobile: capped DPR, simple materials, no DOM-per-photo labels, and no postprocessing until it is clearly worth the cost.
- Compress photos before adding them.
- Prefer tap/reveal interactions over scroll-heavy pinned animation on phones.
