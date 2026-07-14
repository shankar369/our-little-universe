import { Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { experienceSections } from '../../app/experienceRegistry'
import { riseIn, softEase } from '../../design/motion'
import { useCinematicTransition } from '../../shared/components/CinematicTransition'
import { useHeartLocker } from '../../features/heartLocker/HeartLockerContext'
import { ChapterLetter, UnwrittenLetter } from './ChapterLetter'

/**
 * The chapter picker as a writing desk: every chapter is a sealed letter
 * (warm-paper envelope, wax seal, postage stamp) laid at a slight tilt on the
 * night sky. The hidden Heart Locker arrives as the one midnight envelope.
 */

const romanNumerals = ['I', 'II', 'III', 'IV', 'V']
const letterTilts = [-1.4, 1.1, -0.8, 1.5, -1.1, 0.9]

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
            <span className="type-eyebrow">Letters, sealed for you</span>
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <h1 className="text-glow text-balance text-[clamp(2.1rem,9vw,3.6rem)] font-medium leading-[1.05]">
            Which letter should we
            <span className="type-quote text-aurora block pb-1">open first?</span>
          </h1>
          <p className="type-quote mx-auto mt-5 max-w-md text-pretty text-base leading-7 text-moon sm:text-lg">
            Every chapter of us is folded into an envelope. Break a seal,
            wander a while, and come back for the rest.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {hubSections.map((section, index) => {
            const isLive = section.status === 'live'
            return (
              <motion.article
                key={section.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.12, duration: 0.6, ease: softEase }}
              >
                <ChapterLetter
                  to={section.path}
                  eyebrow={`Chapter ${romanNumerals[index]}${isLive ? '' : ' · soon'}`}
                  title={section.label}
                  note={section.description}
                  cta={isLive ? 'Break the seal' : 'Still being written'}
                  icon={section.icon}
                  tilt={letterTilts[index]}
                />
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
              <ChapterLetter
                onOpen={handleLockerClick}
                skipOpen={!isUnlocked}
                eyebrow="A hidden chapter"
                title="Heart Locker"
                note={
                  isUnlocked
                    ? 'Already yours — slip quietly back inside.'
                    : 'Only a secret opens this one.'
                }
                cta={isUnlocked ? 'Break the seal' : 'Whisper the password'}
                icon={
                  experienceSections.find((section) => section.id === 'heart-locker')!
                    .icon
                }
                tone="velvet"
                tilt={letterTilts[5]}
              />
            </motion.article>
          ) : (
            <motion.article
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.7, ease: softEase }}
              aria-hidden="true"
            >
              <UnwrittenLetter />
            </motion.article>
          )}
        </div>
      </section>
    </main>
  )
}
