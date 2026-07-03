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
    note: 'Every door in here leads back to us.',
  },
  heartLocker: {
    eyebrow: 'a little secret',
    title: 'Heart Locker',
    question: 'Whisper our little password to come inside.',
    // ← change this answer to your own secret word.
    answer: 'hello123',
    hint: 'a simple hello, and a few numbers.',
    intro: 'A hidden drawer for the things too precious to leave lying in the open.',
    wrongMessage: 'Not quite — the locker stays shut, smiling to itself.',
  },
  floatingPhotos: [
    {
      id: 'first-spark',
      title: 'First Spark',
      caption: 'The beginning of all this magic',
      photo: '/hero/first-spark.jpg',
      gradient: 'from-[#e9c8fc] via-[#fbd3e3] to-[#f8e3bd]',
      showText: false,
      rotate: '-8deg',
    },
    {
      id: 'favorite-chaos',
      title: 'Favorite Chaos',
      caption: 'Laughs that became evidence',
      photo: '/hero/favorite-chaos.jpg',
      gradient: 'from-[#d4c2fc] via-[#ecd5fc] to-[#fbd3e3]',
      showText: false,
      rotate: '7deg',
    },
    {
      id: 'birthday-wish',
      title: 'Birthday Wish',
      caption: 'One more orbit around joy',
      photo: '/hero/birthday-wish.jpg',
      gradient: 'from-[#c4b8f8] via-[#e9c8fc] to-[#fbd9d3]',
      showText: true,
      rotate: '-3deg',
    },
  ],
} satisfies SiteContent
