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

export type SiteContent = {
  appTitle: string
  login: LoginContent
  hero: HeroContent
  floatingPhotos: FloatingPhotoCard[]
}
