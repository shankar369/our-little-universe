import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import type { RevealPhotoItem } from '../../../content/types'
import { softEase } from '../../../design/motion'
import { PhotoImage } from '../PhotoReveal/PhotoImage'

const defaultSwipeThreshold = 72

function wrapIndex(index: number, length: number) {
  return (index + length) % length
}

type PhotoShuffleStackProps<TItem extends RevealPhotoItem> = {
  items: TItem[]
  activeIndex: number
  onActiveIndexChange: (index: number) => void
  onOpenItem: (index: number) => void
  swipeThreshold?: number
  visibleRadius?: number
  className?: string
  previousLabel?: string
  nextLabel?: string
}

export function PhotoShuffleStack<TItem extends RevealPhotoItem>({
  items,
  activeIndex,
  onActiveIndexChange,
  onOpenItem,
  swipeThreshold = defaultSwipeThreshold,
  visibleRadius = 1,
  className = '',
  previousLabel = 'Previous memory',
  nextLabel = 'Next memory',
}: PhotoShuffleStackProps<TItem>) {
  const didDragRef = useRef(false)
  const pointerStartXRef = useRef<number | null>(null)

  function goToIndex(index: number) {
    onActiveIndexChange(wrapIndex(index, items.length))
  }

  function goNext() {
    goToIndex(activeIndex + 1)
  }

  function goPrevious() {
    goToIndex(activeIndex - 1)
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div
      className={`relative mx-auto h-[33rem] w-full max-w-[25rem] sm:h-[39rem] sm:max-w-[29rem] lg:h-[min(45rem,82svh)] lg:max-w-[34rem] ${className}`}
    >
      {/* Soft glow bed beneath the stack */}
      <div className="pointer-events-none absolute inset-x-4 bottom-12 top-16 rounded-[40%] bg-orchid/16 blur-3xl" />

      <div className="absolute inset-x-0 bottom-16 top-0">
        {items.map((item, index) => {
          const rawOffset = index - activeIndex
          const circularOffset =
            Math.abs(rawOffset) > items.length / 2
              ? rawOffset - Math.sign(rawOffset) * items.length
              : rawOffset
          const isVisible = Math.abs(circularOffset) <= visibleRadius
          const isActive = index === activeIndex
          const x = circularOffset * 20
          const y = Math.abs(circularOffset) * 14
          const rotate = circularOffset * 4.5
          const scale = 1 - Math.abs(circularOffset) * 0.05

          if (!isVisible) {
            return null
          }

          return (
            <motion.button
              type="button"
              key={item.id}
              drag={isActive ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.22}
              dragMomentum={false}
              dragTransition={{ bounceDamping: 28, bounceStiffness: 320 }}
              onPointerDown={(event) => {
                pointerStartXRef.current = event.clientX
                didDragRef.current = false
              }}
              onPointerMove={(event) => {
                if (pointerStartXRef.current === null) {
                  return
                }

                if (Math.abs(event.clientX - pointerStartXRef.current) > 8) {
                  didDragRef.current = true
                }
              }}
              onPointerUp={() => {
                pointerStartXRef.current = null
                if (didDragRef.current) {
                  window.setTimeout(() => {
                    didDragRef.current = false
                  }, 240)
                }
              }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 8) {
                  didDragRef.current = true
                  window.setTimeout(() => {
                    didDragRef.current = false
                  }, 220)
                }

                if (info.offset.x < -swipeThreshold) {
                  goNext()
                } else if (info.offset.x > swipeThreshold) {
                  goPrevious()
                }
              }}
              onClick={() => {
                if (didDragRef.current) {
                  return
                }

                if (isActive) {
                  onOpenItem(index)
                } else {
                  goToIndex(index)
                }
              }}
              className="polaroid absolute left-1/2 top-2 w-[78%] origin-bottom rounded-[1rem] p-2 text-left text-[#2b1048] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid sm:top-4"
              style={{
                touchAction: isActive ? 'pan-y' : 'manipulation',
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
              animate={{
                x: `calc(-50% + ${x}px)`,
                y,
                rotate,
                scale,
                opacity: 1 - Math.abs(circularOffset) * 0.22,
                zIndex: 20 - Math.abs(circularOffset),
              }}
              transition={{ duration: 0.38, ease: softEase }}
              whileTap={isActive ? { scale: scale * 0.985 } : undefined}
              aria-label={
                isActive ? `Open ${item.heading}` : `Select ${item.heading}`
              }
            >
              <div className="aspect-[4/5] overflow-hidden rounded-[0.6rem]">
                {/* Caption plate below already names the memory */}
                <PhotoImage item={item} showFallbackText={false} />
              </div>
              <div className="px-1.5 pb-2 pt-3.5">
                {item.label ? (
                  <p className="type-eyebrow mb-1.5 !tracking-[0.22em] text-[#2b1048]/45">
                    {item.label}
                  </p>
                ) : null}
                <h3 className="font-display text-xl font-semibold leading-tight">
                  {item.heading}
                </h3>
                <p className="type-quote mt-1.5 line-clamp-2 text-sm leading-5 text-[#2b1048]/65">
                  {item.quote ?? item.text}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={goPrevious}
          className="btn-ghost flex h-12 w-12 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
          aria-label={previousLabel}
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <p className="type-script select-none text-faint">
          swipe &middot; tap to open
        </p>
        <button
          type="button"
          onClick={goNext}
          className="btn-ghost flex h-12 w-12 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
          aria-label={nextLabel}
        >
          <ArrowRight className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  )
}
