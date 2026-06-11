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
  visibleRadius = 2,
  className = '',
  previousLabel = 'Prev',
  nextLabel = 'Next',
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
      className={`relative mx-auto h-[31rem] w-full max-w-[25rem] sm:h-[38rem] lg:max-w-[31rem] ${className}`}
    >
      <div className="liquid-panel absolute inset-x-8 bottom-8 top-14 rounded-[2rem] opacity-60" />
      <div className="absolute inset-0">
        {items.map((item, index) => {
          const rawOffset = index - activeIndex
          const circularOffset =
            Math.abs(rawOffset) > items.length / 2
              ? rawOffset - Math.sign(rawOffset) * items.length
              : rawOffset
          const isVisible = Math.abs(circularOffset) <= visibleRadius
          const isActive = index === activeIndex
          const x = circularOffset * 22
          const y = Math.abs(circularOffset) * 18
          const rotate = circularOffset * 5
          const scale = 1 - Math.abs(circularOffset) * 0.055

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
              className="absolute left-1/2 top-4 w-[76%] origin-bottom rounded-[1.7rem] bg-white/92 p-2 text-left text-purple-950 shadow-[0_28px_90px_rgba(0,0,0,0.48)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-100 sm:top-8 sm:w-[78%]"
              animate={{
                x: `calc(-50% + ${x}px)`,
                y,
                rotate,
                scale,
                opacity: 1 - Math.abs(circularOffset) * 0.18,
                zIndex: 20 - Math.abs(circularOffset),
              }}
              transition={{ duration: 0.34, ease: softEase }}
              whileTap={isActive ? { scale: scale * 0.985 } : undefined}
              aria-label={
                isActive ? `Open ${item.heading}` : `Select ${item.heading}`
              }
            >
              <div className="aspect-[4/5] overflow-hidden rounded-[1.25rem]">
                <PhotoImage item={item} />
              </div>
              <div className="px-2.5 py-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  {item.label ? (
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-purple-950/42">
                      {item.label}
                    </p>
                  ) : null}
                  {isActive ? (
                    <p className="ml-auto text-[0.68rem] font-black uppercase tracking-[0.18em] text-fuchsia-800/62">
                      Tap to frame
                    </p>
                  ) : null}
                </div>
                <h3 className="text-2xl font-black leading-none">{item.heading}</h3>
                <p className="mt-2 text-sm font-medium leading-5 text-purple-950/58">
                  {item.quote ?? item.text}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="absolute bottom-0 left-1/2 grid w-full max-w-xs -translate-x-1/2 grid-cols-2 gap-3">
        <button
          type="button"
          onClick={goPrevious}
          className="liquid-control flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-100"
        >
          <ArrowLeft className="h-4 w-4" />
          {previousLabel}
        </button>
        <button
          type="button"
          onClick={goNext}
          className="liquid-button flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-bold text-purple-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-100"
        >
          {nextLabel}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
