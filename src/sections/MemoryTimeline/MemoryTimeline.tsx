import { useCallback, useMemo, useState } from 'react'
import { CalendarHeart, Dices } from 'lucide-react'
import { motion } from 'motion/react'
import { orderedMemoryTimelineItems } from '../../content/memoryTimeline'
import type { MemoryTimelineItem, RevealPhotoItem } from '../../content/types'
import { softEase } from '../../design/motion'
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
      <section className="mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-3xl flex-col items-center justify-center gap-3 pb-[max(4rem,env(safe-area-inset-bottom))] pt-2 sm:gap-5 lg:gap-3">
        {/* Compact header — gives the stage to the stack */}
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: softEase }}
          className="night-veil shrink-0 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2.5 text-champagne/85">
            <CalendarHeart className="h-3.5 w-3.5" />
            <span className="type-eyebrow">Memory Timeline</span>
          </div>
          <h1 className="text-glow text-balance text-[clamp(1.7rem,6.5vw,2.6rem)] font-medium leading-[1.05]">
            A stack of tiny
            <span className="type-quote text-aurora block pb-1">forever moments.</span>
          </h1>
        </motion.header>

        {/* The stack owns the screen */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.16, duration: 0.75, ease: softEase }}
          className="flex w-full flex-1 items-center justify-center"
        >
          <PhotoShuffleStack
            items={memories}
            activeIndex={activeIndex}
            onActiveIndexChange={goToIndex}
            onOpenItem={setOpenIndex}
          />
        </motion.div>

        {/* Slim control rail — dots, counter, surprise */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.6, ease: softEase }}
          className="glass-chip flex shrink-0 items-center gap-4 rounded-full py-2 pl-5 pr-2"
        >
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
