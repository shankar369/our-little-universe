# Opening Photos — the Story of You verse drop

Drop the photos for the home page's "story of you" scroll act here. **No path
lists to edit** — every image in a group folder is auto-discovered at build time
(Vite glob in `src/content/openingStory.ts`) and performs in that verse.

## The three verses

| Folder | Verse | Feel |
|--------|-------|------|
| `group1/` | "you were born" | childhood photos — they bloom out of a star-point |
| `group2/` | "became a princess" | growing-up photos — they fan open like a tiara |
| `group3/` | "to be mine" | us photos — they arrive from opposite edges and lean in |

## How to add photos

1. Drop compressed images into a group folder: `01.jpg`, `02.jpg`, … Supported:
   `jpg`, `jpeg`, `png`, `webp`, `avif`.
2. Filenames sort the order inside a verse — prefix `01_`, `02_` to control it.
3. Each verse performs its first **4** photos; extras are ignored, and any count
   from 1 to 4 choreographs cleanly (the layouts adapt to the count).

## Notes

- An empty folder TEMP-falls back to the three hero test photos so the scroll
  choreography can be felt before the real photos land.
- Compress before committing — these ship in the bundle (long edge ~1600px is
  plenty).
