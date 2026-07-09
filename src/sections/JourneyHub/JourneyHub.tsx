import { ArrowRight, Heart, LockKeyhole, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { Link, useNavigate } from 'react-router'
import { experienceSections } from '../../app/experienceRegistry'
import { riseIn, softEase } from '../../design/motion'
import { useCinematicTransition } from '../../shared/components/CinematicTransition'
import { useHeartLocker } from '../../features/heartLocker/HeartLockerContext'

const sectionAccents = {
  'memory-timeline': 'from-blush/25 to-orchid/5',
  'photo-universe': 'from-champagne/20 to-orchid/5',
  'our-little-atlas': 'from-orchid/22 to-blush/5',
  museum: 'from-champagne/22 to-blush/6',
  'the-book': 'from-blush/22 to-champagne/6',
} as const

const romanNumerals = ['I', 'II', 'III', 'IV', 'V']

export function JourneyHub() {
  const navigate = useNavigate()
  const { isRevealed, isUnlocked, openPrompt } = useHeartLocker()
  const { play } = useCinematicTransition()

  const hubSections = experienceSections.filter((section) =>
    [
      'memory-timeline',
      'photo-universe',
      'our-little-atlas',
      'museum',
      'the-book',
    ].includes(section.id),
  )

  function handleLockerClick() {
    if (isUnlocked) {
      play('unlock')
      window.setTimeout(() => navigate('/heart-locker'), 430)
    } else {
      openPrompt()
    }
  }

  return (
    <main className="relative min-h-svh px-6 py-[max(1.5rem,env(safe-area-inset-top))] text-starlight">
      <section className="mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-4xl flex-col justify-center gap-10 pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-8">
        <motion.div {...riseIn} className="night-veil text-center">
          <div className="mb-5 inline-flex items-center gap-2.5 text-champagne/85">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="type-eyebrow">Choose a chapter</span>
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <h1 className="text-glow text-balance text-[clamp(2.1rem,9vw,3.6rem)] font-medium leading-[1.05]">
            Where should this little universe
            <span className="type-quote text-aurora block pb-1">open next?</span>
          </h1>
          <p className="type-quote mx-auto mt-5 max-w-md text-pretty text-base leading-7 text-moon sm:text-lg">
            Each chapter is a tiny world of us. Pick one, wander a while, and
            come back for the rest.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {hubSections.map((section, index) => {
            const Icon = section.icon
            const accent =
              sectionAccents[section.id as keyof typeof sectionAccents] ??
              'from-orchid/20 to-orchid/5'
            const isLive = section.status === 'live'

            return (
              <motion.article
                key={section.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.12, duration: 0.6, ease: softEase }}
              >
                <Link
                  to={section.path}
                  className="glass-panel group relative flex min-h-56 flex-col justify-between overflow-hidden rounded-3xl p-6 transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_24px_70px_rgba(2,0,10,0.55),0_0_60px_rgba(200,148,252,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
                >
                  <div
                    className={`pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-gradient-to-br ${accent} blur-2xl`}
                  />
                  <span
                    className="pointer-events-none absolute -top-3 right-4 font-display text-[5.5rem] font-light italic leading-none text-starlight/8"
                    aria-hidden="true"
                  >
                    {romanNumerals[index]}
                  </span>

                  <div className="relative">
                    <div className="mb-5 flex items-center gap-3">
                      <span className="glass-chip flex h-11 w-11 items-center justify-center rounded-xl text-orchid">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="type-eyebrow text-faint">
                        Chapter {romanNumerals[index]}
                        {isLive ? '' : ' \u00b7 soon'}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl font-semibold leading-tight sm:text-[1.7rem]">
                      {section.label}
                    </h2>
                    <p className="mt-2.5 text-sm leading-6 text-moon/85">
                      {section.description}
                    </p>
                  </div>

                  <span className="relative mt-7 inline-flex min-h-6 items-center gap-2 text-sm font-semibold text-champagne/90 transition-transform duration-300 group-hover:translate-x-1">
                    {isLive ? 'Step inside' : 'Peek inside'}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </motion.article>
            )
          })}

          {/* The hidden chapter — surfaces only after the secret hold gesture */}
          {isRevealed ? (
            <motion.article
              initial={{ opacity: 0, y: 26, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.75, ease: softEase }}
            >
              <button
                type="button"
                onClick={handleLockerClick}
                className="glass-panel group relative flex min-h-56 w-full flex-col justify-between overflow-hidden rounded-3xl border border-champagne/30 p-6 text-left shadow-[0_0_50px_rgba(244,217,166,0.12)] transition duration-300 hover:-translate-y-0.5 hover:border-champagne/45 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_24px_70px_rgba(2,0,10,0.55),0_0_60px_rgba(247,184,212,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
              >
                <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-gradient-to-br from-champagne/25 to-blush/8 blur-2xl" />
                <Heart
                  className="pointer-events-none absolute -top-2 right-3 h-24 w-24 fill-champagne/5 text-champagne/10"
                  aria-hidden="true"
                />

                <div className="relative">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="glass-chip flex h-11 w-11 items-center justify-center rounded-xl text-champagne">
                      <LockKeyhole className="h-5 w-5" />
                    </span>
                    <span className="type-eyebrow text-champagne/80">A hidden chapter</span>
                  </div>
                  <h2 className="font-display text-2xl font-semibold leading-tight sm:text-[1.7rem]">
                    Heart Locker
                  </h2>
                  <p className="mt-2.5 text-sm leading-6 text-moon/85">
                    {isUnlocked
                      ? 'Already yours — slip quietly back inside.'
                      : 'Only a secret opens this one.'}
                  </p>
                </div>

                <span className="relative mt-7 inline-flex min-h-6 items-center gap-2 text-sm font-semibold text-champagne/90 transition-transform duration-300 group-hover:translate-x-1">
                  {isUnlocked ? 'Step inside' : 'Whisper the password'}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            </motion.article>
          ) : null}
        </div>
      </section>
    </main>
  )
}
