import { ChevronDown, LockKeyhole, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { getHeartLockerPhotos } from '../../content/heartLockerGallery'
import { siteContent } from '../../content/siteContent'
import { riseIn, softEase } from '../../design/motion'
import { useCinematicTransition } from '../../shared/components/CinematicTransition'
import { useHeartLocker } from '../../features/heartLocker/HeartLockerContext'
import { FilmstripAct } from './FilmstripAct'
import { FinaleAct } from './FinaleAct'
import { StackedAct } from './StackedAct'

const locker = siteContent.heartLocker

/**
 * The Heart Locker — a scroll-driven cinema in three acts:
 * I. photos landing on a deck, II. a horizontal filmstrip glide,
 * III. the ember-swarm "Navya's Sankar" signature.
 */
export function HeartLocker() {
  const stackedPhotos = getHeartLockerPhotos('photo-stack')
  const stripPhotos = getHeartLockerPhotos('photo-strip')

  return (
    <main className="relative text-starlight">
      <IntroSection />
      <StackedAct photos={stackedPhotos} />
      <FilmstripAct photos={stripPhotos} />
      <FinaleAct />
      <OutroSection />
    </main>
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
        <p className="type-quote text-sm text-moon/75">
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
