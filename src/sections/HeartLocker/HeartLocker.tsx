import { Heart, LockKeyhole, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { siteContent } from '../../content/siteContent'
import { riseIn, softEase } from '../../design/motion'
import { useCinematicTransition } from '../../shared/components/CinematicTransition'
import { useHeartLocker } from '../../features/heartLocker/HeartLockerContext'

const locker = siteContent.heartLocker

export function HeartLocker() {
  const { minutesRemaining, hide } = useHeartLocker()
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
    <main className="relative min-h-svh px-6 py-[max(1.5rem,env(safe-area-inset-top))] text-starlight">
      <section className="mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-md flex-col items-center justify-center gap-6 pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-6 text-center">
        <motion.div {...riseIn} className="night-veil">
          <div className="mb-4 inline-flex items-center gap-2.5 text-champagne/85">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="type-eyebrow">{locker.eyebrow}</span>
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <h1 className="text-glow text-[clamp(2.2rem,10vw,3.4rem)] font-medium leading-[1.04]">
            <span className="type-quote text-aurora pb-1">{locker.title}</span>
          </h1>
          <p className="type-quote mx-auto mt-4 max-w-xs text-pretty text-base leading-7 text-moon">
            {locker.intro}
          </p>
        </motion.div>

        {/* The open locket medallion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: softEase }}
          className="glass-panel relative flex w-full flex-col items-center gap-4 rounded-3xl px-6 py-8"
        >
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-blush/12 text-blush">
            <span className="absolute inset-0 animate-pulse rounded-full bg-blush/15 blur-xl" />
            <Heart className="relative h-9 w-9 fill-blush/80" />
          </span>
          <p className="type-quote text-pretty text-sm leading-6 text-moon/90">
            This little vault is open. The most precious things will live here soon —
            for now, it&rsquo;s just ours to keep.
          </p>
          <span className="type-eyebrow inline-flex items-center gap-2 text-faint">
            <LockKeyhole className="h-3.5 w-3.5" />
            open for about {minutesRemaining} min
          </span>
        </motion.div>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: softEase }}
          whileTap={{ scale: 0.985 }}
          onClick={sealLocker}
          className="btn-ghost flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
        >
          <LockKeyhole className="h-4 w-4 text-champagne" />
          Seal it back up
        </motion.button>
      </section>
    </main>
  )
}
