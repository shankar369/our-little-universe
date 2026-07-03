import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Heart } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { appConfig } from '../../app/appConfig'
import { siteContent } from '../../content/siteContent'
import { softEase } from '../../design/motion'

type LoginScreenProps = {
  onUnlock: () => void
}

export function LoginScreen({ onUnlock }: LoginScreenProps) {
  const [answer, setAnswer] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isUnlocking, setIsUnlocking] = useState(false)

  const feedback = useMemo(() => {
    if (attempts === 0) {
      return siteContent.login.hint
    }

    return siteContent.login.wrongMessages[
      (attempts - 1) % siteContent.login.wrongMessages.length
    ]
  }, [attempts])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedAnswer = answer.trim().toLowerCase()
    const normalizedExpected = siteContent.login.answer.toLowerCase()

    if (normalizedAnswer === normalizedExpected) {
      setIsUnlocking(true)
      window.setTimeout(onUnlock, appConfig.timings.loginUnlockDelayMs)
      return
    }

    setAttempts((current) => current + 1)
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center px-6 py-[max(1.5rem,env(safe-area-inset-top))] text-starlight">
      <motion.section
        className="night-veil w-full max-w-[23.5rem] text-center"
        initial={{ opacity: 0, y: 26, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: softEase }}
      >
        {/* Heart seal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6, ease: softEase }}
          className="glass-chip mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full shadow-[0_0_44px_rgba(200,148,252,0.3)]"
        >
          <Heart className="h-6 w-6 fill-blush/60 text-blush" />
        </motion.div>

        <p className="type-eyebrow mb-4 text-champagne/85">{siteContent.appTitle}</p>

        <h1 className="text-glow text-balance text-[clamp(1.9rem,8.5vw,2.6rem)] font-medium leading-[1.12]">
          Only one heart knows
          <span className="type-quote text-aurora block pb-1">the way in.</span>
        </h1>

        <p className="mt-4 text-pretty text-[0.95rem] leading-6 text-moon">
          {siteContent.login.question}
        </p>

        <form className="mt-8 space-y-4 text-left" onSubmit={handleSubmit}>
          <label className="block">
            <span className="sr-only">Secret answer</span>
            <input
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              disabled={isUnlocking}
              autoFocus
              className="input-glass h-14 w-full rounded-2xl px-5 text-center text-base text-starlight placeholder:text-faint disabled:cursor-wait"
              placeholder="whisper the magic answer"
            />
          </label>

          <button
            type="submit"
            disabled={isUnlocking}
            className="btn-primary flex h-14 w-full items-center justify-center gap-2 rounded-2xl px-5 text-base font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid disabled:cursor-wait disabled:opacity-85"
          >
            <Heart className="h-4 w-4 fill-[#2b1048]" />
            {isUnlocking ? 'Opening the universe\u2026' : 'Unlock the universe'}
          </button>

          <AnimatePresence mode="wait">
            <motion.p
              key={`${attempts}-${isUnlocking}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="type-script min-h-12 px-2 pt-1 text-center text-moon/90"
            >
              {isUnlocking ? siteContent.login.successMessage : feedback}
            </motion.p>
          </AnimatePresence>
        </form>
      </motion.section>
    </main>
  )
}
