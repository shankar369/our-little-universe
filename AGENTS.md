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

# DOX framework

- DOX is highly performant AGENTS.md hierarchy installed here
- Agent must follow DOX instructions across any edits

## Core Contract

- AGENTS.md files are binding work contracts for their subtrees
- Work products, source materials, instructions, records, assets, and durable docs must stay understandable from the nearest applicable AGENTS.md plus every parent AGENTS.md above it

## Read Before Editing

1. Read the root AGENTS.md
2. Identify every file or folder you expect to touch
3. Walk from the repository root to each target path
4. Read every AGENTS.md found along each route
5. If a parent AGENTS.md lists a child AGENTS.md whose scope contains the path, read that child and continue from there
6. Use the nearest AGENTS.md as the local contract and parent docs for repo-wide rules
7. If docs conflict, the closer doc controls local work details, but no child doc may weaken DOX

Do not rely on memory. Re-read the applicable DOX chain in the current session before editing.

## Update After Editing

Every meaningful change requires a DOX pass before the task is done.

Update the closest owning AGENTS.md when a change affects:

- purpose, scope, ownership, or responsibilities
- durable structure, contracts, workflows, or operating rules
- required inputs, outputs, permissions, constraints, side effects, or artifacts
- user preferences about behavior, communication, process, organization, or quality
- AGENTS.md creation, deletion, move, rename, or index contents

Update parent docs when parent-level structure, ownership, workflow, or child index changes. Update child docs when parent changes alter local rules. Remove stale or contradictory text immediately. Small edits that do not change behavior or contracts may leave docs unchanged, but the DOX pass still must happen.

## Hierarchy

- Root AGENTS.md is the DOX rail: project-wide instructions, global preferences, durable workflow rules, and the top-level Child DOX Index
- Child AGENTS.md files own domain-specific instructions and their own Child DOX Index
- Each parent explains what its direct children cover and what stays owned by the parent
- The closer a doc is to the work, the more specific and practical it must be

## Child Doc Shape

- Create a child AGENTS.md when a folder becomes a durable boundary with its own purpose, rules, responsibilities, workflow, materials, or quality standards
- Work Guidance must reflect the current standards of the project or user instructions; if there are no specific standards or instructions yet, leave it empty
- Verification must reflect an existing check; if no verification framework exists yet, leave it empty and update it when one exists

Default section order:
- Purpose
- Ownership
- Local Contracts
- Work Guidance
- Verification
- Child DOX Index

## Style

- Keep docs concise, current, and operational
- Document stable contracts, not diary entries
- Put broad rules in parent docs and concrete details in child docs
- Prefer direct bullets with explicit names
- Do not duplicate rules across many files unless each scope needs a local version
- Delete stale notes instead of explaining history
- Trim obvious statements, repeated rules, misplaced detail, and warnings for risks that no longer exist

## Closeout

1. Re-check changed paths against the DOX chain
2. Update nearest owning docs and any affected parents or children
3. Refresh every affected Child DOX Index
4. Remove stale or contradictory text
5. Run existing verification when relevant
6. Report any docs intentionally left unchanged and why

## User Preferences

When the user requests a durable behavior change, record it here or in the relevant child AGENTS.md

## Child DOX Index

| DOX | Scope | When to read |
|-----|-------|--------------|
| [src/app/AGENTS.md](src/app/AGENTS.md) | Registry, config, storage keys, section metadata | Adding routes, nav entries, timings, localStorage |
| [src/content/AGENTS.md](src/content/AGENTS.md) | Typed personal content and asset paths | Editing copy, memories, photos, puzzle answers |
| [src/design/AGENTS.md](src/design/AGENTS.md) | Motion presets and visual tokens | Animation changes, shared transitions |
| [src/features/AGENTS.md](src/features/AGENTS.md) | Gate, hero, future feature screens | Login, opening, non-chapter feature UI |
| [src/sections/AGENTS.md](src/sections/AGENTS.md) | Routed chapters and section workflow | Any `/journey`, `/memory-timeline`, etc. work |
| [src/shared/AGENTS.md](src/shared/AGENTS.md) | Reusable components, hooks, utilities | Photo primitives, ambient shell, hooks |

### Related human docs (not agent DOX)

- [docs/maintainability.md](docs/maintainability.md) — architecture notes and add-section checklist
- [docs/feature-roadmap.md](docs/feature-roadmap.md) — phase plan
- Section READMEs under `src/sections/*/README.md` — route-specific technical notes
