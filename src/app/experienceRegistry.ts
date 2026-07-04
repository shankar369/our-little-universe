import {
  Heart,
  Home,
  Images,
  Landmark,
  LockKeyhole,
  Map,
  MapPin,
  Orbit,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type ExperienceSectionStatus = 'live' | 'planned'

export type ExperienceSection = {
  id: string
  label: string
  status: ExperienceSectionStatus
  path: string
  description: string
  /** Canonical chapter icon — used by nav, hub cards, and the chapter curtain. */
  icon: LucideIcon
}

export const experienceSections: ExperienceSection[] = [
  {
    id: 'opening',
    label: 'Opening',
    status: 'live',
    path: '/',
    description: 'The login gate and cinematic birthday hero.',
    icon: Home,
  },
  {
    id: 'journey',
    label: 'Journey Hub',
    status: 'live',
    path: '/journey',
    description: 'A glass hub for choosing the next memory section.',
    icon: Map,
  },
  {
    id: 'memory-timeline',
    label: 'Memory Timeline',
    status: 'live',
    path: '/memory-timeline',
    description: 'Swipe a stack of forever moments, one polaroid at a time.',
    icon: Images,
  },
  {
    id: 'photo-universe',
    label: 'Photo Universe',
    status: 'live',
    path: '/photo-universe',
    description: 'Wander a galaxy of tiny photo planets and tap one open.',
    icon: Orbit,
  },
  {
    id: 'our-little-atlas',
    label: 'Our Little Atlas',
    status: 'live',
    path: '/our-little-atlas',
    description: 'A living map of every place that became part of us.',
    icon: MapPin,
  },
  {
    id: 'museum',
    label: 'mUSeum',
    status: 'live',
    path: '/museum',
    description: 'Walk a private gallery where every exhibit is us.',
    icon: Landmark,
  },
  {
    id: 'heart-locker',
    label: 'Heart Locker',
    status: 'live',
    path: '/heart-locker',
    description: 'A hidden little vault, opened only by a secret.',
    icon: LockKeyhole,
  },
  {
    id: 'quote-puzzles',
    label: 'Quote Puzzles',
    status: 'planned',
    path: '/journey',
    description: 'Complete-the-quote games that unlock hidden stories.',
    icon: Heart,
  },
]
