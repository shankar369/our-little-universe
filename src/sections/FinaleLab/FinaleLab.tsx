import { useRef } from 'react'
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { ChevronDown, Sparkles } from 'lucide-react'
import { softEase } from '../../design/motion'
import { useRichMotion } from '../../shared/lib/richMotion'
import {
  finaleVariants,
  type FinaleVariantMeta,
} from '../HeartLocker/finaleVariants'

/**
 * The Finale Lab — a private screening room at /finale-lab (not in the hub).
 * Five candidate signatures, each in its own SCROLL cinema exactly like the
 * real finale: a tall sticky section whose progress is your scroll position.
 * Scroll slowly through all five, scrub back and forth freely, then pick.
 */

/** Each audition chapter's height (production finale is 900svh). */
const CHAPTER_SVH = 560

export function FinaleLab() {
  const reduceMotion = useReducedMotion()
  const { rich, compact } = useRichMotion()

  if (reduceMotion || !rich) {
    return (
      <main className="flex min-h-svh items-center justify-center px-6 text-center text-starlight">
        <p className="type-quote night-veil max-w-md text-moon">
          The screening room needs motion and WebGL — these are scroll-driven
          particle studies. Visit from a device with motion enabled.
        </p>
      </main>
    )
  }

  return (
    <main className="relative text-starlight">
      <IntroSection />
      {finaleVariants.map((variant) => (
        <VariantChapter
          key={variant.id}
          variant={variant}
          density={compact ? 0.55 : 0.85}
        />
      ))}
      <OutroSection />
    </main>
  )
}

function IntroSection() {
  return (
    <section className="relative flex h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="night-veil">
        <div className="mb-4 inline-flex items-center gap-2.5 text-champagne/85">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="type-eyebrow">the screening room · pick one</span>
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <h1 className="text-glow font-display text-[clamp(2.2rem,8vw,3.4rem)] font-medium leading-[1.06]">
          the signature,
          <span className="type-quote text-aurora block pb-1">five ways.</span>
        </h1>
        <p className="type-quote mx-auto mt-5 max-w-md text-pretty text-base leading-7 text-moon">
          Five typefaces, five kinds of light — every one performs the same
          flip &middot; turn &middot; melt of the N into the S, driven by your
          scroll. Wander through, scrub back and forth, then tell me the number.
        </p>
      </div>
      <motion.span
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[max(2.25rem,env(safe-area-inset-bottom))] text-champagne/80"
      >
        <ChevronDown className="h-4.5 w-4.5" />
      </motion.span>
    </section>
  )
}

function VariantChapter({
  variant,
  density,
}: {
  variant: FinaleVariantMeta
  density: number
}) {
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  // Mount the canvas a little before the chapter arrives, drop it after.
  const nearView = useInView(ref, { margin: '80% 0px 80% 0px' })
  const Variant = variant.component

  // Function-form: keeps these JS-driven (ScrollTimeline mis-maps on svh
  // sticky sections — same caveat as the production finale).
  const railScale = useTransform(() => scrollYProgress.get())
  const labelFade = useTransform(scrollYProgress, [0, 0.015, 0.96, 1], [0.4, 1, 1, 0.4])
  const labelOpacity = useTransform(() => labelFade.get())

  return (
    <section
      ref={ref}
      style={{ height: `${CHAPTER_SVH}svh` }}
      className="relative"
      aria-label={`Variant ${variant.number}: ${variant.name}`}
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {nearView ? <Variant progress={scrollYProgress} density={density} /> : null}

        {/* Pinned card: which signature is on stage */}
        <motion.div
          style={{ opacity: labelOpacity }}
          className="pointer-events-none absolute inset-x-0 top-[max(1.25rem,env(safe-area-inset-top))] flex justify-center px-6"
        >
          <div className="glass-chip max-w-full rounded-2xl px-4 py-2.5 text-center">
            <p className="type-eyebrow text-champagne/85">
              №{String(variant.number).padStart(2, '0')} · {variant.name}
            </p>
            <p className="mt-1 text-xs text-faint">{variant.fontLabel}</p>
          </div>
        </motion.div>

        {/* Scroll progress rail for this chapter */}
        <div className="pointer-events-none absolute right-[max(0.9rem,env(safe-area-inset-right))] top-1/2 h-36 w-px -translate-y-1/2 bg-white/10">
          <motion.div
            style={{ scaleY: railScale }}
            className="h-full w-full origin-top bg-gradient-to-b from-blush via-orchid to-champagne"
          />
        </div>

        <VibeWhisper progress={scrollYProgress} text={variant.vibe} />
      </div>
    </section>
  )
}

/** The variant's one-line vibe, whispered at the chapter's start. */
function VibeWhisper({
  progress,
  text,
}: {
  progress: import('motion/react').MotionValue<number>
  text: string
}) {
  const fade = useTransform(progress, [0, 0.02, 0.055, 0.08], [0, 1, 1, 0])
  const opacity = useTransform(() => fade.get())

  return (
    <motion.p
      style={{ opacity }}
      className="type-quote night-veil pointer-events-none absolute inset-x-0 bottom-[10%] mx-auto max-w-md px-6 text-center text-sm leading-6 text-moon"
    >
      {text}
    </motion.p>
  )
}

function OutroSection() {
  return (
    <section className="relative flex min-h-[50svh] flex-col items-center justify-center gap-4 px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: softEase }}
        className="type-script night-veil text-glow text-moon"
      >
        which one felt like us? tell me the number.
      </motion.p>
    </section>
  )
}
