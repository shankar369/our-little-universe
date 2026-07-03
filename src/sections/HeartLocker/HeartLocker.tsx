import { useRef } from 'react'
import { ChevronDown, LockKeyhole, Sparkles } from 'lucide-react'
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from 'motion/react'
import { useNavigate } from 'react-router'
import { getHeartLockerPhotos } from '../../content/heartLockerGallery'
import { siteContent } from '../../content/siteContent'
import { riseIn, softEase } from '../../design/motion'
import { useCinematicTransition } from '../../shared/components/CinematicTransition'
import { useRichMotion } from '../../shared/lib/richMotion'
import { useHeartLocker } from '../../features/heartLocker/HeartLockerContext'
import { FilmstripAct } from './FilmstripAct'
import { FinaleAct } from './FinaleAct'
import { LockerAtmosphere } from './LockerAtmosphere'
import { PhotoEmberDissolve } from './PhotoEmberDissolve'
import { StackedAct } from './StackedAct'

const locker = siteContent.heartLocker

/**
 * The Heart Locker — a scroll-driven cinema in three acts:
 * I. photos landing on a deck, II. a horizontal filmstrip glide,
 * III. the ember-swarm "Navya's Sankar" signature.
 * One shared ember atmosphere breathes behind all of it (LockerAtmosphere),
 * stirred by scroll speed and handing off to the finale's own embers.
 */
export function HeartLocker() {
  const stackedPhotos = getHeartLockerPhotos('photo-stack')
  const stripPhotos = getHeartLockerPhotos('photo-strip')
  const { rich, compact } = useRichMotion()
  const finaleRef = useRef<HTMLDivElement | null>(null)
  // Driven by Act II's scroll velocity; smears atmosphere embers into streaks.
  const streak = useMotionValue(0)
  // The dissolve bridge: Act II drives these, the atmosphere consumes them.
  const dissolveProgress = useMotionValue(0)
  const dissolveRect = useRef<DOMRect | null>(null)
  const lastStripPhoto = stripPhotos[stripPhotos.length - 1]

  return (
    <main className="relative text-starlight">
      {rich ? (
        <LockerAtmosphere
          compact={compact}
          finaleRef={finaleRef}
          streak={streak}
        />
      ) : null}
      {rich && lastStripPhoto ? (
        <PhotoEmberDissolve
          src={lastStripPhoto}
          progress={dissolveProgress}
          rect={dissolveRect}
          compact={compact}
        />
      ) : null}
      <IntroSection />
      <ActSeam />
      <StackedAct photos={stackedPhotos} />
      <ActSeam />
      <FilmstripAct
        photos={stripPhotos}
        streak={rich ? streak : undefined}
        dissolveProgress={rich && lastStripPhoto ? dissolveProgress : undefined}
        dissolveRectRef={rich && lastStripPhoto ? dissolveRect : undefined}
      />
      <ActSeam />
      <div ref={finaleRef}>
        <FinaleAct />
      </div>
      <OutroSection />
    </main>
  )
}

/**
 * A hairline of aurora light that brightens and stretches as it sweeps past —
 * the seam between two acts of the cinema.
 */
function ActSeam() {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.95', 'start 0.25'],
  })
  // Function-form fade: keeps it JS-driven, dodging Motion's native
  // ScrollTimeline promotion, which mis-maps ranges near svh sticky sections.
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])
  const opacity = useTransform(() => glow.get())
  const scaleX = useTransform(scrollYProgress, [0, 0.55], [0.25, 1])

  return (
    <div ref={ref} aria-hidden="true" className="relative h-px w-full motion-reduce:hidden">
      <motion.div
        style={{
          opacity,
          scaleX,
          background:
            'linear-gradient(90deg, transparent, rgba(200,148,252,0.55) 30%, rgba(247,184,212,0.75) 50%, rgba(244,217,166,0.55) 70%, transparent)',
          boxShadow: '0 0 22px rgba(200,148,252,0.4)',
        }}
        className="absolute inset-x-[6%] top-0 h-px"
      />
    </div>
  )
}

function IntroSection() {
  const { minutesRemaining } = useHeartLocker()

  return (
    <section className="relative flex h-svh flex-col items-center justify-center gap-6 px-6 pt-[max(1.5rem,env(safe-area-inset-top))] text-center">
      <motion.div {...riseIn} className="night-veil">
        <div className="mb-4 inline-flex items-center gap-2.5 text-champagne/85">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="type-eyebrow">{locker.eyebrow}</span>
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <h1 className="text-glow text-[clamp(2.4rem,11vw,4rem)] font-medium leading-[1.04]">
          <span className="type-quote text-aurora pb-1">{locker.title}</span>
        </h1>
        <p className="type-quote mx-auto mt-4 max-w-xs text-pretty text-base leading-7 text-moon">
          {locker.intro}
        </p>
      </motion.div>

      <motion.span
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6, ease: softEase }}
        className="type-eyebrow glass-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-faint"
      >
        <LockKeyhole className="h-3.5 w-3.5" />
        open for about {minutesRemaining} min
      </motion.span>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8, ease: softEase }}
        className="absolute inset-x-0 bottom-[max(2.25rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-1.5"
      >
        <p className="type-script text-moon/75">
          scroll slowly &mdash; this one&rsquo;s just ours
        </p>
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-champagne/80 motion-reduce:hidden"
        >
          <ChevronDown className="h-4.5 w-4.5" />
        </motion.span>
      </motion.div>
    </section>
  )
}

function OutroSection() {
  const { hide } = useHeartLocker()
  const { play } = useCinematicTransition()
  const navigate = useNavigate()

  function sealLocker() {
    play('seal')
    window.setTimeout(() => {
      hide()
      navigate('/journey')
    }, 480)
  }

  return (
    <section className="relative flex min-h-[60svh] flex-col items-center justify-center gap-6 px-6 pb-[max(6rem,env(safe-area-inset-bottom))] text-center">
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: softEase }}
        className="type-quote night-veil max-w-xs text-pretty text-base leading-7 text-moon"
      >
        sealed with everything I have.
      </motion.p>
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ delay: 0.15, duration: 0.6, ease: softEase }}
        whileTap={{ scale: 0.985 }}
        onClick={sealLocker}
        className="btn-ghost flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
      >
        <LockKeyhole className="h-4 w-4 text-champagne" />
        Seal it back up
      </motion.button>
    </section>
  )
}
