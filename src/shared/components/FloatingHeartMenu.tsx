import { useCallback, useRef, useState } from 'react'
import { Heart, Home, Images, LockKeyhole, Map, MapPin, Orbit, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Link, useLocation, useNavigate } from 'react-router'
import { appConfig } from '../../app/appConfig'
import { experienceSections } from '../../app/experienceRegistry'
import { useHeartLocker } from '../../features/heartLocker/HeartLockerContext'
import { useCinematicTransition } from './CinematicTransition'

const iconBySection: Record<string, LucideIcon> = {
  opening: Home,
  journey: Map,
  'memory-timeline': Images,
  'photo-universe': Orbit,
  'our-little-atlas': MapPin,
  'quote-puzzles': Heart,
} as const

const HOLD_MS = appConfig.timings.heartLockerHoldMs
const heartLockerSection = experienceSections.find(
  (section) => section.id === 'heart-locker',
)

export function FloatingHeartMenu() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [charging, setCharging] = useState(false)

  const { isRevealed, isUnlocked, minutesRemaining, reveal, hide } = useHeartLocker()
  const { play } = useCinematicTransition()

  const holdTimer = useRef<number | null>(null)
  const pressStart = useRef(0)
  const completed = useRef(false)

  const menuSections = experienceSections.filter(
    (section) => section.id !== 'quote-puzzles' && section.id !== 'heart-locker',
  )

  const clearHold = useCallback(() => {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current)
      holdTimer.current = null
    }
  }, [])

  // The 5s hold fired — surface the hidden chapter card in the Journey hub,
  // or tuck it away again if it's already showing.
  const completeHold = useCallback(() => {
    completed.current = true
    setCharging(false)
    clearHold()
    setIsOpen(false)

    if (isRevealed) {
      hide()
      play('seal')
    } else {
      reveal()
      play('reveal')
      navigate('/journey')
    }
  }, [clearHold, isRevealed, hide, reveal, play, navigate])

  function startHold() {
    completed.current = false
    pressStart.current = Date.now()
    setCharging(true)
    holdTimer.current = window.setTimeout(completeHold, HOLD_MS)
  }

  function endHold() {
    if (charging) {
      setCharging(false)
    }
    clearHold()

    const heldFor = Date.now() - pressStart.current
    // A quick tap (not a hold) toggles the menu.
    if (!completed.current && heldFor < 300) {
      setIsOpen((value) => !value)
    }
    completed.current = false
  }

  function cancelHold() {
    setCharging(false)
    clearHold()
    completed.current = false
  }

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 flex flex-col items-end gap-3 sm:right-6">
      <AnimatePresence>
        {isOpen ? (
          <motion.nav
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.26 }}
            className="menu-panel w-[min(19rem,calc(100vw-2rem))] rounded-3xl p-2.5"
            aria-label="Memory sections"
          >
            <div className="relative z-10 space-y-1.5">
              {menuSections.map((section) => {
                const Icon = iconBySection[section.id] ?? Heart
                const isActive = location.pathname === section.path

                return (
                  <Link
                    key={section.id}
                    to={section.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex min-h-13 items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orchid ${
                      isActive
                        ? 'bg-white/10 text-starlight'
                        : 'text-moon hover:bg-white/[0.06] hover:text-starlight'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        isActive ? 'bg-orchid/25 text-starlight' : 'bg-white/8 text-orchid'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 font-semibold">
                        {section.label}
                        {isActive ? (
                          <Heart className="h-3 w-3 fill-blush text-blush" aria-hidden="true" />
                        ) : null}
                      </span>
                      <span className="mt-0.5 block truncate text-xs leading-4 text-faint">
                        {section.description}
                      </span>
                    </span>
                  </Link>
                )
              })}

              {/* The secret drawer — only listed once it's been opened */}
              {isUnlocked && heartLockerSection ? (
                <Link
                  to={heartLockerSection.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex min-h-13 items-center gap-3 rounded-2xl border border-champagne/25 bg-champagne/[0.07] px-3 py-2 text-left text-sm transition hover:bg-champagne/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orchid ${
                    location.pathname === heartLockerSection.path
                      ? 'text-starlight'
                      : 'text-moon hover:text-starlight'
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-champagne/20 text-champagne">
                    <LockKeyhole className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 font-semibold">
                      {heartLockerSection.label}
                      <Heart className="h-3 w-3 fill-blush text-blush" aria-hidden="true" />
                    </span>
                    <span className="mt-0.5 block truncate text-xs leading-4 text-champagne/70">
                      open for about {minutesRemaining} min · hold to seal
                    </span>
                  </span>
                </Link>
              ) : null}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>

      <div className="relative">
        {/* Charge ring — fills while the heart is held for its secret */}
        <svg
          viewBox="0 0 64 64"
          className="pointer-events-none absolute -inset-1 -rotate-90"
          aria-hidden="true"
        >
          <motion.circle
            cx="32"
            cy="32"
            r="30"
            fill="none"
            stroke="#f4d9a6"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 6px rgba(244,217,166,0.85))' }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: charging ? 1 : 0,
              opacity: charging ? 1 : 0,
            }}
            transition={{
              pathLength: { duration: charging ? HOLD_MS / 1000 : 0.3, ease: 'linear' },
              opacity: { duration: 0.35, delay: charging ? 0.45 : 0 },
            }}
          />
        </svg>

        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          onContextMenu={(event) => event.preventDefault()}
          className="btn-primary relative flex h-14 w-14 select-none items-center justify-center rounded-full shadow-[0_14px_44px_rgba(200,148,252,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
          style={{ touchAction: 'none', WebkitTouchCallout: 'none' }}
          aria-label={isOpen ? 'Close section menu' : 'Open section menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Heart className="h-5 w-5 fill-[#2b1048]" />}
        </motion.button>
      </div>
    </div>
  )
}
