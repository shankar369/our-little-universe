import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { softEase } from '../../design/motion'

export type TransitionVariant = 'immersive' | 'unlock' | 'seal' | 'reveal'

type ActiveTransition = { variant: TransitionVariant; id: number }

type CinematicTransitionContextValue = {
  /** Play a full-screen cinematic transition overlay. */
  play: (variant: TransitionVariant) => void
}

const CinematicTransitionContext = createContext<CinematicTransitionContextValue | null>(null)

const durationByVariant: Record<TransitionVariant, number> = {
  immersive: 1050,
  unlock: 1750,
  seal: 850,
  reveal: 900,
}

// A heart centred in a 100×100 box, used for the locker's iris reveal.
const HEART_PATH =
  'M50,86 C 22,64 10,45 10,30 C 10,17 19,9 30,9 C 39,9 46,16 50,23 C 54,16 61,9 70,9 C 81,9 90,17 90,30 C 90,45 78,64 50,86 Z'

const easeIn = [0.5, 0, 0.75, 0] as const
// A smoother accelerate-then-settle for the heart iris opening.
const irisEase = [0.5, 0, 0.22, 1] as const

// eslint-disable-next-line react-refresh/only-export-components
export function useCinematicTransition() {
  const value = useContext(CinematicTransitionContext)
  if (!value) {
    throw new Error('useCinematicTransition must be used within CinematicTransitionProvider')
  }
  return value
}

export function CinematicTransitionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveTransition | null>(null)
  const counter = useRef(0)

  const play = useCallback((variant: TransitionVariant) => {
    counter.current += 1
    setActive({ variant, id: counter.current })
  }, [])

  const value = useMemo(() => ({ play }), [play])

  return (
    <CinematicTransitionContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {active ? (
          <CinematicOverlay
            key={active.id}
            variant={active.variant}
            onDone={() => setActive(null)}
          />
        ) : null}
      </AnimatePresence>
    </CinematicTransitionContext.Provider>
  )
}

function CinematicOverlay({
  variant,
  onDone,
}: {
  variant: TransitionVariant
  onDone: () => void
}) {
  const [reducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const duration = reducedMotion ? 380 : durationByVariant[variant]
    const timer = window.setTimeout(onDone, duration)
    return () => window.clearTimeout(timer)
  }, [variant, reducedMotion, onDone])

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: softEase }}
      className="pointer-events-none fixed inset-0 z-[120] overflow-hidden"
    >
      {reducedMotion ? (
        <ReducedOverlay variant={variant} />
      ) : variant === 'immersive' ? (
        <WarpOverlay />
      ) : variant === 'unlock' ? (
        <HeartPortalOverlay />
      ) : variant === 'reveal' ? (
        <RevealOverlay />
      ) : (
        <SealOverlay />
      )}
    </motion.div>
  )
}

/** A calm, contrast-safe fallback when the viewer prefers reduced motion. */
function ReducedOverlay({ variant }: { variant: TransitionVariant }) {
  const tint =
    variant === 'immersive'
      ? 'radial-gradient(circle, rgba(200,148,252,0.4), transparent 62%)'
      : 'radial-gradient(circle, rgba(247,184,212,0.42), transparent 62%)'
  return (
    <motion.div
      className="absolute inset-0"
      style={{ backgroundImage: tint }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.9, 0] }}
      transition={{ duration: 0.38, times: [0, 0.4, 1] }}
    />
  )
}

// ---------------------------------------------------------------------------
// Immersive — a starfield warp, as if launching into the universe.
// ---------------------------------------------------------------------------

const STREAK_COLORS = ['#f5f0ff', '#c894fc', '#f4d9a6']

function WarpOverlay() {
  const streaks = useMemo(
    () =>
      Array.from({ length: 44 }, (_, index) => ({
        id: index,
        angle: (index / 44) * 360 + (index % 3) * 5,
        length: 30 + (index % 5) * 8,
        width: index % 4 === 0 ? 2.2 : 1.3,
        delay: (index % 6) * 0.018,
        color: STREAK_COLORS[index % 3],
      })),
    [],
  )

  return (
    <>
      {/* Deep-space wash that briefly swallows the edges */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(38,14,70,0.55), rgba(5,2,16,0.92) 72%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.75, 0] }}
        transition={{ duration: 0.95, times: [0, 0.35, 1], ease: softEase }}
      />

      {/* A hot core igniting at the centre */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ filter: 'blur(10px)' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.25, 0.35], opacity: [0, 0.95, 0] }}
        transition={{ duration: 0.55, times: [0, 0.35, 1], ease: 'easeOut' }}
      />

      {/* Light streaks tearing outward */}
      <div className="absolute left-1/2 top-1/2">
        {streaks.map((streak) => (
          <motion.div
            key={streak.id}
            className="absolute rounded-full"
            style={{
              width: streak.width,
              height: `${streak.length}vmax`,
              transformOrigin: 'top center',
              rotate: `${streak.angle}deg`,
              background: `linear-gradient(to bottom, ${streak.color}, transparent)`,
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 0.72, delay: streak.delay, ease: easeIn, times: [0, 0.6, 1] }}
          />
        ))}
      </div>

      {/* Shockwave ring chasing the streaks */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[28vmin] w-[28vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-orchid/40"
        initial={{ scale: 0, opacity: 0.7 }}
        animate={{ scale: 5.5, opacity: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.14, 0] }}
        transition={{ duration: 0.45, times: [0, 0.3, 1] }}
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// Unlock — a glowing heart-shaped iris blooms open onto the locker within.
// ---------------------------------------------------------------------------

function HeartPortalOverlay() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => {
        const angle = (index / 18) * Math.PI * 2 + (index % 3) * 0.5
        const distance = 24 + (index % 5) * 8
        return {
          id: index,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 8,
          size: 13 + (index % 4) * 6,
          delay: 0.35 + (index % 6) * 0.05,
          rotate: index % 2 ? 20 : -20,
          warm: index % 3 === 0,
        }
      }),
    [],
  )

  return (
    <>
      {/* The iris: a night curtain with a heart cut out, opening wide */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id="heart-iris">
            <rect width="100" height="100" fill="white" />
            <motion.path
              d={HEART_PATH}
              fill="black"
              style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
              initial={{ scale: 0.02 }}
              animate={{ scale: 3.4 }}
              transition={{ duration: 1.4, ease: irisEase }}
            />
          </mask>
        </defs>
        <rect width="100" height="100" fill="#070312" mask="url(#heart-iris)" />

        {/* The glowing rim of the opening heart */}
        <motion.path
          d={HEART_PATH}
          fill="none"
          stroke="#f7b8d4"
          strokeWidth="0.9"
          style={{
            transformOrigin: 'center',
            transformBox: 'fill-box',
            filter: 'drop-shadow(0 0 2px rgba(244,217,166,0.9))',
          }}
          initial={{ scale: 0.02, opacity: 0 }}
          animate={{ scale: 3.4, opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, ease: irisEase, times: [0, 0.55, 1] }}
        />
      </svg>

      {/* Warm light welling up from the keyhole */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[55vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(247,184,212,0.55), rgba(244,217,166,0.2) 40%, transparent 66%)',
        }}
        initial={{ scale: 0.15, opacity: 0 }}
        animate={{ scale: [0.15, 1.5], opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.4, times: [0, 0.4, 1], ease: softEase }}
      />

      {/* A golden shimmer sweeping across the secret */}
      <motion.div
        className="absolute -inset-y-1/2 left-1/2 w-[40vmax] -translate-x-1/2 -rotate-[22deg]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, transparent, rgba(244,217,166,0.4), transparent)',
        }}
        initial={{ x: '-130vw', opacity: 0 }}
        animate={{ x: ['-130vw', '130vw'], opacity: [0, 0.9, 0] }}
        transition={{ duration: 1.1, delay: 0.5, ease: softEase }}
      />

      {/* Hearts spilling free */}
      <div className="absolute left-1/2 top-1/2">
        {hearts.map((heart) => (
          <motion.span
            key={heart.id}
            className={heart.warm ? 'absolute text-champagne' : 'absolute text-blush'}
            style={{
              filter: heart.warm
                ? 'drop-shadow(0 0 7px rgba(244,217,166,0.7))'
                : 'drop-shadow(0 0 7px rgba(247,184,212,0.7))',
            }}
            initial={{ x: '0vmin', y: '0vmin', opacity: 0, scale: 0.3, rotate: 0 }}
            animate={{
              x: `${heart.x}vmin`,
              y: `${heart.y}vmin`,
              opacity: [0, 1, 0],
              scale: [0.3, 1, 0.5],
              rotate: heart.rotate,
            }}
            transition={{ duration: 1.25, delay: heart.delay, ease: 'easeOut' }}
          >
            <Heart className="fill-current" style={{ height: heart.size, width: heart.size }} />
          </motion.span>
        ))}
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Reveal — a quiet champagne shimmer as the hidden chapter surfaces.
// ---------------------------------------------------------------------------

function RevealOverlay() {
  const sparks = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        id: index,
        left: `${12 + (index * 71) % 76}%`,
        top: `${18 + (index * 47) % 64}%`,
        size: 3 + (index % 3),
        delay: (index % 5) * 0.06,
      })),
    [],
  )

  return (
    <>
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 60%, rgba(244,217,166,0.16), transparent 60%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.85, times: [0, 0.4, 1], ease: softEase }}
      />
      <motion.div
        className="absolute -inset-y-1/3 left-1/2 w-[36vmax] -translate-x-1/2 -rotate-[20deg]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, transparent, rgba(244,217,166,0.32), transparent)',
        }}
        initial={{ x: '-120vw', opacity: 0 }}
        animate={{ x: ['-120vw', '120vw'], opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.85, ease: softEase }}
      />
      {sparks.map((spark) => (
        <motion.span
          key={spark.id}
          className="absolute rounded-full bg-champagne"
          style={{
            left: spark.left,
            top: spark.top,
            width: spark.size,
            height: spark.size,
            boxShadow: '0 0 8px rgba(244,217,166,0.9)',
          }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 1, 0], scale: [0.3, 1, 0.4] }}
          transition={{ duration: 0.7, delay: spark.delay, ease: 'easeOut' }}
        />
      ))}
    </>
  )
}

// ---------------------------------------------------------------------------
// Seal — the heart iris draws closed again.
// ---------------------------------------------------------------------------

function SealOverlay() {
  return (
    <>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id="heart-seal">
            <rect width="100" height="100" fill="white" />
            <motion.path
              d={HEART_PATH}
              fill="black"
              style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
              initial={{ scale: 3.4 }}
              animate={{ scale: 0.02 }}
              transition={{ duration: 0.75, ease: 'easeInOut' }}
            />
          </mask>
        </defs>
        <rect width="100" height="100" fill="#070312" mask="url(#heart-seal)" />
      </svg>
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-blush drop-shadow-[0_0_18px_rgba(247,184,212,0.7)]"
        initial={{ scale: 1.4, opacity: 0 }}
        animate={{ scale: [1.4, 1, 0.2], opacity: [0, 1, 0] }}
        transition={{ duration: 0.75, times: [0, 0.45, 1], ease: softEase }}
      >
        <Heart className="h-14 w-14 fill-blush/80" />
      </motion.div>
    </>
  )
}
