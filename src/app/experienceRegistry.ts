export type ExperienceSectionStatus = 'live' | 'planned'

export type ExperienceSection = {
  id: string
  label: string
  status: ExperienceSectionStatus
  description: string
}

export const experienceSections: ExperienceSection[] = [
  {
    id: 'opening',
    label: 'Opening',
    status: 'live',
    description: 'The login gate and cinematic birthday hero.',
  },
  {
    id: 'timeline',
    label: 'Memory Timeline',
    status: 'planned',
    description: 'Chronological tap-to-reveal memory cards.',
  },
  {
    id: 'photo-universe',
    label: 'Photo Universe',
    status: 'planned',
    description: 'A mobile-friendly 3D globe or orbit of photos.',
  },
  {
    id: 'quote-puzzles',
    label: 'Quote Puzzles',
    status: 'planned',
    description: 'Complete-the-quote games that unlock hidden stories.',
  },
]
