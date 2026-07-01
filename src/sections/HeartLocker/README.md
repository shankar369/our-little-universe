# HeartLocker Section

## Purpose
Heart Locker is the hidden chapter: a private vault reached only through a secret
long-press + password gesture, not the normal navigation. This file is the placeholder
landing (the real treasure content is designed later).

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
