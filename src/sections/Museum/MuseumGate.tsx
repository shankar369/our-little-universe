import { useEffect, useRef, useState, type FormEvent } from 'react'
import { DoorOpen, KeyRound, X } from 'lucide-react'
import { AnimatePresence, motion, useAnimationControls } from 'motion/react'
import { museumContent } from '../../content/museum'
import { softEase } from '../../design/motion'

/**
 * The membership desk: the museum's password modal, cut from the same glass
 * as the Heart Locker prompt. A correct word swings the doors open.
 */

type MuseumGateProps = {
  open: boolean
  onClose: () => void
  onUnlocked: () => void
}

export function MuseumGate({ open, onClose, onUnlocked }: MuseumGateProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const controls = useAnimationControls()
  const [value, setValue] = useState('')
  const [wrong, setWrong] = useState(false)

  // Reset the field whenever the gate opens/closes (render-time adjustment).
  const [wasOpen, setWasOpen] = useState(open)
  if (wasOpen !== open) {
    setWasOpen(open)
    if (!open) {
      setValue('')
      setWrong(false)
    }
  }

  useEffect(() => {
    if (!open) {
      return
    }

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 120)

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const isCorrect =
      value.trim().toLowerCase() === museumContent.answer.trim().toLowerCase()

    if (!isCorrect) {
      setWrong(true)
      void controls.start({
        x: [0, -9, 9, -7, 7, 0],
        transition: { duration: 0.42, ease: 'easeInOut' },
      })
      return
    }

    onUnlocked()
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Enter the mUSeum"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: softEase }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-night/80 px-6 backdrop-blur-xl"
          onClick={onClose}
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
                  onClick={onClose}
                  className="btn-ghost absolute -right-1 -top-1 flex h-10 w-10 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
                  aria-label="Close"
                >
                  <X className="h-4.5 w-4.5" />
                </button>

                <div className="mb-4 flex flex-col items-center text-center">
                  <span className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-champagne/12 text-champagne">
                    <span className="absolute inset-0 animate-pulse rounded-full bg-champagne/15 blur-lg" />
                    <DoorOpen className="relative h-6 w-6" />
                  </span>
                  <span className="type-eyebrow text-champagne/85">
                    {museumContent.eyebrow}
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-semibold leading-tight text-starlight">
                    {museumContent.title}
                  </h2>
                  <p className="type-quote mt-2 text-pretty text-sm leading-6 text-moon/90">
                    {museumContent.question}
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
                    className="input-glass h-12 w-full rounded-2xl px-4 text-center text-base text-starlight placeholder:text-faint/70"
                  />

                  <p
                    className={`type-script min-h-5 text-center !text-base ${
                      wrong ? 'text-blush' : 'text-faint'
                    }`}
                  >
                    {wrong ? museumContent.wrongMessage : museumContent.hint}
                  </p>

                  <button
                    type="submit"
                    className="btn-primary flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
                  >
                    <KeyRound className="h-4 w-4" />
                    Open the doors
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
