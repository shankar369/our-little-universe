# Heart Locker Photos — per-act asset drop

Drop the real photos for each Heart Locker act here. **No path lists to edit** — every
image in a folder is auto-discovered at build time (Vite glob in
`src/content/heartLockerGallery.ts`).

## Folders → acts

| Folder | Act | Effect |
|--------|-----|--------|
| `photo-stack/` | Act I — "you don't understand how much I like these photos" | Photos rise from below on scroll and land on a compressing deck |
| `photo-strip/` | Act II — the long way home | A scroll-pinned horizontal filmstrip glides past with parallax |

## How to add photos

1. Drop compressed images into a folder: `01.jpg`, `02.jpg`, … Supported:
   `jpg`, `jpeg`, `png`, `webp`, `avif`.
2. That's it. They appear in filename order — prefix `01_`, `02_` to control sequence.
3. Scroll length adapts automatically to the number of photos.

## Notes

- While a folder is empty, the three hero test photos are cycled (TEMP fallback in
  `heartLockerGallery.ts`) so the choreography can be previewed.
- 5–8 photos per act is the sweet spot; each stacked photo costs one screen of scroll.
- Compress before committing — these ship in the bundle.
