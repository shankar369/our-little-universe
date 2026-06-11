import type { SiteContent } from './types'

export const siteContent = {
  appTitle: 'Our Little Universe',
  login: {
    question: 'What is the tiny secret password to our little universe?',
    answer: 'moonlight',
    hint: 'Hint: something soft, glowing, and a little dramatic.',
    wrongMessages: [
      'That was cute, but the universe is pretending it did not hear that.',
      'Almost. The stars are giggling politely.',
      'Nope, but I respect the confidence.',
      'The password fairy says: warmer thoughts, please.',
      'Try again. This gate is romantic, not reasonable.',
    ],
    successMessage: 'Welcome home, birthday star.',
  },
  hero: {
    eyebrow: 'A tiny birthday galaxy',
    headline: 'Our Little Universe',
    subtitle: 'A soft, sparkly place for the memories that kept choosing us.',
    body: 'Built like a secret scrapbook: a little dramatic, very purple, full of photos, puzzles, and moments waiting to be unlocked.',
    cta: 'Begin the journey',
    note: 'Phase 1 is the doorway. The memory timeline, photo globe, and puzzles come next.',
  },
  floatingPhotos: [
    {
      id: 'first-spark',
      title: 'First Spark',
      caption: 'The beginning of all this magic',
      gradient: 'from-fuchsia-300 via-rose-200 to-amber-100',
      rotate: '-8deg',
    },
    {
      id: 'favorite-chaos',
      title: 'Favorite Chaos',
      caption: 'Laughs that became evidence',
      gradient: 'from-violet-300 via-purple-200 to-pink-100',
      rotate: '7deg',
    },
    {
      id: 'birthday-wish',
      title: 'Birthday Wish',
      caption: 'One more orbit around joy',
      gradient: 'from-indigo-300 via-fuchsia-200 to-rose-100',
      rotate: '-3deg',
    },
  ],
} satisfies SiteContent
