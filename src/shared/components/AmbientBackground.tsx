import { useMemo } from 'react'
import Particles, { ParticlesProvider } from '@tsparticles/react'
import type { ISourceOptions } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'
import { Heart, Sparkles, Zap } from 'lucide-react'
import { motion } from 'motion/react'

const hearts = [
  { id: 0, left: '7%', delay: 0.2, duration: 14, size: 22 },
  { id: 1, left: '88%', delay: 3.1, duration: 16, size: 26 },
  { id: 2, left: '18%', delay: 6.2, duration: 17, size: 20 },
  { id: 3, left: '76%', delay: 8.4, duration: 15, size: 24 },
]

const butterflies = [
  { id: 0, left: '86%', top: '15%', scale: 0.82, delay: 0.8 },
  { id: 1, left: '5%', top: '72%', scale: 0.72, delay: 3.4 },
  { id: 2, left: '78%', top: '68%', scale: 0.62, delay: 5.6 },
]

const lightningBolts = [
  { id: 0, left: '8%', top: '33%', delay: 1.1, rotate: '-18deg' },
  { id: 1, left: '91%', top: '43%', delay: 4.4, rotate: '15deg' },
]

const glints = [
  { id: 0, left: '17%', top: '18%', delay: 0.2 },
  { id: 1, left: '83%', top: '28%', delay: 1.4 },
  { id: 2, left: '24%', top: '83%', delay: 2.7 },
  { id: 3, left: '68%', top: '10%', delay: 3.5 },
  { id: 4, left: '70%', top: '76%', delay: 4.3 },
]

export function AmbientBackground() {
  const particleOptions = useMemo<ISourceOptions>(
    () => ({
      fullScreen: false,
      detectRetina: true,
      fpsLimit: 50,
      particles: {
        number: {
          value: 30,
          density: {
            enable: true,
            width: 390,
            height: 844,
          },
        },
        color: {
          value: ['#f5d0fe', '#c4b5fd', '#fbcfe8', '#fde68a'],
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          value: { min: 0.1, max: 0.42 },
        },
        size: {
          value: { min: 1, max: 3.2 },
        },
        move: {
          enable: true,
          speed: { min: 0.12, max: 0.42 },
          direction: 'top',
          random: true,
          outModes: {
            default: 'out',
          },
        },
        links: {
          enable: true,
          color: '#c4b5fd',
          opacity: 0.035,
          distance: 118,
        },
      },
      responsive: [
        {
          maxWidth: 640,
          options: {
            fpsLimit: 42,
            particles: {
              number: {
                value: 18,
              },
              links: {
                opacity: 0.025,
                distance: 78,
              },
            },
          },
        },
      ],
    }),
    [],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05020a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(126,34,206,0.42),transparent_32%),radial-gradient(circle_at_82%_14%,rgba(244,114,182,0.18),transparent_28%),radial-gradient(circle_at_50%_95%,rgba(88,28,135,0.38),transparent_42%),linear-gradient(145deg,#07030d_0%,#12051c_46%,#030108_100%)]" />
      <div className="absolute inset-x-[-20%] top-[-18%] h-[34rem] rounded-[100%] bg-fuchsia-400/10 blur-3xl" />
      <div className="absolute -right-32 top-24 h-80 w-80 rounded-full bg-violet-300/12 blur-3xl" />
      <div className="absolute -left-28 bottom-6 h-72 w-72 rounded-full bg-rose-300/10 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,.42)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.42)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,1,8,0.2)_48%,rgba(3,1,8,0.78)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,1,8,0.5)_0%,transparent_20%,transparent_80%,rgba(3,1,8,0.5)_100%)]" />

      <ParticlesProvider init={loadSlim}>
        <Particles
          id="memory-particles"
          className="absolute inset-0 opacity-80"
          options={particleOptions}
        />
      </ParticlesProvider>

      <div className="absolute inset-0 motion-reduce:hidden">
        {glints.map((glint) => (
          <motion.div
            key={glint.id}
            aria-hidden="true"
            className="absolute text-amber-100/42 drop-shadow-[0_0_18px_rgba(253,230,138,0.55)]"
            style={{ left: glint.left, top: glint.top }}
            animate={{
              opacity: [0.12, 0.5, 0.12],
              scale: [0.82, 1.12, 0.82],
              rotate: [0, 16, 0],
            }}
            transition={{
              duration: 5.2,
              repeat: Infinity,
              delay: glint.delay,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.div>
        ))}

        {lightningBolts.map((bolt) => (
          <motion.div
            key={bolt.id}
            aria-hidden="true"
            className="absolute text-fuchsia-100/36 drop-shadow-[0_0_22px_rgba(232,121,249,0.52)]"
            style={{
              left: bolt.left,
              top: bolt.top,
              rotate: bolt.rotate,
            }}
            animate={{
              opacity: [0.08, 0.42, 0.12, 0.32, 0.08],
              scale: [0.86, 1.06, 0.94, 1.1, 0.86],
            }}
            transition={{
              duration: 7.2,
              repeat: Infinity,
              delay: bolt.delay,
              ease: 'easeInOut',
            }}
          >
            <Zap className="h-8 w-8 fill-fuchsia-100/12 sm:h-10 sm:w-10" />
          </motion.div>
        ))}

        {butterflies.map((butterfly) => (
          <motion.div
            key={butterfly.id}
            aria-hidden="true"
            className="absolute h-10 w-11 opacity-55 drop-shadow-[0_0_18px_rgba(244,114,182,0.45)] sm:h-12 sm:w-14"
            style={{
              left: butterfly.left,
              top: butterfly.top,
              scale: butterfly.scale,
            }}
            animate={{
              x: [0, 12, -8, 0],
              y: [0, -8, 7, 0],
              rotate: [-5, 7, -2, -5],
            }}
            transition={{
              duration: 11 + butterfly.id,
              repeat: Infinity,
              delay: butterfly.delay,
              ease: 'easeInOut',
            }}
          >
            <span className="absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/58 shadow-[0_0_14px_rgba(253,230,138,0.55)] sm:h-10" />
            <motion.span
              className="absolute left-0 top-0 h-7 w-6 rounded-[80%_20%_75%_30%] bg-gradient-to-br from-fuchsia-100/62 via-rose-100/50 to-amber-100/38 sm:h-9 sm:w-7"
              animate={{ rotateY: [0, 28, 0] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.span
              className="absolute right-0 top-0 h-7 w-6 rounded-[20%_80%_30%_75%] bg-gradient-to-bl from-violet-100/62 via-fuchsia-100/50 to-rose-100/38 sm:h-9 sm:w-7"
              animate={{ rotateY: [0, -28, 0] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="absolute bottom-0 left-1 h-5 w-5 rounded-[70%_25%_65%_35%] bg-gradient-to-br from-rose-100/48 to-fuchsia-100/26 sm:h-6 sm:w-6" />
            <span className="absolute bottom-0 right-1 h-5 w-5 rounded-[25%_70%_35%_65%] bg-gradient-to-bl from-fuchsia-100/48 to-violet-100/26 sm:h-6 sm:w-6" />
          </motion.div>
        ))}

        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            aria-hidden="true"
            className="absolute bottom-[-3rem] text-rose-100/44 drop-shadow-[0_0_18px_rgba(244,114,182,0.54)]"
            style={{ left: heart.left }}
            animate={{
              y: ['0vh', '-112vh'],
              x: [0, heart.id % 2 === 0 ? 18 : -18, 0],
              opacity: [0, 0.52, 0],
              rotate: [0, heart.id % 2 === 0 ? 14 : -14],
            }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              delay: heart.delay,
              ease: 'easeInOut',
            }}
          >
            <Heart
              className="fill-rose-100/18"
              style={{
                height: heart.size,
                width: heart.size,
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
