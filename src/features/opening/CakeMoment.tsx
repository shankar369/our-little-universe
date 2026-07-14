import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import confetti from 'canvas-confetti'
import { Heart, Wind } from 'lucide-react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { Link } from 'react-router'
import { siteContent } from '../../content/siteContent'
import { softEase } from '../../design/motion'
import {
  ASSEMBLE_MS,
  BLOW_TOTAL_MS,
  createCakeSpin,
  type CakePhase,
} from './cake/cakeShared'

const BirthdayCakeScene = lazy(() => import('./cake/BirthdayCakeScene'))

/**
 * Act 3 of the opening overture: the cake. The WebGL scene mounts as the act
 * approaches, assembles tier by tier once it holds the viewport, and waits
 * with five burning candles. Blowing them (tap a candle, or the accessible
 * chip) cascades the flames out → confetti + heart balloons + the journey
 * button. Horizontal drags spin the cake; vertical scrolling stays free via
 * `touch-action: pan-y`.
 */

export function CakeMoment({ compact }: { compact: boolean }) {
  const cake = siteContent.hero.cake
  const sectionRef = useRef<HTMLElement>(null)
  const nearView = useInView(sectionRef, { margin: '900px', once: true })
  const inView = useInView(sectionRef, { amount: 0.45, once: true })

  const [storedPhase, setPhase] = useState<CakePhase>('waiting')
  const [hasWished, setHasWished] = useState(false)
  const [showBalloons, setShowBalloons] = useState(false)
  const spinRef = useRef(createCakeSpin())
  const lastPointer = useRef({ x: 0, y: 0 })
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)
  const confettiRef = useRef<confetti.CreateTypes | null>(null)

  // Warm the scene chunk during idle time so the act never shows a loader.
  useEffect(() => {
    const prefetch = () => void import('./cake/BirthdayCakeScene')
    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(prefetch)
      return () => window.cancelIdleCallback(handle)
    }
    const handle = window.setTimeout(prefetch, 2200)
    return () => window.clearTimeout(handle)
  }, [])

  // "assembling" is derived, not stored: the act enters it the moment it
  // holds the viewport, with no synchronous setState inside an effect.
  const phase: CakePhase =
    storedPhase === 'waiting' && inView ? 'assembling' : storedPhase

  useEffect(() => {
    if (phase === 'assembling') {
      const id = window.setTimeout(() => setPhase('lit'), ASSEMBLE_MS)
      return () => window.clearTimeout(id)
    }
    if (phase === 'blowing') {
      const id = window.setTimeout(() => {
        setPhase('wished')
        setHasWished(true)
        setShowBalloons(true)
      }, BLOW_TOTAL_MS)
      return () => window.clearTimeout(id)
    }
    if (phase === 'wished') {
      // Let the balloons fly for a while, then clear the sky.
      const id = window.setTimeout(() => setShowBalloons(false), 16000)
      return () => window.clearTimeout(id)
    }
  }, [phase])

  // The wish lands: pop the confetti (center pop, then two side cannons).
  useEffect(() => {
    if (phase !== 'wished') {
      return
    }
    const canvas = confettiCanvasRef.current
    if (!canvas) {
      return
    }
    if (!confettiRef.current) {
      confettiRef.current = confetti.create(canvas, { resize: true, useWorker: true })
    }
    const fire = confettiRef.current
    const colors = ['#c894fc', '#f7b8d4', '#f4d9a6', '#f5f0ff', '#8fb7ff']
    void fire({
      particleCount: compact ? 80 : 130,
      spread: 78,
      startVelocity: 42,
      origin: { x: 0.5, y: 0.45 },
      colors,
      scalar: 0.95,
      ticks: 240,
      gravity: 0.9,
    })
    const timers = [
      window.setTimeout(() => {
        void fire({
          particleCount: compact ? 45 : 75,
          angle: 60,
          spread: 55,
          startVelocity: 55,
          origin: { x: 0, y: 0.9 },
          colors,
          ticks: 280,
        })
        void fire({
          particleCount: compact ? 45 : 75,
          angle: 120,
          spread: 55,
          startVelocity: 55,
          origin: { x: 1, y: 0.9 },
          colors,
          ticks: 280,
        })
      }, 260),
      window.setTimeout(() => {
        void fire({
          particleCount: compact ? 30 : 55,
          spread: 120,
          startVelocity: 26,
          origin: { x: 0.5, y: 0.3 },
          colors,
          scalar: 0.8,
          gravity: 0.65,
          ticks: 320,
        })
      }, 700),
    ]
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [phase, compact])

  useEffect(() => () => confettiRef.current?.reset(), [])

  function handleCandleTap() {
    setPhase((current) => {
      if (current === 'lit' || current === 'relit') {
        return 'blowing'
      }
      if (current === 'wished') {
        return 'relit'
      }
      return current
    })
  }

  function handleBlowChip() {
    setPhase((current) => (current === 'lit' || current === 'relit' ? 'blowing' : current))
  }

  // Drag-to-spin, written straight into the mutable spin state (no renders).
  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    spinRef.current.dragging = true
    spinRef.current.lastInteraction = performance.now()
    lastPointer.current = { x: event.clientX, y: event.clientY }
  }
  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!spinRef.current.dragging) {
      return
    }
    const dx = event.clientX - lastPointer.current.x
    const dy = event.clientY - lastPointer.current.y
    lastPointer.current = { x: event.clientX, y: event.clientY }
    spinRef.current.target += dx * 0.008
    spinRef.current.tilt += dy * 0.0022
    spinRef.current.lastInteraction = performance.now()
  }
  function onPointerUp() {
    spinRef.current.dragging = false
    spinRef.current.lastInteraction = performance.now()
  }

  const whisper =
    phase === 'wished'
      ? cake.granted
      : phase === 'relit'
        ? cake.relight
        : cake.whisper
  const showStage = phase !== 'waiting'

  return (
    <section ref={sectionRef} className="relative h-svh">
      {/* Soft aura grounding the cake in the sky */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[46svh] w-[min(88vw,34rem)] -translate-x-1/2 -translate-y-[42%] rounded-full bg-orchid/10 blur-3xl"
      />

      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {nearView ? (
          <Suspense fallback={null}>
            <BirthdayCakeScene
              phase={phase}
              spin={spinRef}
              balloons={showBalloons}
              onTapCandle={handleCandleTap}
              compact={compact}
              name={cake.name}
            />
          </Suspense>
        ) : null}
      </div>

      {/* Confetti overlay (canvas-confetti draws here on the wish) */}
      <canvas
        ref={confettiCanvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 h-full w-full motion-reduce:hidden"
      />

      {/* Title + whisper, floating over the scene */}
      <div className="pointer-events-none absolute inset-x-0 top-[max(3rem,env(safe-area-inset-top))] flex flex-col items-center gap-3 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: showStage ? 1 : 0, y: showStage ? 0 : 12 }}
          transition={{ duration: 0.7, ease: softEase }}
          className="type-eyebrow text-champagne/85"
        >
          {cake.eyebrow}
        </motion.p>
        <AnimatePresence mode="wait">
          <motion.p
            key={whisper}
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{
              opacity: showStage ? 1 : 0,
              y: showStage ? 0 : 14,
              filter: 'blur(0px)',
            }}
            exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
            transition={{ duration: 0.6, ease: softEase, delay: showStage ? 0.9 : 0 }}
            className={`type-script type-script--display text-glow max-w-xl ${
              phase === 'wished' ? 'text-blush' : 'text-starlight'
            }`}
          >
            {whisper}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Bottom action: blow chip before the wish, the journey after it */}
      <div className="absolute inset-x-0 bottom-[max(2.5rem,env(safe-area-inset-bottom))] z-30 flex flex-col items-center gap-3 px-6">
        <AnimatePresence mode="wait">
          {hasWished ? (
            <motion.div
              key="journey"
              initial={{ opacity: 0, y: 26, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.75, ease: softEase }}
              className="flex flex-col items-center gap-3"
            >
              <Link
                to="/journey"
                className="btn-primary flex h-14 w-full min-w-[17rem] items-center justify-center gap-2 rounded-2xl px-8 text-base font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
              >
                <Heart className="h-4 w-4 fill-[#2b1048]" />
                {cake.cta}
              </Link>
              <p className="type-quote text-sm text-faint">{cake.note}</p>
            </motion.div>
          ) : (
            <motion.button
              key="blow"
              type="button"
              onClick={handleBlowChip}
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: phase === 'lit' ? 1 : 0,
                y: phase === 'lit' ? 0 : 14,
              }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.55, ease: softEase }}
              className={`glass-chip flex h-11 items-center gap-2 rounded-full px-5 text-sm text-moon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid ${
                phase === 'lit' ? '' : 'pointer-events-none'
              }`}
            >
              <Wind className="h-4 w-4 text-orchid" />
              {cake.blowHint}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

    </section>
  )
}
