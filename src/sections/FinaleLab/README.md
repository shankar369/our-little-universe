# FinaleLab Section

## Purpose
A private screening room at `/finale-lab` (deliberately **not** registered in
`experienceRegistry` — reachable only by URL) for auditioning five candidate
Heart Locker finales and picking one. Each candidate pairs a different
typeface with a different particle material.

## How it works
- The lab is **scroll-driven, exactly like the production finale**: each
  variant is a 560svh sticky chapter whose `scrollYProgress` drives the
  choreography — scroll to perform, scroll back to rewind. A pinned chip names
  the variant + font; a thin rail shows chapter progress.
- Variants live in `src/sections/HeartLocker/finaleVariants/`:
  - `finaleEngine.ts` — font-parameterised text sampling (forces canvas-only
    webfonts to load via `document.fonts.load`), target authoring (word / ash /
    hero N→S via the inverse flip∘turn map / final line), and the canonical
    eight-beat timeline.
  - `variantScaffold.tsx` — `createFinaleVariant(config)`: shared uniforms,
    attributes, lifecycles, and the staggered per-particle blend snippets
    (every particle departs/arrives on its own curved arc).
  - `HeroRig.tsx` — the shared flip → turn → land-in-slot transform.
  - Five components: `VelvetScriptFinale` (Parisienne × aurora ribbons),
    `EngravedGoldFinale` (Cinzel × gold stitches), `StarlightItalicFinale`
    (Fraunces italic × stars + constellation lines), `CrystalModernFinale`
    (DM Sans bold × crystal shards), `EditorialWaltzFinale` (Playfair italic ×
    bokeh fireflies).
- All five share `FinaleEmbers`' interface (`{ progress, density? }`) — the
  winner drops into `FinaleAct.tsx` as a one-line swap.
- Canvases mount only near the viewport (never five live scenes at once);
  density 0.85 desktop / 0.55 compact in the lab, 1 in production.
- Cinzel and Playfair Display italic were added to `index.html` for this;
  remove them if the winning variant doesn't use them.
- Reduced motion / no WebGL: the lab shows a note instead.

## After the pick
Swap the chosen component into `FinaleAct.tsx` in place of `FinaleEmbers`;
keep or delete this route (`App.tsx`) and the unused variants as desired.
