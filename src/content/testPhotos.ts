/**
 * TEMPORARY test photos.
 *
 * Reuses the three home-page hero images everywhere real photos aren't in place yet
 * (Photo Universe planets, Our Little Atlas places), so the gallery, sphere, and reveal
 * flows can be exercised and deployed before the real photos exist.
 *
 * To retire this: drop real photos into the relevant folders/paths and stop referencing
 * `heroTestPhotos` (the atlas falls back to it only for empty folders; Photo Universe
 * cycles it directly in `photoUniverse.ts`).
 */
export const heroTestPhotos = [
  '/hero/first-spark.jpg',
  '/hero/favorite-chaos.jpg',
  '/hero/birthday-wish.jpg',
]
