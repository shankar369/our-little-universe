# MemoryTimeline Section

## Purpose
Memory Timeline is the first full section after the journey hub. It presents memories as a premium mobile-first card stack with a framed reveal modal.

## Layout
Immersive-stage composition (design-system.md §4), centered single column on all breakpoints: compact header (eyebrow + one aurora line) → the `PhotoShuffleStack` stretched with `flex-1` to own the viewport → a slim `glass-chip` control rail (ordered dots, `n / total` counter, `Surprise me` dice). There is no side details panel; the active card already shows its date, title, and quote.

## Technical Notes
- Route: `/memory-timeline`
- Component: `MemoryTimeline.tsx`
- Data source: `src/content/memoryTimeline.ts`
- Type: `MemoryTimelineItem` in `src/content/types.ts`
- Expected photo folder: `public/memoryTimeline/`
- Photos should be referenced as `/memoryTimeline/<file-name>`.
- The section maps `MemoryTimelineItem` into the shared `RevealPhotoItem` shape before rendering reusable photo components.

## Shared Components
- `src/shared/components/ShuffleCards/PhotoShuffleStack.tsx` handles the swipeable Polaroid stack, tap-vs-drag guard, wraparound navigation, and previous/next controls.
- `src/shared/components/PhotoReveal/PhotoRevealDialog.tsx` handles the framed modal preview, image fallback, quote/story display, keyboard close, and previous/next modal navigation.
- Memory Timeline remains responsible for the route layout, timeline rail, random picker, and chronological content.

## Interaction Model
- The active card can be dragged horizontally.
- Swipe left past the threshold to go next.
- Swipe right past the threshold to go previous.
- Tapping the active card opens the framed reveal modal.
- The random picker opens the same reveal modal with a random memory.
- Missing images fall back to a designed gradient placeholder, so the section remains usable before real photos are added.

## Extensibility
Keep new timeline fields typed before use. If richer metadata is needed later, extend `MemoryTimelineItem` first, then update the content file and UI. Keep route-level code in this folder and reusable primitives in `src/shared`.
