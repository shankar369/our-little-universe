export type ExperienceSectionStatus = 'live' | 'planned'

export type ExperienceSection = {
  id: string
  label: string
  status: ExperienceSectionStatus
  path: string
  description: string
}

export const experienceSections: ExperienceSection[] = [
  {
    id: 'opening',
    label: 'Opening',
    status: 'live',
    path: '/',
    description: 'The login gate and cinematic birthday hero.',
  },
  {
    id: 'journey',
    label: 'Journey Hub',
    status: 'live',
    path: '/journey',
    description: 'A glass hub for choosing the next memory section.',
  },
  {
    id: 'memory-timeline',
    label: 'Memory Timeline',
    status: 'live',
    path: '/memory-timeline',
    description: 'Chronological tap-to-reveal memory cards.',
  },
  {
    id: 'photo-universe',
    label: 'Photo Universe',
    status: 'live',
    path: '/photo-universe',
    description: 'A mobile-friendly 3D globe of tappable photo memories.',
  },
  {
    id: 'quote-puzzles',
    label: 'Quote Puzzles',
    status: 'planned',
    path: '/journey',
    description: 'Complete-the-quote games that unlock hidden stories.',
  },
]
