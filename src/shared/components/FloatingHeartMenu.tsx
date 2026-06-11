import { useState } from 'react'
import { Heart, Home, Images, Map, Orbit, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Link, useLocation } from 'react-router'
import { experienceSections } from '../../app/experienceRegistry'

const iconBySection: Record<string, LucideIcon> = {
  opening: Home,
  journey: Map,
  'memory-timeline': Images,
  'photo-universe': Orbit,
  'quote-puzzles': Heart,
} as const

export function FloatingHeartMenu() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const menuSections = experienceSections.filter(
    (section) => section.id !== 'quote-puzzles',
  )

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 flex flex-col items-end gap-3 sm:right-6">
      <AnimatePresence>
        {isOpen ? (
          <motion.nav
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.24 }}
            className="liquid-panel w-[min(20rem,calc(100vw-2rem))] rounded-[1.6rem] p-3"
            aria-label="Memory sections"
          >
            <div className="relative space-y-2">
              {menuSections.map((section) => {
                const Icon = iconBySection[section.id] ?? Heart
                const isActive = location.pathname === section.path

                return (
                  <Link
                    key={section.id}
                    to={section.path}
                    onClick={() => setIsOpen(false)}
                    className="liquid-control flex min-h-14 items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm text-white/88 transition hover:bg-white/[0.13] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-100"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-fuchsia-100">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 font-semibold">
                        {section.label}
                        {isActive ? (
                          <span className="rounded-full bg-fuchsia-100/18 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.16em] text-fuchsia-50">
                            Here
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-violet-50/60">
                        {section.description}
                      </span>
                    </span>
                  </Link>
                )
              })}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen((value) => !value)}
        className="liquid-button flex h-14 w-14 items-center justify-center rounded-full text-purple-950 shadow-[0_20px_54px_rgba(217,70,239,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-100"
        aria-label={isOpen ? 'Close section menu' : 'Open section menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Heart className="h-5 w-5 fill-purple-950" />}
      </motion.button>
    </div>
  )
}
