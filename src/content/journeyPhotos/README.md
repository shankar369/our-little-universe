# Journey Photos — Our Little Atlas asset drop

Drop the real photos for each map place here. **No path lists to edit** — every
image in a folder is auto-discovered at build time (Vite glob in
`src/content/ourLittleAtlas.ts`) and shown in that place's photo grid.

## How to add photos

1. Find (or create) the folder that matches a place's `folder` field in
   `src/content/ourLittleAtlas.ts`, e.g. `goa/`.
2. Drop compressed images into it: `01.jpg`, `02.jpg`, `sunset.webp`, … Supported:
   `jpg`, `jpeg`, `png`, `webp`, `avif`.
3. That's it. Photos appear in the marker preview (first few) and the full-screen
   gallery (all of them), sorted by filename — so prefix with `01_`, `02_` to order.

## Notes

- A folder with no photos yet degrades gracefully to a "memories landing here soon"
  state; the place still pins on the map.
- Compress before committing — these ship in the bundle.
- To add a new place: add an entry to `ourLittleAtlasPlaces` with a new `folder`,
  then create the matching folder here.
