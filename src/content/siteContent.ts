import type { SiteContent } from './types'

export const siteContent = {
  appTitle: 'Our Little Universe',
  ambientWords: ['always', 'us', 'stay', 'home', 'N \u2665 S'],
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
    note: 'Every door in here leads back to us.',
  },
  floatingPhotos: [
    {
      id: 'first-spark',
      title: 'First Spark',
      caption: 'The beginning of all this magic',
      gradient: 'from-[#e9c8fc] via-[#fbd3e3] to-[#f8e3bd]',
      rotate: '-8deg',
    },
    {
      id: 'favorite-chaos',
      title: 'Favorite Chaos',
      caption: 'Laughs that became evidence',
      gradient: 'from-[#d4c2fc] via-[#ecd5fc] to-[#fbd3e3]',
      rotate: '7deg',
    },
    {
      id: 'birthday-wish',
      title: 'Birthday Wish',
      caption: 'One more orbit around joy',
      gradient: 'from-[#c4b8f8] via-[#e9c8fc] to-[#fbd9d3]',
      rotate: '-3deg',
    },
  ],
} satisfies SiteContent
