import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { softEase } from '../../design/motion'
import { Magnetic } from './Magnetic'

// Safari still ships the webkit-prefixed Fullscreen API.
type VendorDocument = Document & {
  webkitFullscreenElement?: Element | null
  webkitFullscreenEnabled?: boolean
  webkitExitFullscreen?: () => Promise<void> | void
}

type VendorElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}

function currentFullscreenElement(doc: VendorDocument): Element | null {
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/**
 * The blink that makes fullscreen feel smooth. The browser's viewport snap
 * cannot be animated, so the next best thing (the video-player trick) is to
 * hide it: dip the screen to the app's night color, perform the fullscreen
 * switch under the veil, let layout and the canvases settle, then unveil.
 */
const BLINK_IN_MS = 180
const SETTLE_MS = 240
/** Never let a stuck fullscreen promise pin the veil to the screen. */
const FULLSCREEN_TIMEOUT_MS = 900

/** A crafted "frame the universe" glyph — corner brackets around a sparkle. */
function ImmersiveIcon({ fullscreen }: { fullscreen: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[1.15rem] w-[1.15rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {fullscreen ? (
        <>
          <path d="M9 4 V6.2 Q9 9 6.2 9 H4" />
          <path d="M15 4 V6.2 Q15 9 17.8 9 H20" />
          <path d="M20 15 H17.8 Q15 15 15 17.8 V20" />
          <path d="M4 15 H6.2 Q9 15 9 17.8 V20" />
        </>
      ) : (
        <>
          <path d="M4 8 V5.8 Q4 4 5.8 4 H8" />
          <path d="M16 4 H18.2 Q20 4 20 5.8 V8" />
          <path d="M20 16 V18.2 Q20 20 18.2 20 H16" />
          <path d="M8 20 H5.8 Q4 20 4 18.2 V16" />
        </>
      )}
      <path
        d="M12 8.6 L12.85 11.15 L15.4 12 L12.85 12.85 L12 15.4 L11.15 12.85 L8.6 12 L11.15 11.15 Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  )
}

/**
 * A crafted glass control (bottom-left) that dives the app into real
 * fullscreen behind a soft night blink. Hidden where the Fullscreen API is
 * unavailable.
 */
export function FullscreenToggle() {
  const [supported] = useState(() => {
    const doc = document as VendorDocument
    return Boolean(doc.fullscreenEnabled ?? doc.webkitFullscreenEnabled)
  })
  const [isFullscreen, setIsFullscreen] = useState(() =>
    Boolean(currentFullscreenElement(document as VendorDocument)),
  )
  const [blinking, setBlinking] = useState(false)
  const busy = useRef(false)

  useEffect(() => {
    const doc = document as VendorDocument

    function handleChange() {
      setIsFullscreen(Boolean(currentFullscreenElement(doc)))
    }

    document.addEventListener('fullscreenchange', handleChange)
    document.addEventListener('webkitfullscreenchange', handleChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleChange)
      document.removeEventListener('webkitfullscreenchange', handleChange)
    }
  }, [])

  async function toggle() {
    if (busy.current) {
      return
    }
    busy.current = true
    const doc = document as VendorDocument

    // Dip to night first, so the veil is opaque when the viewport snaps.
    setBlinking(true)
    await wait(BLINK_IN_MS + 40)

    try {
      const operation = currentFullscreenElement(doc)
        ? (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.())
        : (() => {
            const element = document.documentElement as VendorElement
            return (
              element.requestFullscreen?.({ navigationUI: 'hide' }) ??
              element.webkitRequestFullscreen?.()
            )
          })()
      // Race a timeout: denied, unsupported, or hung — the blink resolves.
      await Promise.race([Promise.resolve(operation), wait(FULLSCREEN_TIMEOUT_MS)])
    } catch {
      // Denied (no user gesture) or unsupported — the blink still resolves.
    }

    // Let the reflow and canvas resizes finish under the veil.
    await wait(SETTLE_MS)
    setBlinking(false)
    busy.current = false
  }

  if (!supported) {
    return null
  }

  return (
    <>
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-50 sm:left-6">
        <Magnetic>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          onClick={() => void toggle()}
          className="group relative flex h-12 w-12 items-center justify-center rounded-full text-champagne focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
          aria-label={isFullscreen ? 'Exit immersive mode' : 'Enter immersive mode'}
          aria-pressed={isFullscreen}
          title={isFullscreen ? 'Exit immersive mode' : 'Immersive mode'}
        >
          {/* Slow aurora glow breathing behind the glass */}
          <span
            className="pointer-events-none absolute -inset-1 rounded-full bg-[radial-gradient(circle,rgba(200,148,252,0.4),transparent_70%)] blur-md motion-safe:animate-pulse"
          />
          {/* Glass disc with a hair-thin aurora rim */}
          <span className="absolute inset-0 rounded-full bg-plum/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_30px_rgba(2,0,10,0.5)] ring-1 ring-white/12 backdrop-blur-md transition-colors duration-300 group-hover:ring-orchid/40" />
          <span className="relative transition-transform duration-500 group-hover:scale-110">
            {/* The glyph swaps with a little unfurl when the mode flips */}
            <motion.span
              key={isFullscreen ? 'exit' : 'enter'}
              initial={{ opacity: 0, rotate: -50, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: softEase }}
              className="flex"
            >
              <ImmersiveIcon fullscreen={isFullscreen} />
            </motion.span>
          </span>
        </motion.button>
        </Magnetic>
      </div>

      {/* The night blink — covers the viewport snap, absorbs stray clicks */}
      <AnimatePresence>
        {blinking ? (
          <motion.div
            key="fullscreen-blink"
            className="fixed inset-0 z-[140] bg-[#070312]"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: BLINK_IN_MS / 1000, ease: softEase },
            }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: softEase } }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 55%, rgba(200,148,252,0.1), transparent 60%)',
              }}
            />
            <div className="grain-veil" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
