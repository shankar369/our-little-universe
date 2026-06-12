import { useCallback, useMemo, useState } from 'react'
import { CalendarHeart, Dices } from 'lucide-react'
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
    <main className="relative min-h-svh px-6 py-[max(1.5rem,env(safe-area-inset-top))] text-starlight">
      <section className="mx-auto grid min-h-[calc(100svh-3rem)] w-full max-w-5xl content-center gap-8 pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-6 lg:grid-cols-[0.95fr_1.05fr] lg:grid-rows-[auto_auto] lg:items-center lg:gap-x-12 lg:gap-y-8">
        {/* Heading */}
        <motion.div
          {...riseIn}
          className="night-veil text-center lg:col-start-1 lg:row-start-1 lg:self-end lg:text-left"
        >
          <div className="mb-5 inline-flex items-center gap-2.5 text-champagne/85">
            <CalendarHeart className="h-3.5 w-3.5" />
            <span className="type-eyebrow">Memory Timeline</span>
          </div>
          <h1 className="text-glow text-balance text-[clamp(2.1rem,8.5vw,3.4rem)] font-medium leading-[1.04]">
            A stack of tiny
            <span className="type-quote text-aurora block pb-1">forever moments.</span>
          </h1>
          <p className="type-quote mx-auto mt-4 max-w-sm text-pretty text-base leading-7 text-moon lg:mx-0">
            Swipe through the stack, and tap a card to hold the whole memory.
          </p>
        </motion.div>

        {/* Shuffle stack */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.7, ease: softEase }}
          className="lg:col-start-2 lg:row-span-2 lg:row-start-1"
        >
          <PhotoShuffleStack
            items={memories}
            activeIndex={activeIndex}
            onActiveIndexChange={goToIndex}
            onOpenItem={setOpenIndex}
          />
        </motion.div>

        {/* Active memory details */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.65, ease: softEase }}
          className="glass-panel mx-auto w-full max-w-md rounded-3xl px-6 py-5 lg:col-start-1 lg:row-start-2 lg:mx-0 lg:self-start"
        >
          {/* The polaroid already shows date, title, and quote on mobile; avoid repeating them. */}
          <div className="hidden lg:block">
            <p className="type-eyebrow text-champagne/80">{activeMemory.dateLabel}</p>
            <h2 className="mt-2.5 font-display text-xl font-semibold leading-tight sm:text-2xl">
              {activeMemory.title}
            </h2>
            <p className="type-quote mt-2 line-clamp-2 text-sm leading-6 text-moon/90">
              {activeMemory.quote}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 lg:mt-5">
            <div className="flex items-center gap-2" role="tablist" aria-label="Memories">
              {memories.map((memory, index) => (
                <button
                  type="button"
                  key={memory.id}
                  role="tab"
                  aria-selected={index === activeIndex}
                  onClick={() => goToIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-7 bg-champagne shadow-[0_0_14px_rgba(244,217,166,0.5)]'
                      : 'w-2.5 bg-starlight/25 hover:bg-starlight/45'
                  }`}
                  aria-label={`Show ${memory.title}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium tracking-wide text-faint">
                {activeIndex + 1} / {memories.length}
              </span>
              <button
                type="button"
                onClick={openRandomMemory}
                className="btn-ghost flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
                aria-label="Open a random memory"
                title="Surprise me"
              >
                <Dices className="h-4.5 w-4.5 text-champagne" />
              </button>
            </div>
          </div>
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
