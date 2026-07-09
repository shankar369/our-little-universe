import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react'
import {
  getBookCovers,
  getBookFaces,
  getBookPhotos,
} from '../../content/bookGallery'
import { bookContent } from '../../content/theBook'
import { softEase } from '../../design/motion'
import { useRichMotion } from '../../shared/lib/richMotion'
import { buildSheets } from './bookLayout'
import { BookScene } from './BookScene'
import { useBookControls } from './useBookControls'

/**
 * The Book — the digital replica of the real spiral-bound scrapbook,
 * floating in the night sky. It arrives with a cinematic fly-in, then
 * swipe (or drag, tap the page edges, or use arrow keys) to turn the
 * black cardstock pages. Page screenshots are dropped into
 * `src/content/bookPages/` and bind themselves in reading order.
 */
export function TheBook() {
  const { rich, compact } = useRichMotion()
  const sheets = useMemo(() => buildSheets(getBookFaces(), getBookCovers()), [])
  const { turned, next, prev, reset, stateRef, handlers } = useBookControls(
    sheets.length,
  )
  const [hasOpened, setHasOpened] = useState(false)

  if (turned > 0 && !hasOpened) {
    setHasOpened(true)
  }

  if (!rich) {
    return <BookFallback />
  }

  const atStart = turned === 0
  const atEnd = turned === sheets.length
  const pageLabel = atStart
    ? 'the cover'
    : atEnd
      ? bookContent.endNote
      : `leaf ${turned} of ${sheets.length - 1}`

  return (
    <main className="relative h-svh w-full overflow-hidden text-starlight">
      {/* The stage — every swipe on it turns a page */}
      <div
        {...handlers}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      >
        <BookScene
          sheets={sheets}
          turned={turned}
          controls={stateRef}
          compact={compact}
        />
      </div>

      {/* Title overlay */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: softEase }}
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center px-6 pt-[max(2.5rem,env(safe-area-inset-top))] text-center"
      >
        <div className="night-veil">
          <div className="mb-3 inline-flex items-center gap-2.5 text-champagne/85">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="type-eyebrow">{bookContent.eyebrow}</span>
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <h1 className="text-glow font-display text-[clamp(2rem,7vw,3rem)] font-medium leading-[1.06]">
            <span className="type-quote text-aurora pb-1">
              {bookContent.title}
            </span>
          </h1>
          <AnimatePresence>
            {!hasOpened ? (
              <motion.p
                exit={{
                  opacity: 0,
                  transition: { duration: 0.6, ease: softEase },
                }}
                className="type-quote mx-auto mt-3 max-w-sm text-pretty text-sm leading-6 text-moon sm:text-base"
              >
                {bookContent.intro}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Reading chrome. Extra bottom clearance on phones keeps it above the
          floating heart. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 px-6 pb-[max(5.25rem,env(safe-area-inset-bottom))] sm:pb-[max(1.75rem,env(safe-area-inset-bottom))]">
        <AnimatePresence>
          {!hasOpened ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1.1, duration: 0.8 } }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              className="type-script night-veil text-moon"
            >
              {bookContent.hint}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: softEase }}
          className="pointer-events-auto flex items-center gap-4"
        >
            <button
              type="button"
              onClick={prev}
              disabled={atStart}
              aria-label="Previous page"
              className="glass-chip flex h-11 w-11 items-center justify-center rounded-2xl text-orchid transition enabled:hover:text-starlight disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orchid"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="type-eyebrow min-w-32 text-center text-faint">
              {pageLabel}
            </span>
            <button
              type="button"
              onClick={next}
              disabled={atEnd}
              aria-label="Next page"
              className="glass-chip flex h-11 w-11 items-center justify-center rounded-2xl text-orchid transition enabled:hover:text-starlight disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orchid"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            {/* Back to the cover (and fitted zoom) */}
            <button
              type="button"
              onClick={reset}
              aria-label="Back to the cover"
              className="glass-chip ml-2 flex h-11 w-11 items-center justify-center rounded-2xl text-champagne/80 transition hover:text-starlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orchid"
            >
              <RotateCcw className="h-4.5 w-4.5" />
            </button>
          </motion.div>
      </div>
    </main>
  )
}

/**
 * The still book: without WebGL (or with reduced motion) the album lays its
 * black pages out as a quiet swipeable-free grid instead.
 */
function BookFallback() {
  const photos = useMemo(() => getBookPhotos(), [])

  return (
    <main className="relative min-h-svh px-6 py-[max(4rem,env(safe-area-inset-top))] text-starlight">
      <section className="mx-auto max-w-3xl">
        <div className="night-veil text-center">
          <p className="type-eyebrow mb-4 text-champagne/85">{bookContent.eyebrow}</p>
          <h1 className="text-glow font-display text-[clamp(2.2rem,8vw,3.4rem)] font-medium leading-[1.06]">
            <span className="type-quote text-aurora pb-1">{bookContent.title}</span>
          </h1>
          <p className="type-quote mx-auto mt-4 max-w-sm text-pretty text-base leading-7 text-moon">
            {bookContent.intro}
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {photos.map((src, index) => (
            <figure
              key={`${src}-${index}`}
              className="rounded-[1rem] border border-white/10 bg-[#0a0714] p-3 pb-6 shadow-[0_18px_50px_rgba(2,0,10,0.6)]"
            >
              <div className="aspect-[3/2] overflow-hidden rounded-[0.6rem]">
                <img
                  src={src}
                  alt="a page of us"
                  className="h-full w-full object-cover"
                  draggable={false}
                  decoding="async"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 text-center font-display text-xs italic text-champagne/60">
                · {index + 1} ·
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="type-script night-veil mt-10 text-center text-moon">
          {bookContent.dedication}
        </p>
      </section>
    </main>
  )
}
