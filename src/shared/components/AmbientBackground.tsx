import { useEffect, useState } from 'react'
import Particles, { ParticlesProvider } from '@tsparticles/react'
import type { ISourceOptions } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'
import { Heart } from 'lucide-react'
import { motion } from 'motion/react'

const defaultWords = ['always', 'us', 'stay', 'home', 'N ♥ S']

type FloatingWord = {
  id: number
  left: string
  top: string
  size: number
  delay: number
  duration: number
  rotate: number
}

const wordSlots: FloatingWord[] = [
  { id: 0, left: '6%', top: '12%', size: 22, delay: 0.4, duration: 17, rotate: -8 },
  { id: 1, left: '82%', top: '8%', size: 17, delay: 3.6, duration: 21, rotate: 6 },
  { id: 2, left: '88%', top: '58%', size: 19, delay: 6.8, duration: 19, rotate: -5 },
  { id: 3, left: '10%', top: '76%', size: 16, delay: 2.2, duration: 23, rotate: 7 },
  { id: 4, left: '46%', top: '88%', size: 21, delay: 8.4, duration: 18, rotate: -4 },
]

const hearts = [
  { id: 0, left: '12%', delay: 1.2, duration: 22, size: 15 },
  { id: 1, left: '84%', delay: 7.5, duration: 26, size: 18 },
  { id: 2, left: '38%', delay: 13.4, duration: 24, size: 13 },
  { id: 3, left: '64%', delay: 18.2, duration: 25, size: 16 },
  { id: 4, left: '26%', delay: 4.6, duration: 28, size: 11 },
  { id: 5, left: '92%', delay: 21.8, duration: 23, size: 14 },
  { id: 6, left: '50%', delay: 10.4, duration: 27, size: 19 },
]

const butterflies = [
  { id: 0, left: '80%', top: '14%', scale: 0.9, delay: 0.6, driftX: 26, driftY: -18 },
  { id: 1, left: '6%', top: '60%', scale: 0.68, delay: 4.2, driftX: 20, driftY: 14 },
  { id: 2, left: '70%', top: '78%', scale: 0.56, delay: 8.1, driftX: -24, driftY: -12 },
]

// Brand monograms — N, S and the N♥S sigil — drifting like quiet initials carved
// into the sky. Kept few and low-opacity so they whisper instead of shouting.
type Monogram = {
  id: number
  kind: 'N' | 'S' | 'NS'
  left: string
  top: string
  size: number
  delay: number
  duration: number
  rotate: number
  tint: string
}

const monograms: Monogram[] = [
  { id: 0, kind: 'N', left: '16%', top: '30%', size: 64, delay: 1.4, duration: 26, rotate: -10, tint: 'text-orchid' },
  { id: 1, kind: 'S', left: '78%', top: '38%', size: 58, delay: 6.2, duration: 30, rotate: 8, tint: 'text-blush' },
  { id: 2, kind: 'NS', left: '40%', top: '20%', size: 30, delay: 3.1, duration: 24, rotate: -3, tint: 'text-champagne' },
  { id: 3, kind: 'NS', left: '60%', top: '70%', size: 26, delay: 11.5, duration: 28, rotate: 5, tint: 'text-orchid' },
  { id: 4, kind: 'N', left: '30%', top: '62%', size: 44, delay: 8.8, duration: 32, rotate: 6, tint: 'text-champagne' },
]

// A handful of four-point sparkle stars that twinkle in place.
const sparkles = [
  { id: 0, left: '22%', top: '22%', size: 14, delay: 0.5, duration: 4.2 },
  { id: 1, left: '70%', top: '18%', size: 10, delay: 2.1, duration: 5.1 },
  { id: 2, left: '86%', top: '46%', size: 16, delay: 3.4, duration: 4.6 },
  { id: 3, left: '14%', top: '54%', size: 11, delay: 1.6, duration: 5.4 },
  { id: 4, left: '52%', top: '34%', size: 9, delay: 4.0, duration: 4.0 },
  { id: 5, left: '64%', top: '60%', size: 13, delay: 2.8, duration: 5.0 },
]

// Rare diagonal streaks crossing the night.
const shootingStars = [
  { id: 0, top: '16%', left: '-12%', length: 160, angle: 18, delay: 4, repeatDelay: 13, duration: 1.5 },
  { id: 1, top: '54%', left: '-12%', length: 120, angle: 24, delay: 12, repeatDelay: 19, duration: 1.7 },
]

function Sparkle({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className="text-champagne drop-shadow-[0_0_8px_rgba(244,217,166,0.6)]"
    >
      <path
        d="M12 0 C13 7 17 11 24 12 C17 13 13 17 12 24 C11 17 7 13 0 12 C7 11 11 7 12 0 Z"
        fill="currentColor"
      />
    </svg>
  )
}

function MonogramMark({ kind, tint }: { kind: Monogram['kind']; tint: string }) {
  if (kind === 'NS') {
    return (
      <span className={`type-quote inline-flex items-center gap-[0.18em] ${tint}`}>
        N
        <Heart className="fill-current" style={{ height: '0.62em', width: '0.62em' }} />
        S
      </span>
    )
  }

  return <span className={`type-quote ${tint}`}>{kind}</span>
}

// One symmetric butterfly. Each wing pair lives in its own group that flaps by
// scaling toward the body axis; `transform-box: fill-box` anchors the fold to the
// group's inner edge, so both sides stay perfectly aligned to the body.
const upperWing = 'M0,-3 C 4,-17 16,-20 20,-11 C 22.5,-5.5 15,-1 2,0.5 Z'
const lowerWing = 'M1.5,1.5 C 12,2.5 18,8 15.5,15 C 13.5,20.5 5,17 0.5,4 Z'

function ButterflyMark({ uid }: { uid: number }) {
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

      {/* Right wing pair */}
      <motion.g
        style={{ transformOrigin: 'left center', transformBox: 'fill-box' }}
        {...flap}
      >
        {wings}
      </motion.g>

      {/* Left wing pair — mirror of the right, flapping in sync */}
      <g transform="scale(-1 1)">
        <motion.g
          style={{ transformOrigin: 'left center', transformBox: 'fill-box' }}
          {...flap}
        >
          {wings}
        </motion.g>
      </g>

      {/* Body, head, antennae */}
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

const particleOptions: ISourceOptions = {
  fullScreen: false,
  detectRetina: true,
  fpsLimit: 48,
  particles: {
    number: {
      value: 26,
      density: {
        enable: true,
        width: 390,
        height: 844,
      },
    },
    color: {
      value: ['#e9c8fc', '#c9bce6', '#f7b8d4', '#f4d9a6'],
    },
    shape: {
      type: 'circle',
    },
    opacity: {
      value: { min: 0.08, max: 0.5 },
      animation: {
        enable: true,
        speed: 0.4,
        sync: false,
      },
    },
    size: {
      value: { min: 0.8, max: 2.6 },
    },
    move: {
      enable: true,
      speed: { min: 0.08, max: 0.3 },
      direction: 'top',
      random: true,
      outModes: {
        default: 'out',
      },
    },
  },
  responsive: [
    {
      maxWidth: 640,
      options: {
        fpsLimit: 40,
        particles: {
          number: {
            value: 16,
          },
        },
      },
    },
  ],
}

type AmbientBackgroundProps = {
  words?: string[]
}

export function AmbientBackground({ words = defaultWords }: AmbientBackgroundProps) {
  const isCompact = useCompactViewport()

  // Phones carry a slimmer cast of decoration to protect battery and scroll perf.
  const activeWords = isCompact ? wordSlots.slice(0, 3) : wordSlots
  const activeHearts = isCompact ? hearts.slice(0, 4) : hearts
  const activeMonograms = isCompact ? monograms.slice(0, 2) : monograms
  const activeSparkles = isCompact ? sparkles.slice(0, 3) : sparkles
  const activeShootingStars = isCompact ? shootingStars.slice(0, 1) : shootingStars

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-night">
      {/* Deep nebula base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_16%,rgba(108,38,182,0.34),transparent_36%),radial-gradient(circle_at_80%_10%,rgba(214,98,166,0.14),transparent_30%),radial-gradient(circle_at_52%_98%,rgba(74,24,128,0.36),transparent_46%),linear-gradient(150deg,#0a0418_0%,#140726_48%,#050210_100%)]" />

      {/* Aurora drift (CSS animation; halted by the global reduced-motion rule) */}
      <div className="animate-aurora-slow absolute -left-[18%] -top-[12%] h-[42rem] w-[42rem] rounded-full bg-orchid/14 blur-3xl" />
      <div className="animate-aurora-fast absolute -right-[14%] top-[28%] h-[34rem] w-[34rem] rounded-full bg-blush/10 blur-3xl" />
      <div className="animate-aurora-slow absolute -bottom-[16%] left-[22%] h-[36rem] w-[36rem] rounded-full bg-[#5b21b6]/16 blur-3xl" />

      {/* Starfield — slow rising dust, no link lines */}
      <ParticlesProvider init={loadSlim}>
        <Particles
          id="memory-particles"
          className="absolute inset-0 opacity-90"
          options={particleOptions}
        />
      </ParticlesProvider>

      <div className="absolute inset-0 motion-reduce:hidden">
        {/* Twinkling sparkle stars */}
        {activeSparkles.map((sparkle) => (
          <motion.div
            key={`sparkle-${sparkle.id}`}
            aria-hidden="true"
            className="absolute"
            style={{ left: sparkle.left, top: sparkle.top }}
            animate={{
              opacity: [0, 0.5, 0.12, 0.5, 0],
              scale: [0.6, 1, 0.75, 1, 0.6],
              rotate: [0, 35, 0],
            }}
            transition={{
              duration: sparkle.duration,
              repeat: Infinity,
              delay: sparkle.delay,
              ease: 'easeInOut',
            }}
          >
            <Sparkle size={sparkle.size} />
          </motion.div>
        ))}

        {/* Shooting stars — rare diagonal streaks */}
        {activeShootingStars.map((star) => (
          <motion.div
            key={`shooting-${star.id}`}
            aria-hidden="true"
            className="absolute h-px origin-left rounded-full"
            style={{
              top: star.top,
              left: star.left,
              width: star.length,
              rotate: `${star.angle}deg`,
              background:
                'linear-gradient(90deg, transparent, rgba(245,240,255,0.9) 70%, rgba(244,217,166,0.95))',
              boxShadow: '0 0 8px rgba(245,240,255,0.6)',
            }}
            animate={{
              x: ['0vw', '120vw'],
              y: ['0vh', '46vh'],
              opacity: [0, 0, 1, 1, 0],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              repeatDelay: star.repeatDelay,
              delay: star.delay,
              ease: 'easeIn',
              times: [0, 0.05, 0.2, 0.75, 1],
            }}
          />
        ))}

        {/* Drifting brand monograms — N · S · N♥S */}
        {activeMonograms.map((monogram) => (
          <motion.div
            key={`monogram-${monogram.id}`}
            aria-hidden="true"
            className="absolute font-display font-light not-italic"
            style={{
              left: monogram.left,
              top: monogram.top,
              fontSize: monogram.size,
              rotate: `${monogram.rotate}deg`,
              filter: 'drop-shadow(0 0 26px rgba(200,148,252,0.4))',
            }}
            animate={{
              y: [0, -18, 8, 0],
              opacity: [0.07, 0.2, 0.12, 0.07],
            }}
            transition={{
              duration: monogram.duration,
              repeat: Infinity,
              delay: monogram.delay,
              ease: 'easeInOut',
            }}
          >
            <MonogramMark kind={monogram.kind} tint={monogram.tint} />
          </motion.div>
        ))}

        {/* Floating letter fragments */}
        {activeWords.map((slot) => {
          const word = words[slot.id % words.length]

          return (
            <motion.span
              key={slot.id}
              aria-hidden="true"
              className="type-quote absolute text-moon"
              style={{
                left: slot.left,
                top: slot.top,
                fontSize: slot.size,
                rotate: `${slot.rotate}deg`,
                textShadow: '0 0 22px rgba(200,148,252,0.35)',
              }}
              animate={{
                y: [0, -14, 6, 0],
                opacity: [0.1, 0.26, 0.16, 0.1],
              }}
              transition={{
                duration: slot.duration,
                repeat: Infinity,
                delay: slot.delay,
                ease: 'easeInOut',
              }}
            >
              {word}
            </motion.span>
          )
        })}

        {/* Butterflies */}
        {butterflies.map((butterfly) => (
          <motion.div
            key={butterfly.id}
            aria-hidden="true"
            className="absolute"
            style={{
              left: butterfly.left,
              top: butterfly.top,
              scale: butterfly.scale,
            }}
            animate={{
              x: [0, butterfly.driftX, butterfly.driftX * 0.3, 0],
              y: [0, butterfly.driftY, butterfly.driftY * -0.4, 0],
              rotate: [-6, 5, -3, -6],
              opacity: [0.42, 0.72, 0.52, 0.42],
            }}
            transition={{
              duration: 16 + butterfly.id * 3,
              repeat: Infinity,
              delay: butterfly.delay,
              ease: 'easeInOut',
            }}
          >
            <ButterflyMark uid={butterfly.id} />
          </motion.div>
        ))}

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
              style={{
                height: heart.size,
                width: heart.size,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Vignette — grounds the edges so foreground content reads clearly */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,2,16,0.25)_52%,rgba(5,2,16,0.8)_100%)]" />
    </div>
  )
}
