# ShuffleCards

## Purpose
`PhotoShuffleStack` is a reusable mobile-first photo stack for memories, puzzles, and future photo sets. It owns the swipe, tap, wraparound, and visual card choreography while the route owns the content and selected state.

## Props Contract
- `items`: typed `RevealPhotoItem` data with `photo`, `heading`, `name`, and `text`.
- `activeIndex`: controlled current card.
- `onActiveIndexChange`: receives the next wrapped index.
- `onOpenItem`: called when the active card is tapped.
- `swipeThreshold` and `visibleRadius`: optional tuning knobs for future sections.

## Interaction Model
The active card can be dragged left or right. A drag beyond the threshold changes cards; smaller drags snap back. A pointer movement guard prevents drag gestures from also opening the reveal modal.

## Visual Rules
Keep the component scrapbook-inspired but calm: white Polaroid cards, strong foreground separation, clear text, and 44px minimum touch controls. Do not rely on hover-only behavior.
