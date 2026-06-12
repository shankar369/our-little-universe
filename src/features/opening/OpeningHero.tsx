import { Heart, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { siteContent } from '../../content/siteContent'
import { riseIn, softEase } from '../../design/motion'

export function OpeningHero() {
  const headlineWords = siteContent.hero.headline.split(' ')

  return (
    <main className="relative min-h-svh overflow-x-hidden px-6 py-[max(1.5rem,env(safe-area-inset-top))] text-starlight">
      <section className="mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-6xl flex-col items-center justify-center gap-12 pb-[max(2rem,env(safe-area-inset-bottom))] lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
        <motion.div {...riseIn} className="night-veil relative z-10 max-w-xl text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2.5 text-champagne/85">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="type-eyebrow">{siteContent.hero.eyebrow}</span>
            <Sparkles className="h-3.5 w-3.5 lg:hidden" />
          </div>

          <h1 className="text-glow text-balance text-[clamp(2.8rem,13vw,5.6rem)] font-medium leading-[0.98]">
            {headlineWords.map((word, index) => {
              const isLast = index === headlineWords.length - 1

              return (
                <motion.span
                  key={word}
                  className={`mr-[0.22em] inline-block ${isLast ? 'type-quote text-aurora pr-1' : ''}`}
                  initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    delay: 0.15 + index * 0.14,
                    duration: 0.8,
                    ease: softEase,
                  }}
                >
                  {word}
                </motion.span>
              )
            })}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.66, duration: 0.6, ease: softEase }}
            className="type-quote mx-auto mt-6 max-w-md text-pretty text-lg leading-7 text-moon lg:mx-0 lg:text-xl lg:leading-8"
          >
            {siteContent.hero.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: softEase }}
            className="mx-auto mt-4 max-w-md text-pretty text-sm leading-6 text-faint lg:mx-0"
          >
            {siteContent.hero.body}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.6, ease: softEase }}
            className="mt-9 flex flex-col items-center gap-4 lg:items-start"
          >
            <Link
              to="/journey"
              className="btn-primary flex h-14 w-full max-w-[19rem] items-center justify-center gap-2 rounded-2xl px-8 text-base font-semibold active:scale-[0.985] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
            >
              <Heart className="h-4 w-4 fill-[#2b1048]" />
              {siteContent.hero.cta}
            </Link>
            <p className="type-quote text-sm text-faint">{siteContent.hero.note}</p>
          </motion.div>
        </motion.div>

        {/* Polaroid constellation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.9, ease: softEase }}
          className="relative mx-auto h-[23rem] w-full max-w-[22rem] sm:h-[26rem] lg:h-[36rem] lg:max-w-[26rem]"
        >
          <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orchid/15 sm:h-72 sm:w-72 lg:h-96 lg:w-96" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orchid/10 blur-3xl sm:h-56 sm:w-56" />

          {siteContent.floatingPhotos.map((photo, index) => (
            <motion.article
              key={photo.id}
              className="polaroid absolute w-32 rounded-[0.9rem] p-1.5 text-[#2b1048] sm:w-40 lg:w-48 lg:p-2"
              style={{
                rotate: photo.rotate,
                left: index === 0 ? '2%' : index === 1 ? '56%' : '28%',
                top: index === 0 ? '2%' : index === 1 ? '14%' : '44%',
              }}
              animate={{
                y: [0, index % 2 === 0 ? -10 : 10, 0],
                rotate: [
                  photo.rotate,
                  index % 2 === 0 ? '-3deg' : '8deg',
                  photo.rotate,
                ],
              }}
              transition={{
                duration: 8 + index * 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div
                className={`aspect-[4/5] rounded-[0.55rem] bg-gradient-to-br ${photo.gradient}`}
              >
                <div className="flex h-full items-center justify-center">
                  <Heart className="h-8 w-8 fill-white/50 text-white/85 drop-shadow-[0_0_16px_rgba(255,255,255,0.5)]" />
                </div>
              </div>
              <div className="px-1 pb-1.5 pt-2.5 lg:pb-2 lg:pt-3">
                <h2 className="font-display text-sm font-semibold leading-none lg:text-base">
                  {photo.title}
                </h2>
                <p className="type-quote mt-1 text-[0.66rem] leading-3.5 text-[#2b1048]/60 lg:text-xs lg:leading-4">
                  {photo.caption}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </main>
  )
}
