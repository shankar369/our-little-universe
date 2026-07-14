import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { siteContent } from '../../content/siteContent'
import { softEase } from '../../design/motion'

/**
 * The hero's birthday moment: one slender candle on a tiny warm-paper cake.
 * Tap the flame to blow it out — a wisp of smoke, a spill of ember-hearts,
 * and the wish line appears. Tap again and the candle politely relights.
 *
 * Reduced motion: no flicker, no particles — the flame simply swaps for the
 * granted line.
 */

type WishPhase = 'lit' | 'wished' | 'relit'

/** Deterministic little burst so re-renders never reshuffle the embers. */
const EMBERS = Array.from({ length: 10 }, (_, index) => {
  const angle = (index / 10) * Math.PI - Math.PI * 0.5
  return {
    id: index,
    x: Math.sin(angle * 1.7 + index) * (26 + (index % 4) * 9),
    y: -34 - (index % 5) * 13,
    scale: 0.6 + ((index * 7) % 10) / 18,
    delay: (index % 6) * 0.045,
    warm: index % 3 === 0,
  }
})

export function BirthdayWish() {
  const reducedMotion = useReducedMotion() ?? false
  const [phase, setPhase] = useState<WishPhase>('lit')
  const [burstKey, setBurstKey] = useState(0)
  const isLit = phase !== 'wished'

  const whisper = useMemo(() => {
    if (phase === 'wished') {
      return siteContent.hero.cake.granted
    }
    if (phase === 'relit') {
      return siteContent.hero.cake.relight
    }
    return siteContent.hero.cake.whisper
  }, [phase])

  function handleTap() {
    if (isLit) {
      setBurstKey((key) => key + 1)
      setPhase('wished')
    } else {
      setPhase('relit')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.15, duration: 0.7, ease: softEase }}
      className="mt-8 flex flex-col items-center gap-1 lg:items-start"
    >
      <button
        type="button"
        onClick={handleTap}
        aria-label={
          isLit ? 'Blow out the candle and make a wish' : 'Light the candle again'
        }
        className="group relative flex h-28 w-24 items-end justify-center rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
      >
        {/* Warm pool of light while the flame is alive */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1 h-20 w-20 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,217,166,0.4),rgba(247,184,212,0.12)_55%,transparent_75%)] blur-md"
          animate={{ opacity: isLit ? 1 : 0 }}
          transition={{ duration: 0.6, ease: softEase }}
        />

        {/* The flame */}
        <span className="pointer-events-none absolute bottom-[4.65rem] left-1/2 -translate-x-1/2">
          <AnimatePresence mode="popLayout">
            {isLit ? (
              <motion.span
                key={`flame-${phase}`}
                initial={{ opacity: 0, scale: 0.4, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.25, y: -10 }}
                transition={{ duration: 0.4, ease: softEase }}
                className="block"
              >
                <motion.span
                  className="block h-5 w-3 origin-bottom rounded-[50%_50%_50%_50%/62%_62%_38%_38%] bg-gradient-to-t from-champagne via-starlight to-starlight shadow-[0_0_14px_rgba(244,217,166,0.9),0_0_34px_rgba(244,217,166,0.5)]"
                  animate={
                    reducedMotion
                      ? undefined
                      : {
                          scaleY: [1, 1.08, 0.94, 1.05, 1],
                          scaleX: [1, 0.94, 1.05, 0.96, 1],
                          rotate: [0, -2.5, 2, -1.5, 0],
                        }
                  }
                  transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.span>
            ) : (
              // A shy wisp of smoke where the flame stood
              <motion.span
                key="smoke"
                aria-hidden="true"
                initial={{ opacity: 0.55, y: 0, scaleY: 0.4 }}
                animate={{ opacity: 0, y: -26, scaleY: 1.4 }}
                transition={{ duration: reducedMotion ? 0 : 1.6, ease: 'easeOut' }}
                className="block h-7 w-[3px] rounded-full bg-gradient-to-t from-moon/50 to-transparent blur-[2px] motion-reduce:hidden"
              />
            )}
          </AnimatePresence>
        </span>

        {/* Ember-hearts spilling upward as the wish leaves */}
        {!reducedMotion && phase === 'wished' ? (
          <span
            key={burstKey}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[4.6rem] left-1/2 motion-reduce:hidden"
          >
            {EMBERS.map((ember) => (
              <motion.span
                key={ember.id}
                className={`absolute text-[0.6rem] ${ember.warm ? 'text-champagne' : 'text-blush'}`}
                style={{
                  textShadow: ember.warm
                    ? '0 0 8px rgba(244,217,166,0.9)'
                    : '0 0 8px rgba(247,184,212,0.9)',
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: ember.scale * 0.5 }}
                animate={{
                  x: ember.x,
                  y: ember.y,
                  opacity: [0, 1, 0],
                  scale: [ember.scale * 0.5, ember.scale, ember.scale * 0.4],
                }}
                transition={{ duration: 1.35, delay: ember.delay, ease: 'easeOut' }}
              >
                ♥
              </motion.span>
            ))}
          </span>
        ) : null}

        {/* Wick + slender taper candle */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[4.35rem] left-1/2 h-1.5 w-[2px] -translate-x-1/2 rounded-full bg-plum"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-7 left-1/2 h-10 w-2.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-starlight via-blush/75 to-blush/45 shadow-[inset_-1px_0_2px_rgba(43,16,72,0.25)] transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {/* A soft wax drip */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[3.7rem] left-1/2 ml-1 h-2 w-1 rounded-full bg-starlight/80"
        />

        {/* Tiny warm-paper cake with a frosting line */}
        <span
          aria-hidden="true"
          className="polaroid pointer-events-none absolute bottom-2 left-1/2 block h-6 w-16 -translate-x-1/2 overflow-hidden rounded-[0.45rem] !p-0"
        >
          <span className="block h-2 w-full bg-gradient-to-r from-blush/80 via-champagne/70 to-blush/80" />
          <span className="mt-[3px] flex justify-center gap-2">
            <span className="h-1 w-1 rounded-full bg-blush/60" />
            <span className="h-1 w-1 rounded-full bg-orchid/50" />
            <span className="h-1 w-1 rounded-full bg-champagne/70" />
          </span>
        </span>
      </button>

      {/* The whisper — the hero's one script line */}
      <AnimatePresence mode="wait">
        <motion.p
          key={whisper}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.45, ease: softEase }}
          className={`type-script text-center lg:text-left ${
            phase === 'wished' ? 'text-blush' : 'text-moon/85'
          }`}
        >
          {whisper}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  )
}
