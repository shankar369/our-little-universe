import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { RevealPhotoItem } from '../../../content/types'
import { softEase } from '../../../design/motion'
import { PhotoImage } from './PhotoImage'

type PhotoRevealDialogProps<TItem extends RevealPhotoItem> = {
  item: TItem | null
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
  nextLabel?: string
  previousLabel?: string
}

export function PhotoRevealDialog<TItem extends RevealPhotoItem>({
  item,
  onClose,
  onNext,
  onPrevious,
  nextLabel = 'Next memory',
  previousLabel = 'Previous memory',
}: PhotoRevealDialogProps<TItem>) {
  useEffect(() => {
    if (!item) {
      return undefined
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }

      if (event.key === 'ArrowRight') {
        onNext?.()
      }

      if (event.key === 'ArrowLeft') {
        onPrevious?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [item, onClose, onNext, onPrevious])

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-night/72 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-xl sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${item.heading} photo reveal`}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.32, ease: softEase }}
            className="glass-panel max-h-[calc(100svh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] p-5 sm:p-6"
          >
            <div className="relative">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  {item.label ? (
                    <p className="type-eyebrow text-champagne/80">{item.label}</p>
                  ) : null}
                  <h2 className="mt-1.5 font-display text-2xl font-semibold text-starlight sm:text-3xl">
                    {item.heading}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-ghost flex h-11 w-11 shrink-0 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
                  aria-label="Close photo reveal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="polaroid rounded-[1rem] p-2">
                <div className="aspect-[4/4.25] overflow-hidden rounded-[0.6rem] sm:aspect-[16/10]">
                  <PhotoImage item={item} />
                </div>
                <blockquote className="type-quote px-4 pb-2 pt-3.5 text-center text-lg leading-7 text-[#2b1048] sm:text-xl">
                  &ldquo;{item.quote ?? item.text}&rdquo;
                </blockquote>
              </div>

              {item.story || item.text ? (
                <p className="mx-auto mt-5 max-w-prose border-t border-white/10 px-1 pt-4 text-center text-sm leading-7 text-moon sm:text-[0.95rem]">
                  {item.story ?? item.text}
                </p>
              ) : null}

              {onPrevious || onNext ? (
                <div className="mt-5 flex items-center justify-center gap-5">
                  <button
                    type="button"
                    onClick={onPrevious}
                    disabled={!onPrevious}
                    className="btn-ghost flex h-12 w-12 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
                    aria-label={previousLabel}
                  >
                    <ArrowLeft className="h-4.5 w-4.5" />
                  </button>
                  <p className="type-quote select-none text-sm text-faint">
                    more of us
                  </p>
                  <button
                    type="button"
                    onClick={onNext}
                    disabled={!onNext}
                    className="btn-primary flex h-12 w-12 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
                    aria-label={nextLabel}
                  >
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
