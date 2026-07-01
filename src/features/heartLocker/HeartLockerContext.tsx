import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { appConfig } from '../../app/appConfig'

const REVEALED_KEY = appConfig.storageKeys.heartLockerRevealedUntil
const ENTERED_KEY = appConfig.storageKeys.heartLockerEntered
const UNLOCK_MS = appConfig.timings.heartLockerUnlockMs

type HeartLockerContextValue = {
  /** The hidden chapter card is visible in the Journey hub. */
  isRevealed: boolean
  /** The password has been entered — the locker route is reachable. */
  isUnlocked: boolean
  /** Whole minutes left before the locker re-seals itself. */
  minutesRemaining: number
  /** The password prompt's open state. */
  isPromptOpen: boolean
  openPrompt: () => void
  closePrompt: () => void
  /** Surface the hidden chapter card (hold gesture). */
  reveal: () => void
  /** Hide the chapter card and forget the password (hold gesture / seal). */
  hide: () => void
  /** Record a correct password for this tab. */
  unlock: () => void
}

const HeartLockerContext = createContext<HeartLockerContextValue | null>(null)

function readRevealedUntil(): number {
  if (typeof window === 'undefined') {
    return 0
  }
  const raw = window.sessionStorage.getItem(REVEALED_KEY)
  const value = raw ? Number(raw) : 0
  return Number.isFinite(value) ? value : 0
}

function readEntered(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return window.sessionStorage.getItem(ENTERED_KEY) === 'true'
}

// eslint-disable-next-line react-refresh/only-export-components
export function useHeartLocker() {
  const value = useContext(HeartLockerContext)
  if (!value) {
    throw new Error('useHeartLocker must be used within HeartLockerProvider')
  }
  return value
}

export function HeartLockerProvider({ children }: { children: ReactNode }) {
  const [revealedUntil, setRevealedUntil] = useState(() => readRevealedUntil())
  const [entered, setEntered] = useState(() => readEntered())
  const [now, setNow] = useState(() => Date.now())
  const [isPromptOpen, setIsPromptOpen] = useState(false)

  // A coarse tick keeps the "minutes left" label roughly fresh.
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(interval)
  }, [])

  // Re-check exactly when the window elapses so the card disappears on time.
  useEffect(() => {
    const remaining = revealedUntil - Date.now()
    if (remaining <= 0) {
      return
    }
    const timer = window.setTimeout(() => setNow(Date.now()), remaining)
    return () => window.clearTimeout(timer)
  }, [revealedUntil])

  const isRevealed = revealedUntil > now
  const isUnlocked = entered && isRevealed

  const reveal = useCallback(() => {
    const until = Date.now() + UNLOCK_MS
    window.sessionStorage.setItem(REVEALED_KEY, String(until))
    setRevealedUntil(until)
    setNow(Date.now())
  }, [])

  const hide = useCallback(() => {
    window.sessionStorage.removeItem(REVEALED_KEY)
    window.sessionStorage.removeItem(ENTERED_KEY)
    setRevealedUntil(0)
    setEntered(false)
  }, [])

  const unlock = useCallback(() => {
    const until = Date.now() + UNLOCK_MS
    window.sessionStorage.setItem(REVEALED_KEY, String(until))
    window.sessionStorage.setItem(ENTERED_KEY, 'true')
    setRevealedUntil(until)
    setEntered(true)
    setNow(Date.now())
  }, [])

  const openPrompt = useCallback(() => setIsPromptOpen(true), [])
  const closePrompt = useCallback(() => setIsPromptOpen(false), [])

  const value = useMemo<HeartLockerContextValue>(
    () => ({
      isRevealed,
      isUnlocked,
      minutesRemaining: isRevealed
        ? Math.max(1, Math.ceil((revealedUntil - now) / 60000))
        : 0,
      isPromptOpen,
      openPrompt,
      closePrompt,
      reveal,
      hide,
      unlock,
    }),
    [
      isRevealed,
      isUnlocked,
      revealedUntil,
      now,
      isPromptOpen,
      openPrompt,
      closePrompt,
      reveal,
      hide,
      unlock,
    ],
  )

  return <HeartLockerContext.Provider value={value}>{children}</HeartLockerContext.Provider>
}
