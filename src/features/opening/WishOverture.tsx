import { ChevronDown, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { siteContent } from '../../content/siteContent'
import { softEase } from '../../design/motion'

/**
 * Act 1 of the opening overture: the birthday wish, alone on the night sky.
 * The plain line rises word by word out of a blur, then her name cascades in
 * letter by letter as the screen's single aurora moment, and the quote
 * settles underneath. A script scroll cue waits at the bottom.
 */

export function WishOverture() {
  const hero = siteContent.hero
  const words = hero.headline.split(' ')
  const letters = [...hero.headlineAccent]

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center px-6 py-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="night-veil max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: softEase }}
          className="mb-7 inline-flex items-center gap-2.5 text-champagne/85"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="type-eyebrow">{hero.eyebrow}</span>
          <Sparkles className="h-3.5 w-3.5" />
        </motion.div>

        <h1 className="text-glow text-balance font-medium leading-[1.02]">
          <span className="block text-[clamp(2.5rem,10vw,4.6rem)]">
            {words.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                className="mr-[0.24em] inline-block"
                initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.45 + index * 0.16, duration: 0.9, ease: softEase }}
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="type-quote block pb-2 pt-1 text-[clamp(2.9rem,12vw,5.4rem)]">
            {letters.map((letter, index) => (
              <motion.span
                key={`letter-${index}`}
                // The padding keeps the gradient box tall enough for the
                // italic descenders (background-clip:text paints nothing
                // outside the box, so a tight box beheads the "y").
                className="text-aurora -mb-[0.22em] inline-block pb-[0.22em]"
                initial={{ opacity: 0, y: 26, rotate: 6, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, rotate: 0, filter: 'blur(0px)' }}
                transition={{ delay: 1.05 + index * 0.055, duration: 0.75, ease: softEase }}
              >
                {letter === ' ' ? ' ' : letter}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.75, duration: 0.85, ease: softEase }}
          className="type-quote mx-auto mt-7 max-w-xl text-pretty text-lg leading-8 text-moon lg:text-xl lg:leading-9"
        >
          {hero.quote}
        </motion.p>
      </div>

      {/* The invitation to drift downward */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.9, ease: softEase }}
        className="absolute inset-x-0 bottom-[max(2.25rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-1.5"
      >
        <p className="type-script text-glow text-moon/85">{hero.scrollCue}</p>
        <motion.span
          aria-hidden="true"
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="motion-reduce:hidden"
        >
          <ChevronDown className="h-4 w-4 text-faint" />
        </motion.span>
      </motion.div>
    </section>
  )
}
