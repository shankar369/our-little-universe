import { useMemo } from 'react'
import Particles, { ParticlesProvider } from '@tsparticles/react'
import type { ISourceOptions } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'
import { Heart } from 'lucide-react'
import { motion } from 'motion/react'

const defaultWords = ['always', 'us', 'stay', 'home', 'N \u2665 S']

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
]

const butterflies = [
  { id: 0, left: '80%', top: '14%', scale: 0.9, delay: 0.6, driftX: 26, driftY: -18 },
  { id: 1, left: '6%', top: '60%', scale: 0.68, delay: 4.2, driftX: 20, driftY: 14 },
  { id: 2, left: '70%', top: '78%', scale: 0.56, delay: 8.1, driftX: -24, driftY: -12 },
]

function ButterflyMark({ uid, flip = false }: { uid: number; flip?: boolean }) {
  const wingPath =
    'M2 16 C -4 2, -22 -8, -30 2 C -35 9, -28 16, -16 16 C -26 19, -31 30, -22 35 C -13 39, -3 30, 2 20 Z'
  const gradientId = `wing-gradient-${uid}`

  return (
    <svg
      viewBox="-38 -14 76 56"
      className="h-12 w-12 drop-shadow-[0_0_16px_rgba(247,184,212,0.45)]"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e9c8fc" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#f7b8d4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f4d9a6" stopOpacity="0.42" />
        </linearGradient>
      </defs>
      <motion.path
        d={wingPath}
        fill={`url(#${gradientId})`}
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="0.8"
        style={{ transformOrigin: '2px 18px' }}
        animate={{ scaleX: [1, 0.24, 1] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d={wingPath}
        fill={`url(#${gradientId})`}
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="0.8"
        style={{ transformOrigin: '-2px 18px', scaleX: -1 }}
        animate={{ scaleX: [-1, -0.24, -1] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <ellipse cx="0" cy="18" rx="1.7" ry="9" fill="#f4d9a6" opacity="0.9" />
      <path
        d="M-1 9 C -4 4, -7 2, -9 1 M1 9 C 4 4, 7 2, 9 1"
        stroke="rgba(244,217,166,0.8)"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

type AmbientBackgroundProps = {
  words?: string[]
}

export function AmbientBackground({ words = defaultWords }: AmbientBackgroundProps) {
  const particleOptions = useMemo<ISourceOptions>(
    () => ({
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
    }),
    [],
  )

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
        {/* Floating letter fragments */}
        {wordSlots.map((slot) => {
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
              opacity: [0.5, 0.85, 0.6, 0.5],
            }}
            transition={{
              duration: 16 + butterfly.id * 3,
              repeat: Infinity,
              delay: butterfly.delay,
              ease: 'easeInOut',
            }}
          >
            <ButterflyMark uid={butterfly.id} flip={butterfly.id === 1} />
          </motion.div>
        ))}

        {/* Rising hearts — few, small, soft */}
        {hearts.map((heart) => (
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
