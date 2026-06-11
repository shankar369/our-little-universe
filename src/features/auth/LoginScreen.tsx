import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Heart, LockKeyhole, Sparkles } from 'lucide-react'
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
    <main className="relative flex min-h-svh items-center justify-center px-5 py-[max(1.25rem,env(safe-area-inset-top))] text-white">
      <motion.section
        className="w-full max-w-[28rem]"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: softEase }}
      >
        <div className="liquid-panel rounded-[2rem] p-5 sm:p-6">
          <div className="relative">
            <div className="mb-8 flex items-center justify-between">
              <div className="liquid-control inline-flex h-12 w-12 items-center justify-center rounded-2xl shadow-[0_0_32px_rgba(217,70,239,0.2)]">
                <LockKeyhole className="h-5 w-5 text-fuchsia-100" />
              </div>
              <div className="liquid-control flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-fuchsia-50/90">
                <Sparkles className="h-3.5 w-3.5 text-amber-200" />
                Secret birthday portal
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-fuchsia-100/70">
                {siteContent.appTitle}
              </p>
              <h1 className="text-balance text-[clamp(2.15rem,12vw,4rem)] font-semibold leading-[0.95] text-white">
                Only one heart knows the way in.
              </h1>
              <p className="text-pretty text-base leading-7 text-violet-100/72">
                {siteContent.login.question}
              </p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="sr-only">Secret answer</span>
                <input
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  disabled={isUnlocking}
                  autoFocus
                  className="liquid-control h-14 w-full rounded-2xl px-4 text-base text-white outline-none transition placeholder:text-violet-100/42 focus:border-fuchsia-100/55 focus:bg-white/[0.13] focus:ring-4 focus:ring-fuchsia-300/15 disabled:cursor-wait"
                  placeholder="Type the magic answer"
                />
              </label>

              <AnimatePresence mode="wait">
                <motion.p
                  key={`${attempts}-${isUnlocking}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="liquid-control min-h-12 rounded-2xl px-4 py-3 text-sm leading-6 text-violet-50/84"
                >
                  {isUnlocking ? siteContent.login.successMessage : feedback}
                </motion.p>
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isUnlocking}
                whileTap={{ scale: 0.98 }}
                className="liquid-button group flex h-14 w-full items-center justify-center gap-2 rounded-2xl px-5 text-base font-bold text-purple-950 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-100 disabled:cursor-wait disabled:opacity-80"
              >
                <Heart className="h-4 w-4 fill-purple-950 transition group-hover:scale-110" />
                {isUnlocking ? 'Opening the universe...' : 'Unlock the universe'}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.section>
    </main>
  )
}
