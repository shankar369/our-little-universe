import { useCallback, useMemo, useState } from 'react'
import { CalendarHeart, Dice5 } from 'lucide-react'
import { motion } from 'motion/react'
import { orderedMemoryTimelineItems } from '../../content/memoryTimeline'
import type { MemoryTimelineItem, RevealPhotoItem } from '../../content/types'
import { riseIn, softEase } from '../../design/motion'
import { PhotoRevealDialog } from '../../shared/components/PhotoReveal/PhotoRevealDialog'
import { PhotoShuffleStack } from '../../shared/components/ShuffleCards/PhotoShuffleStack'

function wrapIndex(index: number, length: number) {
  return (index + length) % length
}

type TimelinePhotoItem = MemoryTimelineItem & RevealPhotoItem

function toRevealPhotoItem(item: MemoryTimelineItem): TimelinePhotoItem {
  return {
    ...item,
    heading: item.title,
    name: item.title,
    text: item.story,
    label: item.dateLabel,
  }
}

export function MemoryTimeline() {
  const memories = useMemo(
    () => orderedMemoryTimelineItems.map(toRevealPhotoItem),
    [],
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const activeMemory = memories[activeIndex]
  const openMemory = openIndex === null ? null : memories[openIndex]

  const goToIndex = useCallback(
    (nextIndex: number) => {
      setActiveIndex(wrapIndex(nextIndex, memories.length))
    },
    [memories.length],
  )

  function openRandomMemory() {
    const nextIndex = Math.floor(Math.random() * memories.length)
    setActiveIndex(nextIndex)
    setOpenIndex(nextIndex)
  }

  function openNextMemory() {
    setOpenIndex((current) =>
      current === null ? activeIndex : wrapIndex(current + 1, memories.length),
    )
  }

  function openPreviousMemory() {
    setOpenIndex((current) =>
      current === null ? activeIndex : wrapIndex(current - 1, memories.length),
    )
  }

  return (
    <main className="relative min-h-svh px-5 py-[max(1.25rem,env(safe-area-inset-top))] text-white">
      <section className="mx-auto grid min-h-[calc(100svh-2.5rem)] w-full max-w-6xl gap-5 pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-10 lg:pt-8">
        <motion.div {...riseIn} className="liquid-panel rounded-[2.15rem] px-5 py-5 sm:px-7 sm:py-8">
          <div className="relative">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="liquid-control inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-100/90">
                <CalendarHeart className="h-3.5 w-3.5 text-amber-200" />
                Memory Timeline
              </div>
              <button
                type="button"
                onClick={openRandomMemory}
                className="liquid-button inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-xs font-bold uppercase tracking-[0.16em] text-purple-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-100"
              >
                <Dice5 className="h-4 w-4" />
                Pick one
              </button>
            </div>

            <h1 className="text-balance text-[clamp(2.35rem,10.5vw,6.5rem)] font-semibold leading-[0.92] text-white lg:leading-[0.9]">
              A stack of tiny forever moments.
            </h1>
            <p className="mt-4 text-pretty text-sm leading-6 text-violet-50/76 sm:text-xl sm:leading-8">
              Swipe through the photo stack, tap a card to frame it, and let each
              quote hold the memory until the real photos arrive.
            </p>

            <div className="mt-5 grid grid-cols-[3.35rem_1fr] gap-3 sm:mt-7 sm:grid-cols-[3.75rem_1fr] sm:gap-4">
              <div className="relative flex flex-col items-center gap-2 sm:gap-3">
                <div className="absolute bottom-6 top-6 w-px bg-gradient-to-b from-fuchsia-100/10 via-fuchsia-100/35 to-fuchsia-100/10" />
                {memories.map((memory, index) => (
                  <button
                    type="button"
                    key={memory.id}
                    onClick={() => goToIndex(index)}
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border text-sm font-black transition sm:h-12 sm:w-12 ${
                      index === activeIndex
                        ? 'border-amber-100/50 bg-amber-100/20 text-amber-50 shadow-[0_0_28px_rgba(253,230,138,0.2)]'
                        : 'border-white/12 bg-white/[0.06] text-violet-50/52'
                    }`}
                    aria-label={`Show ${memory.title}`}
                  >
                    {memory.order}
                  </button>
                ))}
              </div>

              <div className="space-y-3 pt-1">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fuchsia-100/56">
                  {activeMemory.dateLabel}
                </p>
                <h2 className="text-xl font-semibold leading-tight text-white sm:text-2xl">
                  {activeMemory.title}
                </h2>
                <p className="line-clamp-2 text-sm leading-6 text-violet-50/68 sm:line-clamp-none">
                  {activeMemory.quote}
                </p>
                <div className="liquid-control inline-flex rounded-full px-3 py-1.5 text-xs font-semibold text-violet-50/74">
                  {activeIndex + 1} of {memories.length}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.64, ease: softEase }}
          className="relative"
        >
          <PhotoShuffleStack
            items={memories}
            activeIndex={activeIndex}
            onActiveIndexChange={goToIndex}
            onOpenItem={setOpenIndex}
          />
        </motion.div>
      </section>

      <PhotoRevealDialog
        item={openMemory}
        onClose={() => setOpenIndex(null)}
        onNext={openNextMemory}
        onPrevious={openPreviousMemory}
      />
    </main>
  )
}
