import { useEffect, useRef, type RefObject } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'motion/react'
import { softEase } from '../../design/motion'
import { useRichMotion } from '../../shared/lib/richMotion'

const tilts = [-3.5, 2.5, -2, 4, -4.5, 2, -3, 3.5]
const bobs = [-3.5, 2.5, -1.5, 3, -2.5, 1.5, -3, 2]

type FilmstripActProps = {
  photos: string[]
  /** Fed back to the ember atmosphere: 0..1 light-streak intensity. */
  streak?: MotionValue<number>
  /** Fed to the dissolve bridge: 0..1 over the strip's final stretch. */
  dissolveProgress?: MotionValue<number>
  /** Kept fresh with the last photo box's viewport rect for the dissolve. */
  dissolveRectRef?: RefObject<DOMRect | null>
}

// The last photo starts burning here (scroll progress through the section).
const DISSOLVE_START = 0.86
const DISSOLVE_END = 0.985

/**
 * Act II — a scroll-pinned horizontal filmstrip. Vertical scroll drives the
 * whole strip of polaroids across the screen while each photo parallaxes
 * gently inside its frame — the classic pinned horizontal-gallery pattern.
 * Cards are opaque edge-to-edge; nothing ever fades over text.
 */
export function FilmstripAct({
  photos,
  streak,
  dissolveProgress,
  dissolveRectRef,
}: FilmstripActProps) {
  const containerRef = useRef<HTMLElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const reduceMotion = useReducedMotion()
  const { rich } = useRichMotion()
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

  // The strip leans into fast scrolling and settles softly when you slow —
  // a spring-smoothed skew clamped so overscroll bounces can't fling it.
  const progressVelocity = useVelocity(scrollYProgress)
  const leanVelocity = useSpring(progressVelocity, { stiffness: 90, damping: 28 })
  const skewX = useTransform(() =>
    Math.max(-3.5, Math.min(3.5, leanVelocity.get() * -8)),
  )

  // Feed the ember atmosphere its light-streak intensity while the strip
  // is on stage (0 outside Act II so streaks never leak into other acts).
  useMotionValueEvent(leanVelocity, 'change', (value) => {
    if (!streak) {
      return
    }
    const p = scrollYProgress.get()
    const onStage = p > 0.03 && p < 0.97 ? 1 : 0
    streak.set(Math.min(Math.abs(value) * 3, 1) * onStage)
  })

  // The dissolve bridge: over the strip's last stretch the final photo burns
  // into embers. Scrubbed straight from scroll, so scrolling back re-condenses
  // it. The photo box rect is re-measured each tick while the act is near its
  // end (the strip is still gliding, so the box moves).
  const lastPhotoBoxRef = useRef<HTMLDivElement | null>(null)
  const syncDissolve = (p: number) => {
    if (!dissolveProgress) {
      return
    }
    const t = Math.max(
      0,
      Math.min(1, (p - DISSOLVE_START) / (DISSOLVE_END - DISSOLVE_START)),
    )
    dissolveProgress.set(t)
    if (p > 0.8 && dissolveRectRef && lastPhotoBoxRef.current) {
      dissolveRectRef.current = lastPhotoBoxRef.current.getBoundingClientRect()
    }
  }
  useMotionValueEvent(scrollYProgress, 'change', syncDissolve)
  // Scroll restoration can land mid-act without a scroll event — sync once on
  // mount (and after resizes, which move the photo box).
  useEffect(() => {
    const sync = () => syncDissolve(scrollYProgress.get())
    const settle = window.setTimeout(sync, 400)
    window.addEventListener('resize', sync)
    return () => {
      window.clearTimeout(settle)
      window.removeEventListener('resize', sync)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The DOM photo fades as its embers light up (function-form: JS-driven).
  const lastPhotoFade = useTransform(
    scrollYProgress,
    [DISSOLVE_START + 0.015, DISSOLVE_START + 0.095],
    [1, 0],
  )
  const lastPhotoOpacity = useTransform(() =>
    dissolveProgress ? lastPhotoFade.get() : 1,
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
        {/* A soft horizon of light the strip glides along (the ember
            atmosphere covers this when rich motion is available) */}
        {rich ? null : (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[46vmin] -translate-y-1/2 bg-[radial-gradient(60%_100%_at_50%_50%,rgba(109,40,217,0.22),transparent_75%)] blur-2xl" />
        )}

        <TitleOverlay progress={scrollYProgress} />

        <div className="absolute inset-0 flex items-center">
          <motion.div
            ref={trackRef}
            style={{ x: trackX, skewX, willChange: 'transform' }}
            className="flex w-max items-center gap-[7vw] pr-[10vw] sm:gap-20"
          >
            {photos.map((src, index) => (
              <FilmstripCard
                key={`${src}-${index}`}
                src={src}
                index={index}
                travelT={travelT}
                photoOpacity={
                  index === photos.length - 1 ? lastPhotoOpacity : undefined
                }
                photoBoxRef={
                  index === photos.length - 1 ? lastPhotoBoxRef : undefined
                }
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
  photoOpacity,
  photoBoxRef,
}: {
  src: string
  index: number
  travelT: MotionValue<number>
  /** Set on the last card: the photo fades as its embers take over. */
  photoOpacity?: MotionValue<number>
  photoBoxRef?: RefObject<HTMLDivElement | null>
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
      <div className="polaroid w-[min(62vw,24rem)] rounded-[1rem] p-2 pb-5 shadow-[0_30px_80px_rgba(2,0,10,0.6)]">
        <div
          ref={photoBoxRef}
          className="aspect-[4/5] overflow-hidden rounded-[0.6rem]"
        >
          <motion.img
            src={src}
            alt="a memory of us"
            style={
              photoOpacity ? { x: parallax, opacity: photoOpacity } : { x: parallax }
            }
            className="h-full w-[116%] max-w-none object-cover"
            draggable={false}
            decoding="async"
          />
        </div>
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
      className="type-script night-veil absolute inset-x-0 bottom-[7%] z-20 text-center text-moon"
    >
      and we&rsquo;re still collecting.
    </motion.p>
  )
}
