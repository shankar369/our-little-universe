# Feature Roadmap

## Phase 1: Foundation
- Live: soft login gate, animated ambient background, opening hero, content structure, and extension instructions.

## Phase 2: Memory Timeline
- Add a routed journey hub and floating section menu.
- Add a mobile-first vertical timeline with swipeable photo stack.
- Each memory card reveals a photo, quote, and short story on tap.
- Store timeline content in typed local data.

## Phase 3: Photo Universe
- Live foundation: interactive 3D photo globe with React Three Fiber, Drei, and Three.js.
- Live foundation: 50 typed photo entries in `src/content/photoUniverse.ts`.
- Live foundation: drag rotation, pinch or wheel zoom, random reveal, and tap-to-reveal photo details.
- Next: replace placeholder paths with real compressed images in `public/photoUniverse/`.
- Next: tune per-photo copy and optional groupings once the real photo set is known.

## Phase 4: Quote Puzzles
- Add Complete-the-Quote puzzles as the main unlock mechanic.
- Store progress in localStorage.
- Correct answers unlock hidden memories and stories.

## Phase 5: Finale
- Add a closing birthday wish and recap of unlocked memories.
- Keep the finale emotional, personal, and light enough for mobile.
