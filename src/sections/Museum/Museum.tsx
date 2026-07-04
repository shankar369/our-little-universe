import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { DoorOpen, Sparkles } from 'lucide-react'
import { appConfig } from '../../app/appConfig'
import { getMuseumPhotos } from '../../content/museumGallery'
import { museumContent } from '../../content/museum'
import { riseIn, softEase } from '../../design/motion'
import { useRichMotion } from '../../shared/lib/richMotion'
import { buildMuseumLayout } from './museumLayout'
import { GalleryScene } from './gallery/GalleryScene'
import { MuseumGate } from './MuseumGate'
import { MuseumHud } from './MuseumHud'
import type { MuseumPhase, PhotoSize } from './museumTypes'
import { useMuseumInput } from './useMuseumInput'

const UNLOCK_KEY = appConfig.storageKeys.museumUnlocked

/**
 * The mUSeum — a first-person private gallery. You arrive on the porch at
 * night, whisper the password, the doors swing open, and you walk a velvet
 * hall hung with the photos of us. Tap any exhibit to step right up to it.
 */
export function Museum() {
  const { rich, compact } = useRichMotion()
  const photos = useMemo(() => getMuseumPhotos(), [])
  const layout = useMemo(() => buildMuseumLayout(photos.length), [photos.length])

  const [unlocked, setUnlocked] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.sessionStorage.getItem(UNLOCK_KEY) === 'true',
  )
  const [phase, setPhase] = useState<MuseumPhase>('entrance')
  const [gateOpen, setGateOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const photoSizes = useRef<Record<number, PhotoSize>>({})

  const input = useMuseumInput(phase === 'inside' && focusedIndex === null)

  const handleMeasured = useCallback((index: number, size: PhotoSize) => {
    photoSizes.current[index] = size
  }, [])

  function handleEnter() {
    if (unlocked) {
      setPhase('opening')
    } else {
      setGateOpen(true)
    }
  }

  function handleUnlocked() {
    window.sessionStorage.setItem(UNLOCK_KEY, 'true')
    setUnlocked(true)
    setGateOpen(false)
    setPhase('opening')
  }

  const handleDollyDone = useCallback(() => setPhase('inside'), [])
  const handleSelect = useCallback((index: number) => setFocusedIndex(index), [])
  const handleStepBack = useCallback(() => setFocusedIndex(null), [])
  const handleMissed = useCallback(() => {
    setFocusedIndex((current) => (current === null ? current : null))
  }, [])

  // Escape steps back from a focused photo.
  useEffect(() => {
    if (focusedIndex === null) {
      return
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setFocusedIndex(null)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [focusedIndex])

  if (!rich) {
    return (
      <MuseumFallback
        photos={photos}
        unlocked={unlocked}
        onUnlocked={handleUnlocked}
      />
    )
  }

  return (
    <main className="relative h-svh w-full overflow-hidden text-starlight">
      {/* The world — drag anywhere on it to look around */}
      <div
        {...input.lookHandlers}
        className="absolute inset-0"
        style={{ touchAction: 'none' }}
      >
        <GalleryScene
          photos={photos}
          layout={layout}
          phase={phase}
          input={input}
          focusedIndex={focusedIndex}
          onSelect={handleSelect}
          onMeasured={handleMeasured}
          photoSizes={photoSizes}
          onDollyDone={handleDollyDone}
          onMissed={handleMissed}
          compact={compact}
        />
      </div>

      {/* Porch overlay — the invitation */}
      <AnimatePresence>
        {phase === 'entrance' ? (
          <motion.div
            exit={{ opacity: 0, transition: { duration: 0.7, ease: softEase } }}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-5 px-6 pb-[max(3.5rem,env(safe-area-inset-bottom))] text-center"
          >
            <motion.div {...riseIn} className="night-veil">
              <div className="mb-3 inline-flex items-center gap-2.5 text-champagne/85">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="type-eyebrow">{museumContent.eyebrow}</span>
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <p className="type-quote mx-auto max-w-sm text-pretty text-base leading-7 text-moon">
                {museumContent.intro}
              </p>
            </motion.div>
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: softEase }}
              whileTap={{ scale: 0.985 }}
              onClick={handleEnter}
              className="btn-primary pointer-events-auto flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
            >
              <DoorOpen className="h-4 w-4" />
              {unlocked ? 'Step inside' : museumContent.enterCta}
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <MuseumGate
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        onUnlocked={handleUnlocked}
      />

      <MuseumHud
        visible={phase === 'inside'}
        compact={compact}
        moveRef={input.stickRef}
        focusedIndex={focusedIndex}
        photoCount={photos.length}
        onStepBack={handleStepBack}
      />
    </main>
  )
}

/**
 * The still museum: without WebGL (or with reduced motion) the gallery hangs
 * itself as a quiet grid behind the same doors and the same password.
 */
function MuseumFallback({
  photos,
  unlocked,
  onUnlocked,
}: {
  photos: string[]
  unlocked: boolean
  onUnlocked: () => void
}) {
  const [gateOpen, setGateOpen] = useState(false)
  const [inside, setInside] = useState(unlocked)

  return (
    <main className="relative min-h-svh px-6 py-[max(4rem,env(safe-area-inset-top))] text-starlight">
      {inside ? (
        <section className="mx-auto max-w-3xl">
          <div className="night-veil text-center">
            <p className="type-eyebrow mb-4 text-champagne/85">
              {museumContent.eyebrow}
            </p>
            <h1 className="text-glow font-display text-[clamp(2.2rem,8vw,3.4rem)] font-medium leading-[1.06]">
              <span className="type-quote text-aurora pb-1">
                {museumContent.title}
              </span>
            </h1>
            <p className="type-quote mx-auto mt-4 max-w-sm text-pretty text-base leading-7 text-moon">
              {museumContent.intro}
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {photos.map((src, index) => (
              <div key={`${src}-${index}`} className="polaroid rounded-[1rem] p-2 pb-5">
                <div className="aspect-[4/5] overflow-hidden rounded-[0.6rem]">
                  <img
                    src={src}
                    alt="a memory of us"
                    className="h-full w-full object-cover"
                    draggable={false}
                    decoding="async"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="type-script night-veil mt-10 text-center text-moon">
            {museumContent.dedication}
          </p>
        </section>
      ) : (
        <section className="flex min-h-[70svh] flex-col items-center justify-center gap-6 text-center">
          <div className="night-veil">
            <p className="type-eyebrow mb-4 text-champagne/85">
              {museumContent.eyebrow}
            </p>
            <h1 className="text-glow font-display text-[clamp(2.2rem,8vw,3.4rem)] font-medium leading-[1.06]">
              <span className="type-quote text-aurora pb-1">
                {museumContent.title}
              </span>
            </h1>
            <p className="type-quote mx-auto mt-4 max-w-sm text-pretty text-base leading-7 text-moon">
              {museumContent.intro}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setGateOpen(true)}
            className="btn-primary flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
          >
            <DoorOpen className="h-4 w-4" />
            {museumContent.enterCta}
          </button>
        </section>
      )}

      <MuseumGate
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        onUnlocked={() => {
          onUnlocked()
          setGateOpen(false)
          setInside(true)
        }}
      />
    </main>
  )
}
