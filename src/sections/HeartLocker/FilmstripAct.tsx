import { useEffect, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { softEase } from '../../design/motion'

const tilts = [-3.5, 2.5, -2, 4, -4.5, 2, -3, 3.5]
const bobs = [-3.5, 2.5, -1.5, 3, -2.5, 1.5, -3, 2]

type FilmstripActProps = {
  photos: string[]
}

/**
 * Act II — a scroll-pinned horizontal filmstrip. Vertical scroll drives the
 * whole strip of polaroids across the screen while each photo parallaxes
 * gently inside its frame — the classic pinned horizontal-gallery pattern.
 * Cards are opaque edge-to-edge; nothing ever fades over text.
 */
export function FilmstripAct({ photos }: FilmstripActProps) {
  const containerRef = useRef<HTMLElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Measured travel: from fully offscreen right to the last card near centre.
  const startX = useMotionValue(0)
  const endX = useMotionValue(0)

  useEffect(() => {
    function measure() {
      const track = trackRef.current
      if (!track || !track.lastElementChild) {
        return
      }
      const viewportWidth = window.innerWidth
      const last = track.lastElementChild as HTMLElement
      startX.set(viewportWidth)
      endX.set(viewportWidth / 2 - (last.offsetLeft + last.offsetWidth / 2))
    }

    measure()
    const settle = window.setTimeout(measure, 350)
    window.addEventListener('resize', measure)
    return () => {
      window.clearTimeout(settle)
      window.removeEventListener('resize', measure)
    }
  }, [startX, endX])

  const travelT = useTransform(scrollYProgress, [0.13, 0.97], [0, 1])
  const trackX = useTransform(
    () => startX.get() + (endX.get() - startX.get()) * travelT.get(),
  )

  const count = photos.length

  if (reduceMotion) {
    return (
      <section className="relative px-6 py-20">
        <FilmstripTitle />
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">
          {photos.map((src, index) => (
            <div key={`${src}-${index}`} className="polaroid rounded-[1rem] p-2">
              <div className="aspect-[4/5] overflow-hidden rounded-[0.6rem]">
                <img
                  src={src}
                  alt="a memory of us"
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${count * 85 + 170}svh` }}
      aria-label="A filmstrip of memories"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* A soft horizon of light the strip glides along */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[46vmin] -translate-y-1/2 bg-[radial-gradient(60%_100%_at_50%_50%,rgba(109,40,217,0.22),transparent_75%)] blur-2xl" />

        <TitleOverlay progress={scrollYProgress} />

        <div className="absolute inset-0 flex items-center">
          <motion.div
            ref={trackRef}
            style={{ x: trackX, willChange: 'transform' }}
            className="flex w-max items-center gap-[7vw] pr-[10vw] sm:gap-20"
          >
            {photos.map((src, index) => (
              <FilmstripCard
                key={`${src}-${index}`}
                src={src}
                index={index}
                travelT={travelT}
              />
            ))}
          </motion.div>
        </div>

        <EndWhisper progress={scrollYProgress} />
      </div>
    </section>
  )
}

function FilmstripTitle() {
  return (
    <div className="night-veil px-2 text-center">
      <p className="type-eyebrow mb-4 text-champagne/85">act two · the long way home</p>
      <h2 className="text-glow text-balance font-display text-[clamp(2rem,7.5vw,3.4rem)] font-medium leading-[1.06]">
        and I&rsquo;d walk through
        <span className="type-quote text-aurora block pb-1">
          every one of them again.
        </span>
      </h2>
    </div>
  )
}

function TitleOverlay({ progress }: { progress: MotionValue<number> }) {
  // Fully faded before the strip's first card reaches the viewport.
  // (Function-form transform: keeps the fade JS-driven — Motion's native
  // ScrollTimeline promotion mis-maps ranges on these svh sticky sections.)
  const fade = useTransform(progress, [0.055, 0.125], [1, 0])
  const opacity = useTransform(() => fade.get())
  const scale = useTransform(progress, [0.055, 0.125], [1, 0.94])

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0 z-[1] flex items-center justify-center px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: softEase }}
      >
        <FilmstripTitle />
      </motion.div>
    </motion.div>
  )
}

function FilmstripCard({
  src,
  index,
  travelT,
}: {
  src: string
  index: number
  travelT: MotionValue<number>
}) {
  // Each photo drifts inside its frame as the strip travels — parallax depth.
  const parallax = useTransform(
    travelT,
    [0, 1],
    index % 2 === 0 ? ['6%', '-6%'] : ['-6%', '6%'],
  )

  return (
    <div
      className="relative z-10 shrink-0"
      style={{
        rotate: `${tilts[index % tilts.length]}deg`,
        translate: `0 ${bobs[index % bobs.length]}svh`,
      }}
    >
      <div className="polaroid w-[min(62vw,24rem)] rounded-[1rem] p-2 shadow-[0_30px_80px_rgba(2,0,10,0.6)]">
        <div className="aspect-[4/5] overflow-hidden rounded-[0.6rem]">
          <motion.img
            src={src}
            alt="a memory of us"
            style={{ x: parallax }}
            className="h-full w-[116%] max-w-none object-cover"
            draggable={false}
            decoding="async"
          />
        </div>
        <p className="type-eyebrow py-2 text-center !tracking-[0.3em] text-[#2b1048]/40">
          no. {String(index + 1).padStart(2, '0')}
        </p>
      </div>
    </div>
  )
}

function EndWhisper({ progress }: { progress: MotionValue<number> }) {
  const fade = useTransform(progress, [0.965, 1], [0, 1])
  const opacity = useTransform(() => fade.get())
  const y = useTransform(progress, [0.965, 1], [12, 0])

  return (
    <motion.p
      style={{ opacity, y }}
      className="type-quote night-veil absolute inset-x-0 bottom-[7%] z-20 text-center text-lg text-moon"
    >
      and we&rsquo;re still collecting.
    </motion.p>
  )
}
