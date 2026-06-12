import { ArrowLeft, Orbit, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { useCallback, useMemo, useState } from 'react'
import { orderedPhotoUniverseItems } from '../../content/photoUniverse'
import { riseIn, softEase } from '../../design/motion'
import { PhotoRevealDialog } from '../../shared/components/PhotoReveal/PhotoRevealDialog'
import { PhotoSphere } from '../../shared/components/PhotoSphere/PhotoSphere'

function wrapIndex(index: number, length: number) {
  return (index + length) % length
}

export function PhotoUniverse() {
  const photos = useMemo(() => orderedPhotoUniverseItems, [])
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const openPhoto = openIndex === null ? null : photos[openIndex]

  const openRandomPhoto = useCallback(() => {
    setOpenIndex(Math.floor(Math.random() * photos.length))
  }, [photos.length])

  const openNextPhoto = useCallback(() => {
    setOpenIndex((current) => (current === null ? 0 : wrapIndex(current + 1, photos.length)))
  }, [photos.length])

  const openPreviousPhoto = useCallback(() => {
    setOpenIndex((current) => (current === null ? 0 : wrapIndex(current - 1, photos.length)))
  }, [photos.length])

  return (
    <main className="relative min-h-svh overflow-x-hidden px-6 py-[max(1.5rem,env(safe-area-inset-top))] text-starlight">
      <section className="mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-6xl flex-col justify-center gap-2 pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-4 lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-8">
        {/* Heading + actions */}
        <motion.div {...riseIn} className="night-veil relative z-10 text-center lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2.5 text-champagne/85">
            <Orbit className="h-3.5 w-3.5" />
            <span className="type-eyebrow">Photo Universe</span>
          </div>
          <h1 className="text-glow text-balance text-[clamp(2.1rem,8.5vw,3.6rem)] font-medium leading-[1.04]">
            A galaxy made
            <span className="type-quote text-aurora block pb-1">entirely of us.</span>
          </h1>
          <p className="type-quote mx-auto mt-4 max-w-sm text-pretty text-base leading-7 text-moon lg:mx-0">
            {photos.length} little planets, each one holding a moment that
            refused to be forgotten.
          </p>

          <div className="mt-7 hidden flex-col items-center gap-4 lg:flex lg:items-start">
            <button
              type="button"
              onClick={openRandomPhoto}
              className="btn-primary flex h-13 items-center justify-center gap-2 rounded-2xl px-7 text-base font-semibold active:scale-[0.985] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
            >
              <Sparkles className="h-4 w-4" />
              Surprise me
            </button>
            <Link
              to="/journey"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-faint transition hover:text-moon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to the journey
            </Link>
          </div>
        </motion.div>

        {/* The galaxy itself — full-bleed on mobile, no widget box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.85, ease: softEase }}
          className="-mx-6 lg:mx-0"
        >
          <PhotoSphere
            items={photos}
            onOpenItem={setOpenIndex}
            className="h-[56svh] min-h-[22rem] w-full sm:h-[60svh] lg:h-[42rem]"
          />
          <p className="type-quote relative z-10 text-center text-sm text-moon/80">
            drag to wander &middot; pinch to zoom &middot; tap a planet
          </p>
        </motion.div>

        {/* Mobile actions below the galaxy */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: softEase }}
          className="mt-5 flex items-center justify-center gap-4 lg:hidden"
        >
          <Link
            to="/journey"
            className="btn-ghost flex h-12 w-12 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
            aria-label="Back to the journey"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <button
            type="button"
            onClick={openRandomPhoto}
            className="btn-primary flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold active:scale-[0.985] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
          >
            <Sparkles className="h-4 w-4" />
            Surprise me
          </button>
        </motion.div>
      </section>

      <PhotoRevealDialog
        item={openPhoto}
        onClose={() => setOpenIndex(null)}
        onNext={openNextPhoto}
        onPrevious={openPreviousPhoto}
      />
    </main>
  )
}
