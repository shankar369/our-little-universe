# Our Little Universe — Design System ("Midnight Velvet")

This is the binding design contract for every screen, component, and future section.
Read it fully before doing any UI work. If a change conflicts with this document,
either follow the document or update it deliberately in the same change.

## 1. Design Philosophy

- This is a **private gift**, not a product. Every screen should feel like a page in a
  loved scrapbook found inside a night sky: romantic, slightly funny, cinematic, calm.
- **The night sky is the canvas.** Content lives directly in the ambient background.
  Full-screen glass panels that box the entire screen are forbidden — they turn the
  app into a floating modal and hide the universe.
- **One emotional moment per screen.** Each screen has exactly one serif italic
  aurora-gradient line (the emotional beat). Everything else supports it quietly.
- **Calm premium, not busy magic.** If a screen feels noisy, remove decoration first;
  never fix noise by adding blur, borders, or more glow.

## 2. Color Palette

All colors are Tailwind v4 `@theme` tokens in `src/index.css`. **Never** use raw
Tailwind palette colors (`fuchsia-100`, `violet-50/76`, ...) or invent new hex values
in components.

| Token | Value | Role |
|-------|-------|------|
| `night` | `#070312` | Page base, dialog backdrops |
| `deep` | `#0e0620` | Deep surface base |
| `plum` | `#1c0d33` | Raised surface tint |
| `starlight` | `#f5f0ff` | Primary text |
| `moon` | `#c9bce6` | Secondary text, quotes |
| `faint` | `#948ab8` | Tertiary text, hints, counters |
| `orchid` | `#c894fc` | Primary accent, focus rings, glows |
| `blush` | `#f7b8d4` | Romantic accent (hearts, butterflies) |
| `champagne` | `#f4d9a6` | Gold accent: eyebrows, active states, sparkle |

Fixed exceptions: dark text on warm paper / pastel buttons is always `#2b1048`.
Warm paper surfaces come only from `.polaroid`.

Usage rules:
- Champagne marks "where you are / what's precious" (eyebrows, active dot, dice icon).
- Orchid is interactive identity (focus outline `outline-orchid`, icon chips, glow).
- Blush is emotional decoration only, never text.

## 3. Typography

Fonts are loaded in `index.html` (variable axes incl. `SOFT`/`WONK` for Fraunces).

- `--font-display` (Fraunces): headlines, memory titles, quotes, polaroid captions.
- `--font-sans` (DM Sans): body, buttons, labels, navigation, forms.

Roles (classes in `src/index.css`):
- `.type-eyebrow` — 11px, 0.32em tracking, uppercase, almost always `text-champagne/85`.
- Headline — `font-medium`, `clamp` sizes only, max ~3.6rem on sections
  (~5.6rem only on the opening hero). Leading 0.98–1.12. Never larger: oversized
  type reads as marketing, not intimacy.
- `.type-quote` — italic Fraunces; used for subtitles, captions, hints, feedback.
- `.text-aurora` — gradient-clipped headline accent. **Exactly one per screen**, on
  the final italic phrase of the headline (pattern: plain first line + `type-quote
  text-aurora` block second line, with `pb-1` so descenders aren't clipped).
- `.text-glow` — halo for any heading sitting directly on the sky.

## 4. Spacing & Layout

- Page gutter: `px-6`; safe areas via `py-[max(1.5rem,env(safe-area-inset-top))]` and
  `pb-[max(5.5rem,env(safe-area-inset-bottom))]` when the heart menu is present.
- Mobile composition is **centered, single column**: eyebrow → headline → quote
  subtitle → content → actions. Desktop expands to an asymmetric 2-column grid
  (`lg:grid-cols-[~0.9fr_~1.1fr]`), text left-aligned, hero artifact on the right.
- **Immersive-stage exception** (component-led screens like Memory Timeline and Photo
  Universe): when one interactive artifact *is* the screen, use a centered single
  column on all breakpoints — a short header (eyebrow + one aurora line; drop the
  paragraph) over the artifact sized to own the viewport (`flex-1` for DOM components,
  explicit `svh` heights for the R3F canvas, which needs a measured height). Keep
  on-page chrome minimal: a slim `glass-chip` rail at most, or none at all when the
  artifact is self-explanatory and the `FloatingHeartMenu` covers navigation. Drop side
  panels and shrink the headline so the artifact, not the copy, holds the stage.
- Headings placed on the sky use `.night-veil` (soft radial darkening) for contrast.
- Max content widths: forms ~`23.5rem`, hubs `max-w-4xl`, split sections `max-w-5xl`+.
- Radii rhythm: pills/buttons `rounded-2xl`/`rounded-full`, cards `rounded-3xl`,
  polaroids `rounded-[1rem]` with inner photo `rounded-[0.6rem]`.

## 5. Surfaces (3 tiers only)

Defined in `src/index.css`; do not write ad-hoc glass styles.

1. `.glass-panel` — cards and dialogs. Never wraps a whole screen.
2. `.glass-chip` — pills, inputs, icon chips.
3. Bare night sky + `.night-veil`/`.text-glow` — headings and quiet text.

Menu exception: `.menu-panel` is the denser mobile navigation variant. It uses the
same glass language as `.glass-panel` but raises opacity so ambient decoration does
not read through the menu items.

Buttons: `.btn-primary` (aurora pastel gradient, `#2b1048` text, one primary action
per screen) and `.btn-ghost` (glass, icon buttons, secondary actions).
Photos: `.polaroid` (warm paper frame) is the only photo treatment.

## 6. Motion & Transitions

- House easing: `softEase` from `src/design/motion.ts`; reusable presets
  (`screenTransition`, `riseIn`) live there. Never duplicate easing magic numbers.
- Entrances: fade + 14–28px rise, 0.55–0.9s, staggered ~0.12–0.15s per element.
- Ambient loops are slow (8s+) and subtle; interactive feedback is fast
  (`active:scale-[0.985]`, `whileTap`).
- Everything decorative must respect `prefers-reduced-motion`: CSS animations are
  killed globally in `index.css`; Framer-driven decoration goes inside a
  `motion-reduce:hidden` wrapper; R3F scenes take a `reducedMotion` flag.

## 7. Photo Treatment

- Always warm paper (`.polaroid` or `#fff9f1` in 3D), 4/5 portrait default,
  serif italic captions, `.type-eyebrow` date labels in `#2b1048` opacities.
- Missing images must degrade beautifully: pastel gradient + heart + serif heading
  (`PhotoImage` fallback, `createFallbackTexture` in `PhotoSphere`).
- Compress real photos before adding to `public/`.
- Content stores logical paths (`/memoryTimeline/...`); components must load them via
  `publicAssetPath()` so gh-pages base URLs resolve correctly.

## 8. Decorative Elements (AmbientBackground)

Allowed layers, in order: nebula gradient base → aurora drift blobs (CSS keyframe
`aurora-drift`) → link-free starfield particles → twinkling four-point sparkle-stars →
rare diagonal shooting stars → drifting brand monograms (`N`, `S`, `N ♥ S`) →
floating serif word fragments (from `siteContent.ambientWords`) → 3 SVG butterflies →
rising hearts (≤7 desktop) → vignette.

Hard rules:
- No particle link lines, no grid overlays, no lightning icon glyphs. Background
  opacity stays ≤ ~0.5 per element; monograms peak at ~0.2 so they whisper.
- Monograms stay few (≤5 desktop) and serif (`type-quote`/`font-display`); they are
  ambient initials, never a repeating watermark or crowd.
- Shooting stars are rare (long `repeatDelay`) and thin; never a meteor shower.
- Decoration frames content; it never sits on top of headings, forms, or cards.
- Mobile gets reduced counts: `AmbientBackground` slices each layer behind a
  `(max-width: 640px)` check, on top of the responsive particle options.

## 9. The 3D Photo Universe

- The canvas is **unboxed**: transparent background, no border, edges melted with a
  CSS mask, soft radial aura behind it. It must feel like part of the page's sky.
- Scene contract: fog toward `#0a0418` for depth, central nebula spheres, drei
  `Sparkles` dust, warm-paper card frames, gentle per-card bob, slow auto-rotation.
- Performance: DPR capped `[1, 1.5]`, basic materials only, no postprocessing, no
  DOM labels in canvas, lazy-loaded route.

## 10. Accessibility & Performance

- Touch targets ≥ 44px (`h-11`+) for all important actions; no hover-only behavior.
- Focus style everywhere: `focus-visible:outline-2 outline-offset-4 outline-orchid`.
- Dialogs: `role="dialog"`, `aria-modal`, Escape/arrow keys handled.
- Body text ≥ 14px; `moon` on night passes contrast; never put low-opacity text on
  busy areas without `.night-veil`.
- `npm run build` and a 390px-wide visual check are required before finishing UI work.

## 11. Do's and Don'ts

Do:
- Reuse `glass-panel`/`menu-panel`/`glass-chip`/`btn-*`/`polaroid`/`type-*` classes.
- Keep copy romantic and personal; UI hints written as lowercase serif whispers
  ("swipe · tap to open"), never instructional doc-boxes.
- Put new copy in `src/content/`, new tokens in `index.css`, new motion in
  `src/design/motion.ts`.

Don't:
- Don't wrap screens in full-size panels; don't nest glass inside glass.
- Don't use raw Tailwind colors, new fonts, uppercase shouting outside
  `.type-eyebrow`, or more than one `.text-aurora` per screen.
- Don't add decorative elements beyond the allowed ambient set without updating
  this document first.
- Don't ship a screen you haven't looked at on a phone-sized viewport.

## 12. The Map (Our Little Atlas)

- The map is its own immersive canvas (`h-svh`, `absolute inset-0`): MapLibre GL JS on
  the free, no-key Carto **dark-matter** vector basemap, whose near-black palette reads
  as the night sky. The ambient background sits behind but is covered by the map; the
  map *is* the sky here. Frame floating UI with top/bottom night-gradient scrims.
- Places are **heart "NS" markers** (aurora blush→orchid gradient, plum `#2b1048`
  initials), styled in `index.css` `.atlas-marker`. The active marker scales up and
  pulses. This is the only sanctioned map glyph — no default pins, no clusters of icons.
- Transitions are MapLibre `flyTo` (zoom-out-then-in); reduced-motion uses `jumpTo`.
- Chrome stays minimal and glass: a `glass-chip` opener, `menu-panel` sheets (bottom on
  mobile, left drawer / bottom-left card on desktop), one `.text-aurora` line.
- Full-screen **modals are allowed** (gallery, lightbox, reveal dialog) — the "no
  full-size panel" rule is about boxing a *content screen* in glass, not dialogs. Photo
  galleries use `PhotoGalleryModal` (masonry + lightbox), never a bespoke grid.
