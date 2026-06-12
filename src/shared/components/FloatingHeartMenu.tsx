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
            transition={{ duration: 0.26 }}
            className="glass-panel w-[min(19rem,calc(100vw-2rem))] rounded-3xl p-2.5"
            aria-label="Memory sections"
          >
            <div className="relative space-y-1.5">
              {menuSections.map((section) => {
                const Icon = iconBySection[section.id] ?? Heart
                const isActive = location.pathname === section.path

                return (
                  <Link
                    key={section.id}
                    to={section.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex min-h-13 items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orchid ${
                      isActive
                        ? 'bg-white/10 text-starlight'
                        : 'text-moon hover:bg-white/[0.06] hover:text-starlight'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        isActive ? 'bg-orchid/25 text-starlight' : 'bg-white/8 text-orchid'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 font-semibold">
                        {section.label}
                        {isActive ? (
                          <Heart className="h-3 w-3 fill-blush text-blush" aria-hidden="true" />
                        ) : null}
                      </span>
                      <span className="mt-0.5 block truncate text-xs leading-4 text-faint">
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
        className="btn-primary flex h-14 w-14 items-center justify-center rounded-full shadow-[0_14px_44px_rgba(200,148,252,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
        aria-label={isOpen ? 'Close section menu' : 'Open section menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Heart className="h-5 w-5 fill-[#2b1048]" />}
      </motion.button>
    </div>
  )
}
