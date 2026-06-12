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
  nextLabel = 'Next',
  previousLabel = 'Previous',
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
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/58 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-xl sm:items-center"
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
            transition={{ duration: 0.28, ease: softEase }}
            className="liquid-panel max-h-[calc(100svh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[2rem] p-4 sm:p-5"
          >
            <div className="relative">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  {item.label ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fuchsia-100/72">
                      {item.label}
                    </p>
                  ) : null}
                  <h2 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
                    {item.heading}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="liquid-control flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-100"
                  aria-label="Close photo reveal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="rounded-[1.55rem] bg-white/92 p-2 shadow-[0_26px_80px_rgba(0,0,0,0.44)]">
                <div className="aspect-[4/4.25] overflow-hidden rounded-[1.15rem] sm:aspect-[16/10]">
                  <PhotoImage item={item} />
                </div>
                <blockquote className="type-quote px-3 py-3 text-center text-lg font-semibold leading-7 text-purple-950 sm:py-4 sm:text-xl">
                  "{item.quote ?? item.text}"
                </blockquote>
              </div>

              {item.story || item.text ? (
                <p className="mt-4 rounded-[1.25rem] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-7 text-violet-50/78 sm:py-4 sm:text-base">
                  {item.story ?? item.text}
                </p>
              ) : null}

              {onPrevious || onNext ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={onPrevious}
                    disabled={!onPrevious}
                    className="liquid-control flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-100"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {previousLabel}
                  </button>
                  <button
                    type="button"
                    onClick={onNext}
                    disabled={!onNext}
                    className="liquid-button flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-bold text-purple-950 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-100"
                  >
                    {nextLabel}
                    <ArrowRight className="h-4 w-4" />
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
