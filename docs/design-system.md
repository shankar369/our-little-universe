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
- `--font-script` (Parisienne): the "handwritten in the margin" voice — UI whispers
  and hints, signatures, and the chapter-curtain title. **Never** body copy, buttons,
  eyebrows, headlines, or form values. Max **one script element per viewport**
  (mirror of the `.text-aurora` rule). The aurora headline line stays Fraunces
  (`.type-quote`) — two display voices in one headline fight each other.
  *Carved-out exception:* the Journey Hub's chapter-letter **addresses** — every
  envelope title is script because handwriting *is* the letter; the rule keeps
  applying to everything around them (the hub headline, notes, and CTAs stay
  Fraunces/DM Sans).

Roles (classes in `src/index.css`):
- `.type-eyebrow` — 11px, 0.32em tracking, uppercase, almost always `text-champagne/85`.
- Headline — `font-medium`, `clamp` sizes only, max ~3.6rem on sections
  (~5.6rem only on the opening hero). Leading 0.98–1.12. Never larger: oversized
  type reads as marketing, not intimacy.
- `.type-quote` — italic Fraunces; used for subtitles, captions, feedback.
- `.type-script` — Parisienne whispers ("swipe · tap to open", "…see?", login hints);
  `clamp(1.125rem, 3.2vw, 1.375rem)` floor keeps it legible at 390px.
  `.type-script--display` — the large variant for curtain titles and signatures.
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
per screen) and `.btn-ghost` (glass, icon buttons, secondary actions). Both carry
their press state in the class (`:active` scale 0.985) — never re-add ad-hoc
`active:scale-*` utilities. `.btn-primary` has a desktop-only shine sweep
(`@media (hover:hover) and (pointer:fine)`); `.btn-ghost` lifts 1px with an orchid
bloom on hover.
Inputs: `.input-glass` (glass chip + orchid caret + double-glow focus) is the only
form-field treatment.
Photos: `.polaroid` (warm paper frame) is the only photo treatment.
Texture: `.grain-veil` (static SVG noise via `--grain-url`, opacity 0.035,
soft-light) — at most **two** grain layers alive at once (background + one overlay).

## 6. Motion & Transitions

- House easing: `softEase` from `src/design/motion.ts`; reusable presets
  (`screenTransition`, `curtainScreenTransition`, `riseIn`) and the chapter-curtain
  timing constants (`curtain`) live there. Never duplicate easing magic numbers.
- Entrances: fade + 14–28px rise, 0.55–0.9s, staggered ~0.12–0.15s per element.
- Ambient loops are slow (8s+) and subtle; interactive feedback is fast
  (`:active` scale in the button classes, `whileTap`).
- Micro-interaction grammar: shine sweep is hover-only (fine pointers); heart FAB
  breathes via the `heart-breathe` keyframe (5.5s, paused while charging); magnetic
  hover (`Magnetic` wrapper, ±4px springs) is scoped to the heart FAB + fullscreen
  toggle only; hub chapter letters lift `-translate-y-1` while their envelope
  flap tilts open (`rotateX`, fine pointers only — the letter reads fully
  closed on touch).
- Iconography: lucide only, global stroke-width 1.75 (`svg.lucide` base rule).
  Sizes — `h-4 w-4` inline/menu rows, `h-5 w-5` inside ≥44px chips, `h-3.5 w-3.5`
  decorative accents. Colors — orchid = interactive identity, champagne =
  precious/active, moon/faint = neutral, blush = emotional decoration (filled).
- Everything decorative must respect `prefers-reduced-motion`: CSS animations are
  killed globally in `index.css`; Framer-driven decoration goes inside a
  `motion-reduce:hidden` wrapper; R3F scenes take a `reducedMotion` flag.
- WebGL transition layers (locker atmosphere, ember dissolve, silk curtain, ember
  iris) gate on `useRichMotion().rich` from `shared/lib/richMotion.ts` — WebGL
  available AND motion welcome — and every one keeps a DOM/static fallback. `compact`
  (≤640px) halves particle budgets.

## 7. Photo Treatment

- Always warm paper (`.polaroid` or `#fff9f1` in 3D), 4/5 portrait default,
  serif italic captions, `.type-eyebrow` date labels in `#2b1048` opacities.
- Missing images must degrade beautifully: pastel gradient + heart + serif heading
  (`PhotoImage` fallback, `createFallbackTexture` in `PhotoSphere`).
- Compress real photos before adding to `public/`.
- Content stores logical paths (`/memoryTimeline/...`); components must load them via
  `publicAssetPath()` so gh-pages base URLs resolve correctly.

## 8. Decorative Elements — The Constellation Sky (AmbientBackground)

The background is a calm night with the initials written in stars. Allowed layers,
in order: simplified nebula base (one orchid radial + diagonal night gradient) →
**one** aurora blob (`animate-aurora-slow`) → seeded static star field (~90 desktop /
~50 compact, deterministic `mulberry32`, ~⅓ twinkle via the `star-twinkle` CSS
keyframe — **no particle engine**) → the three constellations → sparse extras
(≤2 rising hearts, ≤1 butterfly desktop-only, 1 rare shooting star) → `.grain-veil`
→ vignette. Zero recurring main-thread work after mount.

Constellation rules:
- Glyph data lives in `src/shared/components/constellationData.ts` (normalised
  `0 0 100 140` boxes); rendered by `ConstellationGlyph` (halo + core circles,
  no SVG filters).
- Budgets: 6–9 stars per letterform; line `strokeOpacity` ≤ 0.16; whole-glyph
  wrapper opacity ~0.55; ≤3 glyph placements desktop (N, S, N♥S sigil), 2 on
  compact (N + sigil). Champagne anchors are the "named stars".
- Drift is a 45–70s framer loop gated on `useReducedMotion()` — under reduced
  motion the constellations stay **visible but still** (they are the art, not
  decoration to hide); the extras live in `motion-reduce:hidden` as usual.
- Shooting stars stay rare (repeatDelay ≥ 26s) and thin; never a meteor shower.
- Decoration frames content; it never sits on top of headings, forms, or cards.

## 9. The 3D Photo Universe

- The canvas is **unboxed and full-bleed**: transparent background, no border, edges
  melted with a CSS mask, soft radial aura behind it. The galaxy fills the whole screen
  with the header + hint floating over it (`absolute`), so it feels like the page's sky.
- The floating header and hint sit on **deep night scrims** (top `from-night/95`,
  bottom `from-night/90`) and the initial camera starts far enough back (portrait
  further than landscape) that the sphere reads as a globe — photos must never crowd
  or overlap the headline.
- Cards are **frameless rounded photos with a soft additive halo** — no paper frame and
  no caption text in the sphere. Each photo is fit inside a 1×1 box preserving its true
  aspect ratio (never squished).
- Scene contract: distance-aware fog toward `#0a0418` (near/far follow the camera so
  zoom-out never dissolves the galaxy), central nebula spheres, drei `Sparkles` dust,
  gentle per-card bob, slow auto-rotation. Zoom range is generous so the whole sphere
  can be framed on a phone; selection is a movement-guarded tap (drags never select).
- Performance: DPR capped `[1, 1.5]`, basic materials + one shared halo texture, no
  postprocessing, no DOM labels in canvas, lazy-loaded route.

## 10. Accessibility & Performance

- Touch targets ≥ 44px (`h-11`+) for all important actions; no hover-only behavior.
- Focus style everywhere: `focus-visible:outline-2 outline-offset-4 outline-orchid`.
- Dialogs: `role="dialog"`, `aria-modal`, Escape/arrow keys handled.
- Body text ≥ 14px; `moon` on night passes contrast; never put low-opacity text on
  busy areas without `.night-veil`.
- Global controls float at the bottom corners: the heart menu (`btn-primary`,
  bottom-right) and the fullscreen toggle (`btn-ghost`, bottom-left, hidden where the
  Fullscreen API is unavailable). Keep section chrome clear of both corners.
- The opening route carries the app's **birthday beat** inside the Opening Overture
  (§13c). Without rich motion the static fallback keeps the original `BirthdayWish`
  candle (token-colored CSS flame, warm-paper cake) and an ungated journey CTA, so
  nobody is locked out of the app by an interaction they can't perform.
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
- Don't use raw Tailwind colors, fonts beyond the three tokens (display/sans/script),
  uppercase shouting outside `.type-eyebrow`, or more than one `.text-aurora` (or
  `.type-script`) per screen.
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
- The markers are joined by the **journey thread**: a champagne stitched-dot line
  (round caps, `dasharray [0.1, 2.4]`, opacity ≤ 0.55) over a faint orchid glow line,
  drawn through the places in story order. It is the map's only sanctioned line layer.
- Transitions are MapLibre `flyTo` (zoom-out-then-in); reduced-motion uses `jumpTo`.
- Chrome stays minimal and glass: a `glass-chip` opener, `menu-panel` sheets (bottom on
  mobile, left drawer / bottom-left card on desktop), one `.text-aurora` line.
- Full-screen **modals are allowed** (gallery, lightbox, reveal dialog) — the "no
  full-size panel" rule is about boxing a *content screen* in glass, not dialogs. Photo
  galleries use `PhotoGalleryModal` (masonry + lightbox), never a bespoke grid. The
  lightbox is zoomable (pinch / wheel / double-tap, 1–4×, drag-to-pan while zoomed);
  swipe gestures keep their navigate/dismiss meaning only at rest (1×).

## 13. Scroll Cinema (Heart Locker)

- The Heart Locker is the app's flagship **scroll-driven** experience (the Opening
  Overture's Story of You, §13c, borrows the same grammar): tall acts
  (`height: n×100svh`) with a `sticky top-0 h-svh overflow-hidden` stage, animated via
  `useScroll` + `useTransform`. Nothing autoplays — scroll position *is* the timeline.
- Structure: one title beat per act (eyebrow + single aurora line), then the photos
  perform; whispers stay lowercase serif. Photos keep the `.polaroid` treatment.
- The app root must remain `overflow-x-clip` (never `overflow-x-hidden`) — a hidden
  overflow ancestor silently kills `position: sticky` for every act.
- Reduced motion: every act must render a static equivalent (plain grid / final line),
  not a broken half-animation.
- Scroll-mapped values live in MotionValues end-to-end (no per-frame React state);
  runtime-measured geometry (e.g. the finale's letter landing) is set into MotionValues
  from a measure-on-resize effect.
- **The ember layer**: under rich motion (`useRichMotion().rich`) the locker carries a
  fixed WebGL ember atmosphere behind all acts (scroll-velocity drift/glow, warms with
  depth, dims to ~25% as the finale enters) plus the last filmstrip photo's
  scroll-scrubbed ember dissolve. Budgets: ~1,000/~450 atmosphere and ~2,600/~1,100
  dissolve embers (desktop/compact), DPR ≤ 1.5. New ember scenes reuse
  `shared/lib/emberGlsl.ts` so all embers read as one material; WebGL scenes read
  MotionValues with `.get()` inside `useFrame` (never React state). Without rich
  motion the acts keep their static glows; reduced motion never mounts a canvas.

## 13b. The mUSeum (first-person gallery)

- `/museum` is the app's only **walkable 3D space**: a first-person velvet gallery
  hall (R3F) floating in the ambient constellation sky (transparent canvas). The
  chapter card, entrance overlay, and password gate follow the normal Midnight
  Velvet language; **inside the hall the 3D scene owns its own art direction**
  (gold frames, warm paper mats, champagne picture lights over plum walls — the
  palette translated into materials, not classes).
- Interaction contract: WASD/arrows + drag-look on desktop; joystick + touch-look
  on mobile (joystick sits clear of the fullscreen-toggle corner); tapping an
  exhibit glides the camera to it, tap-anywhere/Escape steps back. All movement
  state lives in refs — never React state per frame.
- Gate: same glass modal pattern as the Heart Locker prompt; unlocked per tab via
  `appConfig.storageKeys.museumUnlocked`.
- Performance: DPR ≤ 1.5, shared module-level materials, ≤ 5 lights, fake
  picture-light pools, dust `Sparkles` (45 compact / 90 desktop), photos capped
  at 16. Reduced motion / no WebGL falls back to the gate + polaroid grid.

## 13c. The Opening Overture (`/`)

The first screen is a three-act birthday cinematic (`features/opening/`), gated on
`useRichMotion().rich` with a static single-column fallback (quote → the story verses
as static polaroid rows → `BirthdayWish` candle → ungated CTA).

- **Act 1 — Wish Overture**: the birthday quote alone on the sky. Plain headline line
  rises word-by-word from a blur; her name cascades letter-by-letter as the viewport's
  single `.text-aurora` moment; a `.type-script` scroll cue waits at the bottom.
- **Act 2 — The Story of You**: a 560svh scroll-cinema track (sticky `h-svh` stage)
  telling one sentence in three verses — "you were born" → "became a princess" →
  "to be mine". Each verse speaks its line center stage (display lead + the
  viewport's single `.text-aurora` payoff + a quote whisper), lifts it to the sky,
  then its photos perform: verse 1 blooms out of a star-point (childhood), verse 2
  fans open like a tiara, verse 3 arrives from opposite edges and leans in. Behind
  each verse's photos a giant translucent signature glyph (sparkle / crown / heart,
  ~64svh, champagne/30 or blush/35, thin 0.4 stroke) flares in while the photos fly
  in, settles to a steady glow for the hold, and drifts out with the verse —
  decoration behind the cards, never over text. Photos are auto-discovered from
  `src/content/openingPhotos/group1|2|3/` (build-time glob, ≤4 per verse, empty
  folders TEMP-fallback to the hero test photos); resting layouts have separate
  desktop/compact pose tables (compact cascades vertically so every photo stays
  visible at 375px; desktop sits +4.5svh below center and caps cards at `34svh` so
  short landscape viewports keep the lifted verse text clear of the cards); every
  value maps from `useScroll` MotionValues — no per-frame React state. A soft
  champagne/blush aura flares as each verse's photos arrive, and a script outro
  line hands the scroll to the cake.
- **Act 3 — Cake Moment**: the interactive 3D drip cake (see below). Blowing the
  candles (tap any candle, or the accessible `glass-chip` "blow" button) cascades the
  flames out, fires canvas-confetti bursts, releases 3D heart balloons, and reveals
  the one `btn-primary` door into `/journey`. Tapping the candles again relights them.

**The cake scene contract** (`features/opening/cake/`, lazy chunk, modeled on
bdaycake.com):

- Fully procedural geometry — no model files, no network: three sponge tiers wearing
  a sculpted glaze (parametric drip-curtain surface + domed lathe cap per tier), a
  lathe plate, chocolate curls, gold sparkler, warm-paper name tag (canvas texture in
  the page's own fonts), pastel gifts, and extruded-heart balloons.
- **Lighting is environment-only**: a procedural drei `<Environment>` of Lightformer
  softboxes (warm ceiling key, white front fill, blush/periwinkle sides, lilac rim) —
  no direct lights except the flickering candle point light. Long lens (fov 30
  desktop / 38 portrait), transparent canvas over the constellation sky, DPR ≤ 1.5.
- Sponge is roughness-1 with a canvas crumb map doubling as bump + baked AO; glaze is
  clearcoat-1 / roughness ~0.13 physical material — that pairing, not geometry alone,
  is what reads as "real cake". Candles wear spiral-stripe canvas textures and stand
  on every tier's ledge; flames are GLSL teardrop billboards + additive halos.
- Interactions: horizontal drag spins the cake (`touch-action: pan-y` keeps scrolling
  free), movement-guarded taps blow candles, assembly plays once on scroll-into-view
  (springy `backOut` drops driven by a shared clock ref).
- Celebration layers: `canvas-confetti` (worker-backed, palette-tinted, hidden under
  `motion-reduce`) draws on a DOM overlay canvas; heart balloons rise inside the 3D
  scene so they share the cake's lighting and occlusion.

## 14. The Chapter Curtain (route transitions)

- Navigating between sections plays `ChapterCurtain`: one continuous velvet layer
  (soft-edged night→deep→plum gradient, 200vw wide, aurora hairline on the leading
  edge, grain inside) sweeps across, holds ~0.35s showing the title card, then parts.
  Total ≤ 1.35s; every number lives in `motion.ts` `curtain`.
- Under rich motion the veil renders as the `VelvetCurtainGL` silk shader (same
  gradient stops, span, and keyframes; adds noise ripple, woven sheen, champagne
  sparks, and a glowing leading edge). It is lazy-loaded and idle-prefetched; the DOM
  veil stays as the fallback for reduced motion, missing WebGL, and the first sweep if
  the chunk hasn't arrived. The title card is always DOM.
- Title card anatomy: registry icon in a `glass-chip` disc → `.type-eyebrow` chapter
  whisper → chapter name in `.type-script--display .text-glow`. Chapter metadata comes
  from `experienceRegistry` (which owns the canonical `icon` per section).
- The page swap hides under the veil: `ScreenTransition` uses
  `curtainScreenTransition` (exit = hold; enter rises as the veil parts). The login
  gate uses `variant="fade"`.
- It must **not** play: on first load (path ref initialised to current), on the login
  → hero swap, within 1.5s of a `CinematicTransition` overlay (the heart-iris owns
  those navigations, via `lastPlayedAt()`), or under reduced motion (instant swap).
  Browser back/forward reverse the sweep direction (`useNavigationType` POP).
- Z-map: content 10 < chrome 50 < atlas/reveal 55–60 < gallery 70–80 < locker prompt
  90 < **curtain 100** < cinematic overlays 120.
