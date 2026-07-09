# The Book — page drop folder

Drop the album photos here. `src/content/bookGallery.ts` discovers them at
build time — no path lists to maintain.

- **Order**: name-sorted. Use `01.jpg`, `02.jpg`, ... to control reading order.
- **Faces**: image 1 is the first right-hand page, image 2 lands on the back of
  that sheet (the next left-hand page), and so on. Every sheet has two sides.
- **Spreads**: a filename containing `spread` (e.g. `07-spread-goa.jpg`) is
  split across two facing pages — great for wide panoramas. Alignment padding
  is automatic.
- **Orientation**: the pages are landscape (3:2). Landscape photos fill best;
  portrait photos are mounted centered on the black paper.
- **Limit**: the first 40 faces are bound; compress images before adding.

While this folder is empty, the hero test photos are cycled as placeholders.
