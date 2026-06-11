import { ArrowLeft, Orbit, Sparkles, ZoomIn } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { useCallback, useMemo, useState } from 'react'
import { orderedPhotoUniverseItems } from '../../content/photoUniverse'
import { riseIn } from '../../design/motion'
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
    <main className="relative min-h-svh px-5 py-[max(1.25rem,env(safe-area-inset-top))] text-white">
      <section className="mx-auto grid min-h-[calc(100svh-2.5rem)] w-full max-w-7xl gap-5 pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-8 lg:pt-8">
        <motion.div
          {...riseIn}
          className="liquid-panel order-2 rounded-[2.15rem] px-5 py-6 sm:px-8 sm:py-8 lg:order-1"
        >
          <div className="relative">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="liquid-control inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-100/90">
                <Orbit className="h-3.5 w-3.5 text-amber-200" />
                Photo Universe
              </div>
              <button
                type="button"
                onClick={openRandomPhoto}
                className="liquid-button inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-xs font-bold uppercase tracking-[0.16em] text-purple-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-100"
              >
                <Sparkles className="h-4 w-4" />
                Surprise me
              </button>
            </div>

            <h1 className="pr-16 text-balance text-[clamp(2.62rem,11.5vw,7rem)] font-semibold leading-[0.9] text-white sm:pr-0">
              Fifty tiny planets of us.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-violet-50/78 sm:text-xl sm:leading-8">
              Drag the globe, pinch or scroll to zoom, and tap a photo planet to
              open it in the same framed memory preview. Real photos can drop in
              later without changing the component.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="liquid-control rounded-[1.35rem] px-4 py-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-100/76">
                  <ZoomIn className="h-4 w-4 text-amber-200" />
                  Gesture notes
                </div>
                <p className="text-sm leading-6 text-violet-50/72">
                  One finger rotates. Pinch or wheel zooms. Tap opens a memory.
                </p>
              </div>
              <div className="liquid-control rounded-[1.35rem] px-4 py-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-100/76">
                  Orbit count
                </p>
                <p className="text-sm leading-6 text-violet-50/72">
                  {photos.length} photo cards are placed in a balanced 3D sphere.
                </p>
              </div>
            </div>

            <Link
              to="/journey"
              className="liquid-control mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to journey
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 lg:order-2"
        >
          <div className="relative">
            <div className="pointer-events-none absolute -inset-5 rounded-[3rem] bg-[radial-gradient(circle_at_50%_48%,rgba(216,180,254,0.24),transparent_44%)] blur-2xl" />
            <PhotoSphere
              items={photos}
              onOpenItem={setOpenIndex}
              className="relative h-[31rem] w-full sm:h-[40rem] lg:h-[44rem]"
            />
          </div>
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
