import { ArrowRight, Images, Orbit, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { experienceSections } from '../../app/experienceRegistry'
import { riseIn } from '../../design/motion'

const sectionIcons = {
  'memory-timeline': Images,
  'photo-universe': Orbit,
} as const

export function JourneyHub() {
  const hubSections = experienceSections.filter((section) =>
    ['memory-timeline', 'photo-universe'].includes(section.id),
  )

  return (
    <main className="relative min-h-svh px-5 py-[max(1.25rem,env(safe-area-inset-top))] text-white">
      <section className="mx-auto flex min-h-[calc(100svh-2.5rem)] w-full max-w-5xl flex-col justify-center gap-6 pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-10">
        <motion.div {...riseIn} className="liquid-panel rounded-[2.15rem] px-5 py-6 sm:px-8 sm:py-8">
          <div className="relative">
            <div className="liquid-control mb-5 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-100/90">
              <Sparkles className="h-3.5 w-3.5 text-amber-200" />
              Choose a chapter
            </div>
            <h1 className="text-balance text-[clamp(2.7rem,13vw,6.4rem)] font-semibold leading-[0.9] text-white">
              Where should this little universe open next?
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-violet-50/76 sm:text-xl sm:leading-8">
              Each section is its own tiny world. Start with the Memory Timeline now,
              then come back for the Photo Universe when the globe phase arrives.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {hubSections.map((section, index) => {
            const Icon = sectionIcons[section.id as keyof typeof sectionIcons]
            const isLive = section.status === 'live'

            return (
              <motion.article
                key={section.id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 + index * 0.08, duration: 0.5 }}
                className="liquid-panel rounded-[1.8rem] p-4"
              >
                <Link
                  to={section.path}
                  className="relative flex min-h-64 flex-col justify-between rounded-[1.35rem] border border-white/10 bg-black/10 p-5 text-white transition hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-100"
                >
                  <div>
                    <div className="mb-5 flex items-center justify-between">
                      <span className="liquid-control flex h-12 w-12 items-center justify-center rounded-2xl text-fuchsia-100">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-50/74">
                        {isLive ? 'Open now' : 'Soon'}
                      </span>
                    </div>
                    <h2 className="text-3xl font-semibold leading-tight text-white">
                      {section.label}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-violet-50/68">
                      {section.description}
                    </p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-50">
                    {isLive ? 'Enter section' : 'Preview section'}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </motion.article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
