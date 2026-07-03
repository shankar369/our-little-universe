import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { softEase } from '../../design/motion'
import { useRichMotion } from '../../shared/lib/richMotion'

// Deterministic "hand-piled" variety per card.
const tilts = [-4.5, 4, -3, 5.5, -6, 2.5, -4, 5]
const driftX = [0.4, -0.9, 0.8, -0.5, 0, -1, 0.7, -0.3]

type StackedActProps = {
  photos: string[]
}

/**
 * Act I — a scroll-pinned photo deck. Each photo rises from below the fold and
 * lands on top of the pile; the cards beneath compress, peek upward and dim,
 * so the stack reads with real depth. Cards never fade over content — they are
 * opaque from the moment they enter (classic sticky-stacking-cards pattern).
 */
export function StackedAct({ photos }: StackedActProps) {
  const containerRef = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()
  const { rich } = useRichMotion()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const count = photos.length
  const unit = 1 / (count + 1.7)

  if (reduceMotion) {
    return (
      <section className="relative px-6 py-20">
        <ActTitle />
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">
          {photos.map((src, index) => (
            <Polaroid key={`${src}-${index}`} src={src} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${(count + 1.7) * 100}svh` }}
      aria-label="A stack of favourite photos"
    >
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden">
        {/* Soft bed of light the pile grows on (the ember atmosphere covers
            this when rich motion is available) */}
        {rich ? null : (
          <div className="pointer-events-none absolute h-[58vmin] w-[58vmin] rounded-full bg-orchid/12 blur-3xl" />
        )}

        <StackTitle progress={scrollYProgress} unit={unit} />

        {photos.map((src, index) => (
          <DeckPhoto
            key={`${src}-${index}`}
            src={src}
            index={index}
            count={count}
            unit={unit}
            progress={scrollYProgress}
          />
        ))}

        <Whisper progress={scrollYProgress} />
      </div>
    </section>
  )
}

function ActTitle() {
  return (
    <div className="night-veil px-2 text-center">
      <p className="type-eyebrow mb-4 text-champagne/85">act one · the evidence</p>
      <h2 className="text-glow text-balance font-display text-[clamp(2rem,7.5vw,3.4rem)] font-medium leading-[1.06]">
        you don&rsquo;t understand
        <span className="type-quote text-aurora block pb-1">
          how much I like these photos.
        </span>
      </h2>
    </div>
  )
}

function StackTitle({
  progress,
  unit,
}: {
  progress: MotionValue<number>
  unit: number
}) {
  // Fully gone before the first card crosses the fold. (Function-form fade:
  // keeps it JS-driven, dodging Motion's native ScrollTimeline promotion,
  // which mis-maps ranges on these svh sticky sections.)
  const fade = useTransform(progress, [unit * 0.45, unit * 0.9], [1, 0])
  const opacity = useTransform(() => fade.get())
  const scale = useTransform(progress, [unit * 0.45, unit * 0.9], [1, 0.93])
  const y = useTransform(progress, [unit * 0.45, unit * 0.9], [0, -44])

  return (
    <motion.div style={{ opacity, scale, y }} className="absolute z-[1] px-6">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: softEase }}
      >
        <ActTitle />
        <p className="type-quote mt-6 text-center text-sm text-moon/70 motion-reduce:hidden">
          keep scrolling &middot; slowly
        </p>
      </motion.div>
    </motion.div>
  )
}

function DeckPhoto({
  src,
  index,
  count,
  unit,
  progress,
}: {
  src: string
  index: number
  count: number
  unit: number
  progress: MotionValue<number>
}) {
  const enter = unit * (index + 1.05)
  const land = unit * (index + 1.8)
  const overshoot = enter + (land - enter) * 0.8
  const depthEnd = unit * (count + 1.05)
  const tilt = tilts[index % tilts.length]

  // Rise from below the fold, overshoot a touch, settle on the pile.
  const landY = useTransform(progress, [enter, overshoot, land], [112, -2.2, 0])
  const landScale = useTransform(progress, [enter, land], [1.06, 1])
  const rotate = useTransform(progress, [enter, land], [tilt * 2.4, tilt])

  // As later cards land, this one is pressed into the deck: it shrinks a
  // little, peeks upward, and dims — continuous depth, no opacity tricks.
  const depth = useTransform(
    progress,
    [land, Math.max(depthEnd, land + 0.001)],
    [0, count - 1 - index],
  )

  const y = useTransform(() => `${landY.get() + depth.get() * -1.6}svh`)
  const scale = useTransform(() => landScale.get() * (1 - depth.get() * 0.045))
  const filter = useTransform(
    () => `brightness(${Math.max(1 - depth.get() * 0.085, 0.55)})`,
  )

  return (
    <motion.div
      style={{
        y,
        scale,
        rotate,
        filter,
        x: `${driftX[index % driftX.length]}vw`,
        zIndex: index + 10,
        willChange: 'transform',
      }}
      className="absolute w-[min(70vw,19rem)] sm:w-[23rem]"
    >
      <Polaroid src={src} shadow />
    </motion.div>
  )
}

function Polaroid({ src, shadow = false }: { src: string; shadow?: boolean }) {
  return (
    <div
      className={`polaroid rounded-[1rem] p-2 pb-6 ${
        shadow ? 'shadow-[0_30px_80px_rgba(2,0,10,0.65)]' : ''
      }`}
    >
      <div className="aspect-[4/5] overflow-hidden rounded-[0.6rem]">
        <img
          src={src}
          alt="a memory of us"
          className="h-full w-full object-cover"
          draggable={false}
          decoding="async"
        />
      </div>
    </div>
  )
}

function Whisper({ progress }: { progress: MotionValue<number> }) {
  const fade = useTransform(progress, [0.96, 1], [0, 1])
  const opacity = useTransform(() => fade.get())
  const y = useTransform(progress, [0.96, 1], [14, 0])

  return (
    <motion.p
      style={{ opacity, y }}
      className="type-script night-veil absolute bottom-[5%] z-40 text-moon"
    >
      &hellip;see?
    </motion.p>
  )
}
