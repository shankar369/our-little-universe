/**
 * One verse of the opening "story of you" scroll act — a line of the poem
 * plus the photo drop folder that performs beneath it.
 */
export type StoryVerse = {
  id: string
  /** Folder under `src/content/openingPhotos/` this verse draws photos from. */
  folder: string
  /**
   * How the verse's photos enter the stage: `bloom` (out of a star-point),
   * `fan` (spread open like a tiara), `meet` (arrive from opposite edges
   * and lean into each other).
   */
  choreography: 'bloom' | 'fan' | 'meet'
  /** Plain display-face opening of the line, e.g. "once upon a quiet night,". */
  lead: string
  /** The aurora italic payoff phrase, e.g. "you were born". */
  accent: string
  /** Small serif whisper that settles under the line. */
  whisper: string
}

export type LoginContent = {
  question: string
  answer: string
  hint: string
  wrongMessages: string[]
  successMessage: string
}

/**
 * Copy for the three-act opening overture at `/`:
 * act 1 (the wish quote) → act 2 (drifting memories) → act 3 (the cake).
 */
export type HeroContent = {
  /** Tiny uppercase line above the birthday headline. */
  eyebrow: string
  /** Plain first line of the headline, e.g. "Happy birthday,". */
  headline: string
  /** The aurora italic line that completes the headline — her name. */
  headlineAccent: string
  /** The birthday wish quote — the emotional beat of the first viewport. */
  quote: string
  /** Script whisper inviting the scroll at the bottom of act 1. */
  scrollCue: string
  story: {
    /** Eyebrow pinned over the story scroll act, e.g. "the story of you". */
    eyebrow: string
    /** The three verses: born → princess → mine. */
    verses: StoryVerse[]
    /** Closing script line that bridges the story into the cake act. */
    outro: string
  }
  cake: {
    /** Eyebrow over the cake stage. */
    eyebrow: string
    /** Script line asking for the wish, e.g. "make a wish…". */
    whisper: string
    /** Script line revealed once the candles are out. */
    granted: string
    /** Whisper when the candles are tapped again and relight. */
    relight: string
    /** Name piped onto the cake's warm-paper tag. */
    name: string
    /** Label of the journey button revealed after the wish. */
    cta: string
    /** Small line under the CTA once the wish is made. */
    note: string
    /** Label of the accessible fallback control for blowing the candles. */
    blowHint: string
  }
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

export type BookContent = {
  eyebrow: string
  /** Chapter title shown in the overlay, e.g. "The Book". */
  title: string
  /** One-line invitation under the title. */
  intro: string
  /** Embossed title on the black front cover. */
  coverTitle: string
  /** Small script line under the cover title, e.g. "N ♥ S". */
  coverSubtitle: string
  /** Script dedication on the outside of the back cover. */
  dedication: string
  /** Whisper hint shown until the first page turn. */
  hint: string
  /** Bottom label once every page has been turned. */
  endNote: string
}

/**
 * One printable face of the book. Photos are auto-discovered from
 * `src/content/bookPages/` (see bookGallery.ts). A face is either black
 * paper, a mounted photo, or one half of a two-page spread.
 */
export type BookFace =
  | { kind: 'blank' }
  | { kind: 'photo'; src: string; half?: 'left' | 'right' }

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
}
