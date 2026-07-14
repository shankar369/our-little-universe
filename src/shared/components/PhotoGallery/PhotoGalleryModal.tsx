import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Heart, X } from 'lucide-react'
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  type PanInfo,
} from 'motion/react'
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
          <div className="grain-veil" />

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
              <PhotoLightbox
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

export type PhotoLightboxProps = {
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

const ZOOM_MAX = 4
/** Zoom level a double-tap/double-click jumps to. */
const ZOOM_TOGGLE = 2.4
/** Below this the photo counts as "not zoomed" and swipe gestures own the stage. */
const ZOOM_REST = 1.02

/**
 * The full-screen, draggable/swipeable single-photo viewer used by
 * `PhotoGalleryModal`'s grid-to-lightbox flow. Exported so other surfaces
 * (e.g. Photo Universe's sphere) can drop straight into the same view/close
 * interaction without the masonry grid in front of it.
 *
 * Zoom: pinch (touch), scroll wheel, or double-tap/double-click, with drag to
 * pan while zoomed. At rest (1×) the drag gesture keeps its original meaning —
 * swipe sideways for next/previous, swipe down to close.
 */
export function PhotoLightbox({
  photos,
  index,
  direction,
  title,
  caption,
  onClose,
  onNext,
  onPrevious,
}: PhotoLightboxProps) {
  const photo = photos[index]
  const multiple = photos.length > 1

  const stageRef = useRef<HTMLDivElement>(null)
  const scale = useMotionValue(1)
  const panX = useMotionValue(0)
  const panY = useMotionValue(0)
  // `zoomed` mirrors the scale into React state so the swipe drag can be
  // handed over to the pan/pinch layer (and back) between gestures.
  const [zoomed, setZoomed] = useState(false)
  const activePointers = useRef(
    new Map<number, { x: number; y: number; downX: number; downY: number; moved: boolean }>(),
  )
  const pinchSession = useRef<{ distance: number; scale: number } | null>(null)
  const panSession = useRef<{ px: number; py: number; x0: number; y0: number } | null>(
    null,
  )
  const lastTap = useRef<{ time: number; x: number; y: number } | null>(null)

  /** Keep the photo covering the stage — no panning past its edges. */
  const clampPan = useCallback(
    (x: number, y: number, s: number) => {
      const stage = stageRef.current
      const image = stage?.querySelector('img')
      if (!stage || !image) {
        return { x, y }
      }
      const maxX = Math.max(0, (image.offsetWidth * s - stage.clientWidth) / 2)
      const maxY = Math.max(0, (image.offsetHeight * s - stage.clientHeight) / 2)
      return {
        x: Math.min(maxX, Math.max(-maxX, x)),
        y: Math.min(maxY, Math.max(-maxY, y)),
      }
    },
    [],
  )

  /** Zoom toward `origin` (client coords) so the point under it stays put. */
  const zoomTo = useCallback(
    (target: number, origin?: { x: number; y: number }, animated = true) => {
      const stage = stageRef.current
      const from = scale.get()
      const next = Math.min(ZOOM_MAX, Math.max(1, target))
      let nx = panX.get()
      let ny = panY.get()
      if (origin && stage) {
        const rect = stage.getBoundingClientRect()
        const ox = origin.x - (rect.left + rect.width / 2)
        const oy = origin.y - (rect.top + rect.height / 2)
        nx = ox - ((ox - nx) * next) / from
        ny = oy - ((oy - ny) * next) / from
      }
      const clamped = clampPan(nx, ny, next)
      if (animated) {
        animate(scale, next, { duration: 0.3, ease: softEase })
        animate(panX, clamped.x, { duration: 0.3, ease: softEase })
        animate(panY, clamped.y, { duration: 0.3, ease: softEase })
      } else {
        scale.set(next)
        panX.set(clamped.x)
        panY.set(clamped.y)
      }
      setZoomed(next > ZOOM_REST)
    },
    [clampPan, scale, panX, panY],
  )

  // A new photo always starts at rest.
  useEffect(() => {
    scale.set(1)
    panX.set(0)
    panY.set(0)
    setZoomed(false)
    activePointers.current.clear()
    pinchSession.current = null
    panSession.current = null
  }, [index, scale, panX, panY])

  function handleWheel(event: React.WheelEvent) {
    zoomTo(
      scale.get() * Math.exp(-event.deltaY * 0.0022),
      { x: event.clientX, y: event.clientY },
      false,
    )
  }

  /** Double-tap / double-click toggles between rest and a comfy close-up. */
  function toggleZoomAt(x: number, y: number) {
    if (scale.get() > ZOOM_REST) {
      zoomTo(1)
    } else {
      zoomTo(ZOOM_TOGGLE, { x, y })
    }
  }

  function handlePointerDown(event: React.PointerEvent) {
    activePointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
      downX: event.clientX,
      downY: event.clientY,
      moved: false,
    })
    if (activePointers.current.size === 2) {
      const [a, b] = [...activePointers.current.values()]
      pinchSession.current = {
        distance: Math.hypot(a.x - b.x, a.y - b.y),
        scale: scale.get(),
      }
      panSession.current = null
      lastTap.current = null
      // Fingers in a pinch never count as taps.
      for (const point of activePointers.current.values()) {
        point.moved = true
      }
      // Hand the gesture over from the swipe drag to the pinch layer.
      setZoomed(true)
    } else if (activePointers.current.size === 1 && scale.get() > ZOOM_REST) {
      panSession.current = {
        px: event.clientX,
        py: event.clientY,
        x0: panX.get(),
        y0: panY.get(),
      }
    }
  }

  function handlePointerMove(event: React.PointerEvent) {
    const point = activePointers.current.get(event.pointerId)
    if (!point) {
      return
    }
    point.x = event.clientX
    point.y = event.clientY
    if (Math.hypot(event.clientX - point.downX, event.clientY - point.downY) > 8) {
      point.moved = true
    }

    if (pinchSession.current && activePointers.current.size >= 2) {
      const [a, b] = [...activePointers.current.values()]
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      const next = Math.min(
        ZOOM_MAX,
        Math.max(1, (pinchSession.current.scale * distance) / pinchSession.current.distance),
      )
      scale.set(next)
      const clamped = clampPan(panX.get(), panY.get(), next)
      panX.set(clamped.x)
      panY.set(clamped.y)
    } else if (panSession.current && scale.get() > ZOOM_REST) {
      const clamped = clampPan(
        panSession.current.x0 + event.clientX - panSession.current.px,
        panSession.current.y0 + event.clientY - panSession.current.py,
        scale.get(),
      )
      panX.set(clamped.x)
      panY.set(clamped.y)
    }
  }

  function handlePointerEnd(event: React.PointerEvent) {
    const point = activePointers.current.get(event.pointerId)
    // Detect double-taps by hand — native dblclick is unreliable on touch and
    // under the drag gesture, and this one code path covers mouse too.
    if (point && !point.moved && !pinchSession.current && activePointers.current.size === 1) {
      const now = performance.now()
      const previous = lastTap.current
      if (
        previous &&
        now - previous.time < 350 &&
        Math.hypot(event.clientX - previous.x, event.clientY - previous.y) < 48
      ) {
        lastTap.current = null
        toggleZoomAt(event.clientX, event.clientY)
      } else {
        lastTap.current = { time: now, x: event.clientX, y: event.clientY }
      }
    }
    activePointers.current.delete(event.pointerId)
    if (pinchSession.current && activePointers.current.size < 2) {
      pinchSession.current = null
      if (scale.get() <= 1.05) {
        zoomTo(1)
      } else {
        // Let the remaining finger keep panning without lifting.
        const remaining = [...activePointers.current.values()][0]
        if (remaining) {
          panSession.current = {
            px: remaining.x,
            py: remaining.y,
            x0: panX.get(),
            y0: panY.get(),
          }
        }
      }
    }
    if (activePointers.current.size === 0) {
      panSession.current = null
    }
  }

  function handleDragEnd(_event: unknown, info: PanInfo) {
    if (scale.get() > ZOOM_REST) {
      return
    }
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

      {/* Draggable, swipeable, zoomable image stage */}
      <div
        ref={stageRef}
        className="relative flex h-full w-full items-center justify-center px-4 py-16 sm:px-20"
        style={{ touchAction: 'none' }}
        onClick={(event) => event.stopPropagation()}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        {/* Persistent zoom/pan frame; the photo swaps inside it. */}
        <motion.div
          style={{ x: panX, y: panY, scale }}
          drag={!zoomed}
          dragSnapToOrigin
          dragElastic={0.18}
          onDragEnd={handleDragEnd}
          className={`relative flex h-full w-full items-center justify-center ${
            zoomed ? 'cursor-move' : 'cursor-grab active:cursor-grabbing'
          }`}
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
              className="max-h-full max-w-full select-none rounded-2xl object-contain shadow-[0_30px_90px_rgba(2,0,10,0.7)]"
            />
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Caption + counter */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-1 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center">
        {caption ? (
          <p className="type-quote max-w-md text-pretty text-sm text-moon/90">{caption}</p>
        ) : null}
        <p className="type-script text-moon/70">pinch, scroll, or tap twice to zoom</p>
        {multiple ? (
          <span className="glass-chip rounded-full px-3 py-1 text-xs font-medium tracking-wide text-moon">
            {index + 1} / {photos.length}
          </span>
        ) : null}
      </div>
    </motion.div>
  )
}
