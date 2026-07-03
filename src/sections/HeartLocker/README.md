# HeartLocker Section

## Purpose
Heart Locker is the hidden chapter: a private vault reached only through a secret
long-press + password gesture, not the normal navigation. Inside, it is a
**scroll-driven cinema** — the page is ~23 viewports tall and every animation is tied
to scroll position (sticky viewports + `useScroll`/`useTransform`).

## The Scroll Cinema (component per act)
1. **Intro** (`HeartLocker.tsx`) — title, minutes-remaining chip, "scroll slowly" cue.
2. **Act I — `StackedAct.tsx`** ("you don't understand how much I like these photos"):
   sticky **photo deck** — each polaroid rises from below the fold, overshoots a touch
   and lands on the pile; cards beneath compress, peek upward and dim (continuous
   depth). Cards are opaque from entry — nothing ever fades over text.
3. **Act II — `FilmstripAct.tsx`** ("and I'd walk through every one of them again"):
   scroll-pinned **horizontal filmstrip** — vertical scroll glides the strip across the
   screen (runtime-measured travel via `startX`/`endX` MotionValues) while each photo
   parallaxes inside its frame; tilt + bob per card. The track **leans into scroll
   velocity** (spring-smoothed skew, clamped ±3.5°), and over the final ~12% the last
   photo performs the **ember dissolve** (below).

### The ember layer (rich motion only, gated by `useRichMotion().rich`)
- **`LockerAtmosphere.tsx`** — one fixed full-viewport WebGL canvas behind every act:
  sparse drifting embers (~1,000 desktop / ~450 compact) whose drift + glow react to
  scroll velocity; the field warms toward gold with page depth and dims to ~25% as the
  finale enters so `FinaleEmbers` reads as the same field's crescendo. Act II feeds it
  a `streak` MotionValue that smears embers into horizontal light streaks at speed.
  When `rich` is false the acts keep their original static radial glows instead.
- **`PhotoEmberDissolve.tsx`** — the Act II→finale bridge: the last polaroid's photo is
  pixel-sampled (`sampleImageToPoints`) into ~2,600/~1,100 embers that lift out of the
  paper frame and drift upward, scrubbed straight from scroll (reversible); the DOM
  `<img>` crossfades inversely. Renders in its own thin overlay canvas ABOVE the act
  content (the atmosphere canvas is behind the cards and would be occluded).
- **Act seams** — `ActSeam` in `HeartLocker.tsx`: an aurora hairline that brightens and
  stretches as it sweeps past between acts (DOM, `motion-reduce:hidden`).
4. **Finale — `FinaleAct.tsx` + `FinaleEmbers.tsx`**: an R3F **ember particle scene**
   (~15,400 GPU points, two clouds with custom shaders). Embers gather into "Navya" →
   the a-v-y-a letters blow away as ash → the N swarm zooms, **flips** (rotation.x→π),
   **turns 90° CW** (rotation.z→−π/2; flip∘turn maps `(x,y)→(−y,−x)`, so S targets are
   authored through that map's inverse) → the swarm **boils and condenses into the S**
   → every ember returns to write "Navya's Sankar"; the S-swarm lands in its slot.
   Letterforms are canvas-sampled from the real page font (re-sampled after
   `document.fonts.ready`). No DOM font is used for the signature.
5. **Outro** — "Seal it back up".

Photos: auto-discovered from `src/content/heartLockerPhotos/<folder>/`
(`photo-stack`, `photo-strip`) via `src/content/heartLockerGallery.ts`; empty folders
TEMP-fallback to the hero test photos. All acts render static grids/lines under
`prefers-reduced-motion`.

**Sticky caveats**:
- The app root must stay `overflow-x-clip` (not `-hidden`) or every sticky act breaks
  (App.tsx has a comment).
- Scroll-driven `opacity` fades must use the **function form** of `useTransform`
  (`useTransform(() => fade.get())`): Motion otherwise promotes them to native
  ScrollTimeline animations, which mis-map ranges on these svh sticky sections.

## Access Flow (owned across a few files)
1. **Reveal the card**: press-and-hold the heart menu FAB for 5s (`FloatingHeartMenu`,
   timing in `appConfig.timings.heartLockerHoldMs`). A charge ring fills; at completion
   `reveal()` surfaces the hidden **Heart Locker chapter card in the Journey hub** (the
   `reveal` cinematic shimmers) and routes to `/journey`.
2. **Enter**: tapping that card in `JourneyHub` opens `HeartLockerPrompt`. A correct
   password (`siteContent.heartLocker.answer`, default `hello123`) calls `unlock()`,
   plays the `unlock` **heart-iris** cinematic, and navigates here. If already unlocked,
   the card enters straight in (no prompt).
3. **Session**: both `revealed` and `entered` live in `sessionStorage` (per-tab) with a
   30-min expiry (`appConfig.timings.heartLockerUnlockMs`); `HeartLockerContext` auto-
   hides the card when it elapses.
4. **Hide**: hold the heart 5s again while the card is showing → `hide()` + the `seal`
   cinematic (the iris closes). The "Seal it back up" button here does the same.

## Technical Notes
- Route: `/heart-locker`, guarded in `App.tsx` (redirects to `/journey` when locked).
- State: `src/features/heartLocker/HeartLockerContext.tsx` (`useHeartLocker`).
- Prompt: `src/features/heartLocker/HeartLockerPrompt.tsx`.
- Cinematics: `src/shared/components/CinematicTransition.tsx` (`unlock` / `seal`).
- Menu entry appears only while unlocked (`FloatingHeartMenu`).

## Extensibility
Keep the reveal/unlock mechanics in `features/heartLocker`; build the actual locker
content (letters, hidden photos, etc.) inside this section folder.
