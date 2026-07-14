# Photo Universe Photos — sphere asset drop

Drop the real photos for the 3D photo sphere here. **No path list to edit** —
every image in this folder is auto-discovered at build time (Vite glob in
`src/content/photoUniverse.ts`) and turned into a planet.

## How to add photos

1. Drop compressed images directly into this folder (no subfolders): any
   filename works. Supported: `jpg`, `jpeg`, `png`, `webp`, `avif`.
2. That's it. Photos appear on the sphere, sorted by filename — prefix with
   `01_`, `02_` if you care about orbit order.

## Notes

- Compress before committing — these ship in the bundle. Long edge ~1600px is
  plenty for a globe thumbnail; full-resolution phone photos (4000px+) will
  still work but slow the first paint.
- HEIC (iPhone) photos are not readable by browsers — convert to `jpg`/`webp`
  before dropping them in.
- Textures load through a small concurrency-limited queue
  (`src/shared/lib/textureLoadQueue.ts`) instead of all firing at once, so a
  full sphere of photos stays smooth on mount.
- An empty folder degrades gracefully to the shared hero test photos so the
  sphere stays walkable before real photos land.
