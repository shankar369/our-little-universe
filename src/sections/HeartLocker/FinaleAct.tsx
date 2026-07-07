import { useRef } from 'react'
import { Heart } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { VelvetScriptFinale } from './finaleVariants/VelvetScriptFinale'

/**
 * The signature finale. All lettering is performed by the Velvet Script
 * particle scene (tiny hearts in Parisienne script — chosen from the
 * finale-lab audition, see finaleVariants/); the DOM only contributes the
 * whispered bookends. Timeline: hearts gather → "Navya" → ash blows the
 * other letters away → the N flips, turns, and settles as an S (through its
 * own flip∘turn, no letterform swap) → every heart returns as "Navya's
 * Sankar".
 */
export function FinaleAct() {
  const containerRef = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress: P } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Function-form fades: keeps opacity JS-driven, dodging Motion's native
  // ScrollTimeline promotion, which mis-maps ranges on svh sticky sections.
  const fromFade = useTransform(P, [0.02, 0.07, 0.15, 0.2], [0, 1, 1, 0])
  const fromOpacity = useTransform(() => fromFade.get())
  const fromY = useTransform(P, [0.02, 0.07, 0.15, 0.2], [26, 0, 0, -30])
  const eyebrowFade = useTransform(P, [0.9, 0.96], [0, 1])
  const eyebrowOpacity = useTransform(() => eyebrowFade.get())
  const heartsFade = useTransform(P, [0.93, 0.99], [0, 1])
  const heartsOpacity = useTransform(() => heartsFade.get())
  const heartsY = useTransform(P, [0.93, 0.99], [12, 0])

  if (reduceMotion) {
    return (
      <section className="relative flex min-h-svh flex-col items-center justify-center px-6 text-center">
        <p className="type-script mb-4 text-champagne/85">happy birthday, love — from</p>
        <p className="text-aurora font-display text-[clamp(2.4rem,9vw,5rem)] font-semibold leading-none">
          Navya&rsquo;s Sankar
        </p>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: '900svh' }}
      aria-label="Happy birthday, from Navya's Sankar"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* The signature stage */}
        <div className="pointer-events-none absolute inset-0">
          <VelvetScriptFinale progress={P} />
        </div>

        {/* Opening whisper */}
        <motion.div
          style={{ opacity: fromOpacity, y: fromY }}
          className="night-veil pointer-events-none absolute inset-x-0 top-[20%] z-10 px-6 text-center"
        >
          <p className="type-eyebrow mb-3 text-champagne/85">one last thing</p>
          <h2 className="text-glow font-display text-[clamp(1.9rem,7vw,3.2rem)] font-medium leading-tight">
            Happy Birthday, from
          </h2>
        </motion.div>

        {/* Closing whisper, above and below the ember signature */}
        <motion.p
          style={{ opacity: eyebrowOpacity }}
          className="type-script text-glow pointer-events-none absolute inset-x-0 top-[28%] z-10 text-center text-champagne/85"
        >
          happy birthday, love — from
        </motion.p>
        <motion.div
          style={{ opacity: heartsOpacity, y: heartsY }}
          className="pointer-events-none absolute inset-x-0 bottom-[26%] z-10 flex items-center justify-center gap-2 text-blush"
        >
          <Heart className="h-4 w-4 fill-current" />
          <span className="type-quote text-sm text-moon/85">always.</span>
          <Heart className="h-4 w-4 fill-current" />
        </motion.div>
      </div>
    </section>
  )
}
