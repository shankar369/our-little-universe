import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useLocation, useNavigationType } from 'react-router'
import {
  experienceSections,
  type ExperienceSection,
} from '../../app/experienceRegistry'
import { curtain, softEase } from '../../design/motion'
import { useRichMotion } from '../lib/richMotion'
import { useCinematicTransition } from './CinematicTransition'

const loadVelvetCurtainGL = () => import('./VelvetCurtainGL')
const VelvetCurtainGL = lazy(loadVelvetCurtainGL)

const TOTAL = curtain.close + curtain.hold + curtain.open

// The whispered line above each chapter name on the title card.
const chapterEyebrows: Record<string, string> = {
  opening: 'back to the beginning',
  journey: 'the crossroads',
  'memory-timeline': 'chapter one',
  'photo-universe': 'chapter two',
  'our-little-atlas': 'chapter three',
  museum: 'chapter four',
  'heart-locker': 'the hidden chapter',
}

type ActiveSweep = {
  key: string
  section: ExperienceSection | undefined
  dir: 1 | -1
}

/**
 * The chapter curtain: on route changes a soft velvet veil sweeps across the
 * screen, shows the chapter's name for a beat, then parts to reveal the page.
 * Location-driven, so browser back/forward work for free (back reverses the
 * sweep). Never plays on first load, under reduced motion, or right after a
 * cinematic overlay (the heart-iris owns those navigations).
 */
export function ChapterCurtain() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const reduceMotion = useReducedMotion()
  const { lastPlayedAt } = useCinematicTransition()
  const [active, setActive] = useState<ActiveSweep | null>(null)
  // Initialised to the current path so the curtain never plays on first load.
  const prevPath = useRef(location.pathname)

  // Warm the silk-shader chunk while the page idles so the first navigation
  // gets the WebGL veil rather than the DOM fallback.
  useEffect(() => {
    if (reduceMotion) {
      return
    }
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200))
    const cancel = window.cancelIdleCallback ?? window.clearTimeout
    const handle = idle(() => void loadVelvetCurtainGL())
    return () => cancel(handle as number)
  }, [reduceMotion])

  useEffect(() => {
    if (location.pathname === prevPath.current) {
      return
    }
    prevPath.current = location.pathname

    if (reduceMotion || Date.now() - lastPlayedAt() < 1500) {
      return
    }

    const sweep: ActiveSweep = {
      key: location.key,
      section: experienceSections.find(
        (candidate) => candidate.path === location.pathname,
      ),
      dir: navigationType === 'POP' ? -1 : 1,
    }

    // Deferred so the state change happens outside the effect body.
    const startTimer = window.setTimeout(() => setActive(sweep), 0)
    return () => window.clearTimeout(startTimer)
  }, [location, navigationType, reduceMotion, lastPlayedAt])

  // The sweep dismisses itself once the veil has fully passed.
  useEffect(() => {
    if (!active) {
      return
    }
    const timer = window.setTimeout(() => setActive(null), TOTAL * 1000 + 80)
    return () => window.clearTimeout(timer)
  }, [active])

  return (
    <AnimatePresence>
      {active ? <CurtainSweep key={active.key} sweep={active} /> : null}
    </AnimatePresence>
  )
}

function CurtainSweep({ sweep }: { sweep: ActiveSweep }) {
  const { section, dir } = sweep
  const Icon = section?.icon
  const { rich } = useRichMotion()

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[100] overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
    >
      {/* The veil: silk shader when the device allows it; the DOM gradient
          otherwise (and while the shader chunk is still on its way). */}
      {rich ? (
        <Suspense fallback={<DomVeil dir={dir} />}>
          <VelvetCurtainGL dir={dir} />
        </Suspense>
      ) : (
        <DomVeil dir={dir} />
      )}

      {/* Title card — a breath of chapter name while the veil holds */}
      {section ? (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1, 1, 0], y: [10, 10, 0, 0, -8] }}
          transition={{ duration: TOTAL, times: [0, 0.22, 0.4, 0.68, 0.88] }}
        >
          {Icon ? (
            <span className="glass-chip flex h-12 w-12 items-center justify-center rounded-full text-champagne">
              <Icon className="h-5 w-5" />
            </span>
          ) : null}
          <div>
            <p className="type-eyebrow mb-2 text-faint">
              {chapterEyebrows[section.id] ?? 'somewhere new'}
            </p>
            <p className="type-script type-script--display text-glow text-starlight">
              {section.label}
            </p>
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  )
}

/** The original DOM veil — fallback material for the silk shader. */
function DomVeil({ dir }: { dir: 1 | -1 }) {
  // One continuous velvet breath: the layer enters, pauses full-cover, leaves.
  const from = dir === 1 ? '-200vw' : '100vw'
  const to = dir === 1 ? '100vw' : '-200vw'
  const times = [0, curtain.close / TOTAL, (curtain.close + curtain.hold) / TOTAL, 1]

  return (
    <motion.div
      className="absolute inset-y-0 w-[200vw]"
      style={{
        background:
          'linear-gradient(100deg, transparent 0%, #070312 12%, #0e0620 50%, #1c0d33ee 88%, transparent 100%)',
      }}
      initial={{ x: from }}
      animate={{ x: [from, '-50vw', '-50vw', to] }}
      transition={{ duration: TOTAL, times, ease: [softEase, 'linear', softEase] }}
    >
      {/* Leading-edge aurora hairline */}
      <div
        className="absolute inset-y-0 w-[2px]"
        style={{
          left: dir === 1 ? '88%' : '12%',
          background:
            'linear-gradient(180deg, rgba(247,184,212,0.7), rgba(200,148,252,0.85), rgba(244,217,166,0.7))',
          boxShadow: '0 0 18px rgba(200,148,252,0.55)',
        }}
      />
      <div className="grain-veil" />
    </motion.div>
  )
}
