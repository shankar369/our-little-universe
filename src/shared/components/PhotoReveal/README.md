# PhotoReveal

## Purpose
PhotoReveal provides the shared framed photo modal used by Memory Timeline, random picks, and Photo Universe. It keeps the premium Polaroid-in-glass presentation consistent while each section owns its own route copy and data.

## Content Contract
The component accepts `RevealPhotoItem` data: `id`, `photo`, `heading`, `name`, `text`, plus optional `label`, `quote`, `story`, and `alt`. Use `quote` for the framed line and `story` for the longer body when those are available.

## Behavior
- Missing images fall back to a designed gradient placeholder.
- `Escape` closes the modal.
- Arrow keys trigger previous and next when handlers are provided.
- The modal uses `role="dialog"` and `aria-modal` for assistive technology.

## Visual Rules
Keep the warm-paper `.polaroid` frame inside one `glass-panel` surface. Quote renders as serif italic inside the frame; story as quiet centered text below a hairline; navigation is circular ghost/primary icon buttons. Avoid placing extra cards inside the modal; mobile-first clarity wins.
