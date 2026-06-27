import { Orbit } from 'lucide-react'
import { motion } from 'motion/react'
import { useCallback, useMemo, useState } from 'react'
import { orderedPhotoUniverseItems } from '../../content/photoUniverse'
import { softEase } from '../../design/motion'
import { PhotoRevealDialog } from '../../shared/components/PhotoReveal/PhotoRevealDialog'
import { PhotoSphere } from '../../shared/components/PhotoSphere/PhotoSphere'

function wrapIndex(index: number, length: number) {
  return (index + length) % length
}

export function PhotoUniverse() {
  const photos = useMemo(() => orderedPhotoUniverseItems, [])
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const openPhoto = openIndex === null ? null : photos[openIndex]

  const openNextPhoto = useCallback(() => {
    setOpenIndex((current) => (current === null ? 0 : wrapIndex(current + 1, photos.length)))
  }, [photos.length])

  const openPreviousPhoto = useCallback(() => {
    setOpenIndex((current) => (current === null ? 0 : wrapIndex(current - 1, photos.length)))
  }, [photos.length])

  return (
    <main className="relative min-h-svh overflow-x-hidden text-starlight">
      <section className="mx-auto flex min-h-svh w-full flex-col justify-center pb-[max(3.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
        {/* Header — short and sweet, floating over the galaxy */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: softEase }}
          className="night-veil pointer-events-none relative z-10 shrink-0 px-6 text-center"
        >
          <div className="mb-2.5 inline-flex items-center gap-2.5 text-champagne/85">
            <Orbit className="h-3.5 w-3.5" />
            <span className="type-eyebrow">Photo Universe</span>
          </div>
          <h1 className="text-glow text-balance text-[clamp(1.6rem,5.5vw,2.6rem)] font-medium leading-[1.05]">
            A galaxy made
            <span className="type-quote text-aurora block pb-1">entirely of us.</span>
          </h1>
        </motion.header>

        {/* The galaxy claims as much of the viewport as it can */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.9, ease: softEase }}
          className="relative -mt-3 w-full"
        >
          <PhotoSphere
            items={photos}
            onOpenItem={setOpenIndex}
            className="h-[74svh] min-h-[26rem] w-full sm:h-[78svh] lg:h-[82svh]"
          />
          <p className="type-quote pointer-events-none relative z-10 -mt-3 text-center text-sm text-moon/70">
            drag to wander &middot; pinch to zoom &middot; tap a planet
          </p>
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
