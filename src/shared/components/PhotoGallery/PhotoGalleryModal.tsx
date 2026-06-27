import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Heart, X } from 'lucide-react'
import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { softEase } from '../../../design/motion'

export type PhotoGalleryModalProps = {
  open: boolean
  /** Resolved, ready-to-use image src URLs. */
  photos: string[]
  title?: string
  subtitle?: string
  /** Optional per-photo serif captions, indexed alongside `photos`. */
  captions?: string[]
  onClose: () => void
}

// A faint film-grain wash for warmth, applied at very low opacity over the night.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/**
 * A reusable, full-screen, cinematic photo gallery.
 *
 * Pass an array of image URLs and it renders an aspect-ratio-aware masonry that
 * blooms in on scroll, with a draggable, swipeable lightbox. Built for Our Little
 * Atlas, intended for any "show all the photos in this set" surface.
 */
export function PhotoGalleryModal({
  open,
  photos,
  title,
  subtitle,
  captions,
  onClose,
}: PhotoGalleryModalProps) {
  const [lightbox, setLightbox] = useState<{ index: number; direction: number } | null>(null)

  const closeLightbox = useCallback(() => setLightbox(null), [])

  const openLightbox = useCallback((index: number) => {
    setLightbox({ index, direction: 0 })
  }, [])

  const showNext = useCallback(() => {
    setLightbox((current) =>
      current === null
        ? null
        : { index: (current.index + 1) % photos.length, direction: 1 },
    )
  }, [photos.length])

  const showPrevious = useCallback(() => {
    setLightbox((current) =>
      current === null
        ? null
        : { index: (current.index - 1 + photos.length) % photos.length, direction: -1 },
    )
  }, [photos.length])

  // Reset the lightbox when the gallery reopens (render-time state adjustment).
  const [wasOpen, setWasOpen] = useState(open)
  if (wasOpen !== open) {
    setWasOpen(open)
    if (!open) {
      setLightbox(null)
    }
  }

  // Lock the page behind the modal and wire keyboard controls.
  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (lightbox !== null) {
          closeLightbox()
        } else {
          onClose()
        }
      } else if (event.key === 'ArrowRight' && lightbox !== null) {
        showNext()
      } else if (event.key === 'ArrowLeft' && lightbox !== null) {
        showPrevious()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, lightbox, onClose, closeLightbox, showNext, showPrevious])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="gallery"
          role="dialog"
          aria-modal="true"
          aria-label={title ? `${title} photos` : 'Photo gallery'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: softEase }}
          className="fixed inset-0 z-[70] flex flex-col bg-night"
        >
          {/* Romantic ambiance: aurora glows + grain over the night */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_55%_at_20%_-5%,rgba(200,148,252,0.2),transparent_60%),radial-gradient(70%_50%_at_100%_0%,rgba(247,184,212,0.14),transparent_55%)]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-soft-light"
            style={{ backgroundImage: GRAIN, backgroundSize: '160px 160px' }}
          />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.5, ease: softEase }}
            className="relative z-10 flex shrink-0 items-center justify-between gap-4 px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8"
          >
            <div className="min-w-0">
              <div className="mb-1 inline-flex items-center gap-2 text-champagne/85">
                <Heart className="h-3.5 w-3.5 fill-blush/70 text-blush/70" />
                <span className="type-eyebrow truncate">
                  {subtitle ?? 'our little gallery'}
                </span>
              </div>
              {title ? (
                <h2 className="truncate font-display text-2xl font-semibold leading-tight sm:text-[1.7rem]">
                  <span className="text-aurora">{title}</span>
                </h2>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden text-xs font-medium tracking-wide text-faint sm:block">
                {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
                aria-label="Close gallery"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>

          {/* Scrollable masonry */}
          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-1 sm:px-8">
            {photos.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="relative mb-4">
                  <span className="absolute inset-0 -z-10 animate-pulse rounded-full bg-blush/20 blur-2xl" />
                  <Heart className="h-12 w-12 text-blush/60" />
                </span>
                <p className="type-quote text-lg text-moon">
                  memories are landing here soon
                </p>
              </div>
            ) : (
              <div className="mx-auto max-w-6xl columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
                {photos.map((src, index) => (
                  <GalleryTile
                    key={src}
                    src={src}
                    index={index}
                    caption={captions?.[index]}
                    onOpen={() => openLightbox(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Lightbox */}
          <AnimatePresence custom={lightbox?.direction ?? 0}>
            {lightbox !== null ? (
              <Lightbox
                photos={photos}
                index={lightbox.index}
                direction={lightbox.direction}
                title={title}
                caption={captions?.[lightbox.index]}
                onClose={closeLightbox}
                onNext={showNext}
                onPrevious={showPrevious}
              />
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

type GalleryTileProps = {
  src: string
  index: number
  caption?: string
  onOpen: () => void
}

// Varied placeholder ratios so the pre-load skeleton already feels like a gallery;
// each tile snaps to its true ratio the moment its image decodes.
const placeholderRatios = [0.72, 1, 1.45, 0.8, 1.5, 0.68]

function GalleryTile({ src, index, caption, onOpen }: GalleryTileProps) {
  const [ratio, setRatio] = useState(placeholderRatios[index % placeholderRatios.length])
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 34, scale: 0.93, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.62, ease: softEase, delay: (index % 3) * 0.07 }}
      className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-plum/60 to-deep ring-1 ring-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orchid sm:mb-4"
      style={{
        aspectRatio: String(ratio),
        boxShadow: '0 18px 50px rgba(2,0,10,0.45)',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Shimmer while the photo decodes */}
      {!loaded ? (
        <span className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.06] to-transparent" />
      ) : null}

      <img
        src={src}
        alt={caption ?? `Memory ${index + 1}`}
        loading="lazy"
        decoding="async"
        draggable={false}
        onLoad={(event) => {
          const image = event.currentTarget
          if (image.naturalWidth && image.naturalHeight) {
            setRatio(image.naturalWidth / image.naturalHeight)
          }
          setLoaded(true)
        }}
        className={`absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.05] ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Hover/active reveal: scrim + serif caption */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/80 via-night/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center gap-2 px-4 pb-3.5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <Heart className="h-3.5 w-3.5 shrink-0 fill-blush/80 text-blush/80" />
        <span className="type-quote truncate text-sm text-starlight/95">
          {caption ?? `moment ${String(index + 1).padStart(2, '0')}`}
        </span>
      </span>
      {/* Soft inner edge light */}
      <span className="pointer-events-none absolute inset-0 rounded-[1.4rem] ring-1 ring-inset ring-white/5" />
    </motion.button>
  )
}

type LightboxProps = {
  photos: string[]
  index: number
  direction: number
  title?: string
  caption?: string
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

const lightboxVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 0.92,
    x: direction === 0 ? 0 : direction * 80,
  }),
  center: { opacity: 1, scale: 1, x: 0 },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 0.96,
    x: direction === 0 ? 0 : direction * -80,
  }),
}

function Lightbox({
  photos,
  index,
  direction,
  title,
  caption,
  onClose,
  onNext,
  onPrevious,
}: LightboxProps) {
  const photo = photos[index]
  const multiple = photos.length > 1

  function handleDragEnd(_event: unknown, info: PanInfo) {
    const { offset, velocity } = info
    if (offset.y > 140 || velocity.y > 700) {
      onClose()
    } else if (multiple && (offset.x < -90 || velocity.x < -500)) {
      onNext()
    } else if (multiple && (offset.x > 90 || velocity.x > 500)) {
      onPrevious()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.26 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-night/96 backdrop-blur-2xl"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="btn-ghost absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-20 flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
        aria-label="Close photo"
      >
        <X className="h-5 w-5" />
      </button>

      {multiple ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onPrevious()
            }}
            className="btn-ghost absolute left-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid sm:flex sm:left-6"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onNext()
            }}
            className="btn-ghost absolute right-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid sm:flex sm:right-6"
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      ) : null}

      {/* Draggable, swipeable image stage */}
      <div
        className="relative flex h-full w-full items-center justify-center px-4 py-16 sm:px-20"
        onClick={(event) => event.stopPropagation()}
      >
        <AnimatePresence custom={direction} mode="popLayout" initial={false}>
          <motion.img
            key={photo}
            src={photo}
            alt={caption ?? title ?? 'Memory'}
            draggable={false}
            custom={direction}
            variants={lightboxVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.34, ease: softEase }}
            drag
            dragSnapToOrigin
            dragElastic={0.18}
            onDragEnd={handleDragEnd}
            className="max-h-full max-w-full cursor-grab rounded-2xl object-contain shadow-[0_30px_90px_rgba(2,0,10,0.7)] active:cursor-grabbing"
          />
        </AnimatePresence>
      </div>

      {/* Caption + counter */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-1 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center">
        {caption ? (
          <p className="type-quote max-w-md text-pretty text-sm text-moon/90">{caption}</p>
        ) : null}
        {multiple ? (
          <span className="glass-chip rounded-full px-3 py-1 text-xs font-medium tracking-wide text-moon">
            {index + 1} / {photos.length}
          </span>
        ) : null}
      </div>
    </motion.div>
  )
}
