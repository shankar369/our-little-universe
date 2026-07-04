import type { MuseumContent } from './types'

/**
 * Copy for the mUSeum — the first-person gallery of us. Photos are
 * auto-discovered from `src/content/museumPhotos/` (see museumGallery.ts).
 */
export const museumContent: MuseumContent = {
  eyebrow: 'a private gallery',
  title: 'mUSeum',
  intro: 'A museum with one subject: us. Every wall, every frame, every light.',
  question: 'Only members may enter. Whisper the word.',
  // ← change this answer to your own secret word.
  answer: 'forever',
  hint: 'how long the membership lasts.',
  wrongMessage: 'The doors stay closed — but they liked the attempt.',
  enterCta: 'Knock on the doors',
  dedication: 'curated with love, for Navya',
}
