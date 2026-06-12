export type FloatingPhotoCard = {
  id: string
  title: string
  caption: string
  gradient: string
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

export type SiteContent = {
  appTitle: string
  /** Short serif fragments that drift in the ambient background. Keep them tiny and personal. */
  ambientWords: string[]
  login: LoginContent
  hero: HeroContent
  floatingPhotos: FloatingPhotoCard[]
}
