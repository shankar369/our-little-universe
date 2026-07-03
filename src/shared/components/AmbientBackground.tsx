import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import {
  CONSTELLATION_N,
  CONSTELLATION_S,
  CONSTELLATION_SIGIL,
  LETTER_VIEWBOX,
  SIGIL_VIEWBOX,
} from './constellationData'
import { ConstellationGlyph } from './ConstellationGlyph'

/**
 * The Constellation Sky — a calm night with the initials written in stars.
 * Layers (bottom → top): nebula base · one aurora blob · seeded star field ·
 * N / S / N♥S constellations · a few romantic extras · grain · vignette.
 * Everything after mount is CSS/compositor work; no particle engine.
 */

// --- Seeded star field (deterministic, no render jitter) -------------------

const STAR_PALETTE = ['#e9c8fc', '#c9bce6', '#f7b8d4', '#f4d9a6', '#f5f0ff']

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type SkyStar = {
  x: number
  y: number
  r: number
  opacity: number
  color: string
  twinkle: boolean
  duration: number
  delay: number
}

const skyStars: SkyStar[] = (() => {
  const random = mulberry32(20240607)
  return Array.from({ length: 90 }, (_, index) => ({
    x: random() * 100,
    y: random() * 100,
    r: 0.5 + random() * 0.8,
    opacity: 0.15 + random() * 0.35,
    color: STAR_PALETTE[Math.floor(random() * STAR_PALETTE.length)],
    twinkle: index % 3 === 0,
    duration: 3.5 + random() * 2.5,
    delay: random() * 4,
  }))
})()

// --- Romantic extras (kept deliberately sparse) -----------------------------

const hearts = [
  { id: 0, left: '14%', delay: 2, duration: 24, size: 14 },
  { id: 1, left: '78%', delay: 13, duration: 27, size: 17 },
]

const shootingStar = { top: '18%', left: '-12%', length: 150, angle: 20 }

function ButterflyMark({ uid }: { uid: number }) {
  const upperWing = 'M0,-3 C 4,-17 16,-20 20,-11 C 22.5,-5.5 15,-1 2,0.5 Z'
  const lowerWing = 'M1.5,1.5 C 12,2.5 18,8 15.5,15 C 13.5,20.5 5,17 0.5,4 Z'
  const gradientId = `wing-gradient-${uid}`
  const flap = {
    animate: { scaleX: [1, 0.34, 1] },
    transition: {
      duration: 1.9,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay: uid * 0.4,
    },
  }
  const wings = (
    <>
      <path d={upperWing} fill={`url(#${gradientId})`} stroke="rgba(255,255,255,0.28)" strokeWidth="0.4" />
      <path d={lowerWing} fill={`url(#${gradientId})`} stroke="rgba(255,255,255,0.28)" strokeWidth="0.4" />
    </>
  )

  return (
    <svg
      viewBox="-24 -23 48 50"
      className="h-11 w-11 drop-shadow-[0_0_13px_rgba(247,184,212,0.4)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e9c8fc" stopOpacity="0.82" />
          <stop offset="55%" stopColor="#f7b8d4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f4d9a6" stopOpacity="0.44" />
        </linearGradient>
      </defs>
      <motion.g style={{ transformOrigin: 'left center', transformBox: 'fill-box' }} {...flap}>
        {wings}
      </motion.g>
      <g transform="scale(-1 1)">
        <motion.g style={{ transformOrigin: 'left center', transformBox: 'fill-box' }} {...flap}>
          {wings}
        </motion.g>
      </g>
      <ellipse cx="0" cy="1" rx="1.3" ry="12" fill="#f4d9a6" opacity="0.85" />
      <circle cx="0" cy="-11" r="1.9" fill="#f4d9a6" opacity="0.9" />
      <path
        d="M0,-12 C -2.5,-16 -4.5,-18.5 -7,-20.5"
        stroke="#f4d9a6"
        strokeWidth="0.7"
        fill="none"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M0,-12 C 2.5,-16 4.5,-18.5 7,-20.5"
        stroke="#f4d9a6"
        strokeWidth="0.7"
        fill="none"
        strokeLinecap="round"
        opacity="0.75"
      />
      <circle cx="-7" cy="-20.5" r="0.9" fill="#f4d9a6" opacity="0.8" />
      <circle cx="7" cy="-20.5" r="0.9" fill="#f4d9a6" opacity="0.8" />
    </svg>
  )
}

/** Tracks a coarse "compact" breakpoint so phones get a lighter decoration load. */
function useCompactViewport() {
  const [isCompact, setIsCompact] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(max-width: 640px)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(max-width: 640px)')

    function handleChange() {
      setIsCompact(query.matches)
    }

    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  return isCompact
}

type ConstellationPlacement = {
  id: string
  parts: typeof CONSTELLATION_N
  viewBox: string
  className: string
  drift: { x: number[]; y: number[]; duration: number }
  compact: boolean
}

const constellations: ConstellationPlacement[] = [
  {
    id: 'n',
    parts: CONSTELLATION_N,
    viewBox: LETTER_VIEWBOX,
    className: 'absolute left-[10%] top-[22%] w-[7.5rem] -rotate-6 sm:left-[14%] sm:w-[8.5rem]',
    drift: { x: [0, 8, 0], y: [0, -14, 6, 0], duration: 52 },
    compact: true,
  },
  {
    id: 's',
    parts: CONSTELLATION_S,
    viewBox: LETTER_VIEWBOX,
    className: 'absolute right-[12%] top-[44%] w-[7.5rem] rotate-5',
    drift: { x: [0, -10, 0], y: [0, 10, -6, 0], duration: 64 },
    compact: false,
  },
  {
    id: 'sigil',
    parts: CONSTELLATION_SIGIL,
    viewBox: SIGIL_VIEWBOX,
    className: 'absolute left-[48%] top-[74%] w-[10rem] -rotate-2 sm:left-[58%] sm:w-[11rem]',
    drift: { x: [0, 6, 0], y: [0, -10, 4, 0], duration: 70 },
    compact: true,
  },
]

export function AmbientBackground() {
  const isCompact = useCompactViewport()
  const reduceMotion = useReducedMotion()

  const activeStars = isCompact ? skyStars.slice(0, 50) : skyStars
  const activeHearts = isCompact ? hearts.slice(0, 1) : hearts
  const activeConstellations = isCompact
    ? constellations.filter((constellation) => constellation.compact)
    : constellations

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-night">
      {/* Nebula base — one quiet orchid bloom on the diagonal night */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_16%,rgba(108,38,182,0.3),transparent_40%),linear-gradient(150deg,#0a0418_0%,#140726_48%,#050210_100%)]" />

      {/* One slow aurora */}
      <div className="animate-aurora-slow absolute -left-[18%] -top-[12%] h-[42rem] w-[42rem] rounded-full bg-orchid/16 blur-3xl" />

      {/* Seeded star field — replaces the particle engine entirely */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        {activeStars.map((star, index) => (
          <circle
            key={index}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.r}
            fill={star.color}
            opacity={star.opacity}
            className={star.twinkle ? 'star-twinkle' : undefined}
            style={
              star.twinkle
                ? {
                    animationDuration: `${star.duration}s`,
                    animationDelay: `${star.delay}s`,
                  }
                : undefined
            }
          />
        ))}
      </svg>

      {/* The initials, written in stars */}
      {activeConstellations.map((constellation) => (
        <motion.div
          key={constellation.id}
          className={`${constellation.className} opacity-55`}
          animate={
            reduceMotion
              ? undefined
              : { x: constellation.drift.x, y: constellation.drift.y }
          }
          transition={{
            duration: constellation.drift.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ConstellationGlyph
            parts={constellation.parts}
            viewBox={constellation.viewBox}
            className="h-auto w-full"
          />
        </motion.div>
      ))}

      {/* Romantic extras — deliberately sparse */}
      <div className="absolute inset-0 motion-reduce:hidden">
        {!isCompact ? (
          <motion.div
            aria-hidden="true"
            className="absolute left-[76%] top-[16%]"
            animate={{
              x: [0, 26, 8, 0],
              y: [0, -18, 7, 0],
              rotate: [-6, 5, -3, -6],
              opacity: [0.4, 0.68, 0.5, 0.4],
            }}
            transition={{ duration: 19, repeat: Infinity, delay: 0.6, ease: 'easeInOut' }}
          >
            <ButterflyMark uid={0} />
          </motion.div>
        ) : null}

        {/* A rare shooting star */}
        <motion.div
          aria-hidden="true"
          className="absolute h-px origin-left rounded-full"
          style={{
            top: shootingStar.top,
            left: shootingStar.left,
            width: shootingStar.length,
            rotate: `${shootingStar.angle}deg`,
            background:
              'linear-gradient(90deg, transparent, rgba(245,240,255,0.9) 70%, rgba(244,217,166,0.95))',
            boxShadow: '0 0 8px rgba(245,240,255,0.6)',
          }}
          animate={{
            x: ['0vw', '120vw'],
            y: ['0vh', '44vh'],
            opacity: [0, 0, 1, 1, 0],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            repeatDelay: 26,
            delay: 7,
            ease: 'easeIn',
            times: [0, 0.05, 0.2, 0.75, 1],
          }}
        />

        {/* Rising hearts — few, small, soft */}
        {activeHearts.map((heart) => (
          <motion.div
            key={heart.id}
            aria-hidden="true"
            className="absolute bottom-[-2.5rem] text-blush/45 drop-shadow-[0_0_14px_rgba(247,184,212,0.4)]"
            style={{ left: heart.left }}
            animate={{
              y: ['0vh', '-114vh'],
              x: [0, heart.id % 2 === 0 ? 16 : -16, 0],
              opacity: [0, 0.38, 0],
              rotate: [0, heart.id % 2 === 0 ? 12 : -12],
            }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              delay: heart.delay,
              ease: 'easeInOut',
            }}
          >
            <Heart
              className="fill-blush/15"
              style={{ height: heart.size, width: heart.size }}
            />
          </motion.div>
        ))}
      </div>

      {/* Film grain */}
      <div className="grain-veil" />

      {/* Vignette — grounds the edges so foreground content reads clearly */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,2,16,0.25)_52%,rgba(5,2,16,0.8)_100%)]" />
    </div>
  )
}
