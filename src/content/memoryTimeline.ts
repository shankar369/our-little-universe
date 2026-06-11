import type { MemoryTimelineItem } from './types'

export const memoryTimelineItems = [
  {
    id: 'first-little-spark',
    order: 1,
    title: 'First Little Spark',
    dateLabel: 'Memory 01',
    photo: '/memoryTimeline/memory-01.jpg',
    quote: 'Some moments arrive quietly and still change the whole sky.',
    story:
      'This is a placeholder for the first memory. Replace the photo and words when the real story is ready, and the timeline will keep the same order and layout.',
    alt: 'A placeholder for the first little spark memory',
  },
  {
    id: 'laughing-proof',
    order: 2,
    title: 'Laughing Proof',
    dateLabel: 'Memory 02',
    photo: '/memoryTimeline/memory-02.jpg',
    quote: 'The best kind of chaos is the one we keep choosing.',
    story:
      'A small card for a funny, silly, impossible-to-explain memory. This space is meant for the line that only the two of you would understand.',
    alt: 'A placeholder for a funny shared memory',
  },
  {
    id: 'soft-place',
    order: 3,
    title: 'Soft Place',
    dateLabel: 'Memory 03',
    photo: '/memoryTimeline/memory-03.jpg',
    quote: 'Every universe needs one soft place to land.',
    story:
      'Use this memory for something tender: a quiet day, a comfort moment, a tiny detail that became important without asking permission.',
    alt: 'A placeholder for a soft romantic memory',
  },
  {
    id: 'birthday-orbit',
    order: 4,
    title: 'Birthday Orbit',
    dateLabel: 'Memory 04',
    photo: '/memoryTimeline/memory-04.jpg',
    quote: 'Another year, another orbit, the same little magic.',
    story:
      'A birthday-flavored memory for celebration, gratitude, and all the tiny reasons this gift exists in the first place.',
    alt: 'A placeholder for a birthday memory',
  },
] satisfies MemoryTimelineItem[]

export const orderedMemoryTimelineItems = [...memoryTimelineItems].sort(
  (first, second) => first.order - second.order,
)
