import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useCinematicTransition } from './CinematicTransition'
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
 * A crafted glass control (bottom-left) that dives the app into real fullscreen
 * with a cinematic warp. Hidden where the Fullscreen API is unavailable.
 */
export function FullscreenToggle() {
  const [supported] = useState(() => {
    const doc = document as VendorDocument
    return Boolean(doc.fullscreenEnabled ?? doc.webkitFullscreenEnabled)
  })
  const [isFullscreen, setIsFullscreen] = useState(() =>
    Boolean(currentFullscreenElement(document as VendorDocument)),
  )
  const { play } = useCinematicTransition()

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
    const doc = document as VendorDocument
    try {
      if (currentFullscreenElement(doc)) {
        await (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.())
      } else {
        const element = document.documentElement as VendorElement
        await (element.requestFullscreen?.() ?? element.webkitRequestFullscreen?.())
      }
    } catch {
      // Denied (no user gesture) or unsupported — leave the state untouched.
    }
  }

  if (!supported) {
    return null
  }

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-50 sm:left-6">
      <Magnetic>
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.06 }}
        onClick={() => {
          play('immersive')
          void toggle()
        }}
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
          <ImmersiveIcon fullscreen={isFullscreen} />
        </span>
      </motion.button>
      </Magnetic>
    </div>
  )
}
