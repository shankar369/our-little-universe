import { useEffect, useRef, useState, type FormEvent } from 'react'
import { KeyRound, Lock, X } from 'lucide-react'
import { AnimatePresence, motion, useAnimationControls } from 'motion/react'
import { useNavigate } from 'react-router'
import { siteContent } from '../../content/siteContent'
import { softEase } from '../../design/motion'
import { useCinematicTransition } from '../../shared/components/CinematicTransition'
import { useHeartLocker } from './HeartLockerContext'

const locker = siteContent.heartLocker

export function HeartLockerPrompt() {
  const { isPromptOpen, closePrompt, unlock } = useHeartLocker()
  const { play } = useCinematicTransition()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const controls = useAnimationControls()
  const [value, setValue] = useState('')
  const [wrong, setWrong] = useState(false)

  // Reset the field whenever the prompt opens/closes (render-time adjustment).
  const [wasOpen, setWasOpen] = useState(isPromptOpen)
  if (wasOpen !== isPromptOpen) {
    setWasOpen(isPromptOpen)
    if (!isPromptOpen) {
      setValue('')
      setWrong(false)
    }
  }

  useEffect(() => {
    if (!isPromptOpen) {
      return
    }

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 120)

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closePrompt()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleKey)
    }
  }, [isPromptOpen, closePrompt])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const isCorrect =
      value.trim().toLowerCase() === locker.answer.trim().toLowerCase()

    if (!isCorrect) {
      setWrong(true)
      void controls.start({
        x: [0, -9, 9, -7, 7, 0],
        transition: { duration: 0.42, ease: 'easeInOut' },
      })
      return
    }

    closePrompt()
    unlock()
    play('unlock')
    // Land inside the locker as the hearts take flight.
    window.setTimeout(() => navigate('/heart-locker'), 420)
  }

  return (
    <AnimatePresence>
      {isPromptOpen ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Unlock the Heart Locker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: softEase }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-night/80 px-6 backdrop-blur-xl"
          onClick={closePrompt}
        >
          <motion.div
            animate={controls}
            initial={false}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 22, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.5, ease: softEase }}
              className="glass-panel relative w-full rounded-3xl p-7"
            >
              <div className="relative z-10">
              <button
                type="button"
                onClick={closePrompt}
                className="btn-ghost absolute -right-1 -top-1 flex h-10 w-10 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
                aria-label="Close"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              <div className="mb-4 flex flex-col items-center text-center">
                <span className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-champagne/12 text-champagne">
                  <span className="absolute inset-0 animate-pulse rounded-full bg-champagne/15 blur-lg" />
                  <Lock className="relative h-6 w-6" />
                </span>
                <span className="type-eyebrow text-champagne/85">{locker.eyebrow}</span>
                <h2 className="mt-2 font-display text-2xl font-semibold leading-tight text-starlight">
                  {locker.title}
                </h2>
                <p className="type-quote mt-2 text-pretty text-sm leading-6 text-moon/90">
                  {locker.question}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={value}
                  onChange={(event) => {
                    setValue(event.target.value)
                    setWrong(false)
                  }}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="whisper it here"
                  aria-label="Secret answer"
                  className="glass-chip h-12 w-full rounded-2xl px-4 text-center text-base text-starlight placeholder:text-faint/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orchid"
                />

                <p
                  className={`type-quote min-h-5 text-center text-xs ${
                    wrong ? 'text-blush' : 'text-faint'
                  }`}
                >
                  {wrong ? locker.wrongMessage : locker.hint}
                </p>

                <button
                  type="submit"
                  className="btn-primary flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold active:scale-[0.985] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
                >
                  <KeyRound className="h-4 w-4" />
                  Open the locker
                </button>
              </form>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
