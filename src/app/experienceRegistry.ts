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
    description: 'Swipe a stack of forever moments, one polaroid at a time.',
  },
  {
    id: 'photo-universe',
    label: 'Photo Universe',
    status: 'live',
    path: '/photo-universe',
    description: 'Wander a galaxy of tiny photo planets and tap one open.',
  },
  {
    id: 'quote-puzzles',
    label: 'Quote Puzzles',
    status: 'planned',
    path: '/journey',
    description: 'Complete-the-quote games that unlock hidden stories.',
  },
]
