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
    eyebrow: 'Tonight, the universe glows for you',
    headline: 'Happy birthday,',
    headlineAccent: 'my Navya',
    quote:
      'Of every star in every sky, the softest, brightest one is you — so tonight this whole little universe stays up late, just to celebrate the day you happened.',
    scrollCue: 'scroll gently…',
    story: {
      eyebrow: 'the story of you',
      verses: [
        {
          id: 'born',
          folder: 'group1',
          choreography: 'bloom',
          lead: 'once upon a quiet night,',
          accent: 'you were born',
          whisper: 'and somewhere far above, the sky noticed one little star had gone missing',
        },
        {
          id: 'princess',
          folder: 'group2',
          choreography: 'fan',
          lead: 'then, year by golden year, you',
          accent: 'became a princess',
          whisper: 'no crown required — grace already knew your name',
        },
        {
          id: 'mine',
          folder: 'group3',
          choreography: 'meet',
          lead: 'and every road you ever walked was quietly leading here,',
          accent: 'to be mine',
          whisper: 'the universe’s favorite plot twist',
        },
      ],
      outro: 'and now… the part with fire and frosting',
    },
    cake: {
      eyebrow: 'the most important part',
      whisper: 'make a wish… then blow the candles out',
      granted: 'it’s yours now — happy birthday, Navya ♥',
      relight: 'one more wish? the candles don’t mind',
      name: 'Navya',
      cta: 'Let’s start the journey',
      note: 'every door in here leads back to us',
      blowHint: 'blow the candles',
    },
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
} satisfies SiteContent
