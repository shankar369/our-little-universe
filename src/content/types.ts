export type FloatingPhotoCard = {
  id: string
  title: string
  caption: string
  gradient: string
  photo?: string
  showText?: boolean
  rotate: `${number}deg`
}

export type LoginContent = {
  question: string
  answer: string
  hint: string
  wrongMessages: string[]
  successMessage: string
}

export type HeroContent = {
  eyebrow: string
  headline: string
  subtitle: string
  body: string
  cta: string
  note: string
}

export type HeartLockerContent = {
  eyebrow: string
  title: string
  /** The secret question shown in the unlock prompt. */
  question: string
  /** The answer (compared case-insensitively, trimmed). Change this to your own. */
  answer: string
  hint: string
  intro: string
  wrongMessage: string
}

export type MuseumContent = {
  eyebrow: string
  /** Display title — the US is the point: "mUSeum". */
  title: string
  /** One-line invitation on the hub card / entrance. */
  intro: string
  /** The secret question shown at the museum doors. */
  question: string
  /** The answer (compared case-insensitively, trimmed). Change to your own. */
  answer: string
  hint: string
  wrongMessage: string
  /** Label on the entrance button, e.g. "knock on the doors". */
  enterCta: string
  /** Etched dedication shown on the far wall inside. */
  dedication: string
}

export type MemoryTimelineItem = {
  id: string
  order: number
  title: string
  dateLabel: string
  photo: string
  quote: string
  story: string
  alt?: string
}

export type RevealPhotoItem = {
  id: string
  photo: string
  heading: string
  name: string
  text: string
  label?: string
  quote?: string
  story?: string
  alt?: string
}

export type PhotoUniverseItem = RevealPhotoItem & {
  order: number
  orbitBand: 'inner' | 'middle' | 'outer'
}

/**
 * A single place pinned on the Our Little Atlas map.
 * Photos are auto-discovered from `src/content/journeyPhotos/<folder>/` at build
 * time, so authors only drop images into a folder — no path lists to maintain.
 */
export type JourneyPlace = {
  id: string
  /** Display name of the place, e.g. "Goa". */
  name: string
  /** Romantic one-line caption shown under the name. */
  note: string
  /** Small region/state label, e.g. "by the Arabian Sea". */
  region?: string
  /** Latitude in decimal degrees. */
  lat: number
  /** Longitude in decimal degrees. */
  lng: number
  /** Folder name under `src/content/journeyPhotos/<folder>/`. */
  folder: string
  /** Optional date or season label, e.g. "Dec 2024". */
  dateLabel?: string
}

export type SiteContent = {
  appTitle: string
  login: LoginContent
  hero: HeroContent
  heartLocker: HeartLockerContent
  floatingPhotos: FloatingPhotoCard[]
}
