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
    <main className="relative h-svh w-full overflow-hidden text-starlight">
      {/* The galaxy fills the entire screen */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.95, ease: softEase }}
        className="absolute inset-0"
      >
        <PhotoSphere items={photos} onOpenItem={setOpenIndex} className="h-full w-full" />
      </motion.div>

      {/* Edge scrims so the floating chrome stays legible */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-night/80 via-night/25 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-night/75 via-night/20 to-transparent" />

      {/* Header — short and sweet, floating over the galaxy */}
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: softEase }}
        className="night-veil pointer-events-none absolute inset-x-0 top-0 z-20 px-6 pt-[max(1.25rem,env(safe-area-inset-top))] text-center"
      >
        <div className="mb-2 inline-flex items-center gap-2.5 text-champagne/85">
          <Orbit className="h-3.5 w-3.5" />
          <span className="type-eyebrow">Photo Universe</span>
        </div>
        <h1 className="text-glow text-balance text-[clamp(1.5rem,5vw,2.4rem)] font-medium leading-[1.05]">
          A galaxy made
          <span className="type-quote text-aurora block pb-1">entirely of us.</span>
        </h1>
      </motion.header>

      {/* Hint — floating at the bottom, clear of the side controls */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.7, ease: softEase }}
        className="type-quote pointer-events-none absolute inset-x-0 bottom-[max(1.75rem,env(safe-area-inset-bottom))] z-20 text-center text-sm text-moon/70"
      >
        drag to wander &middot; pinch to zoom &middot; tap a planet
      </motion.p>

      <PhotoRevealDialog
        item={openPhoto}
        onClose={() => setOpenIndex(null)}
        onNext={openNextPhoto}
        onPrevious={openPreviousPhoto}
      />
    </main>
  )
}
