import { Gift, Heart, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { siteContent } from '../../content/siteContent'
import { riseIn, softEase } from '../../design/motion'

export function OpeningHero() {
  return (
    <main className="relative min-h-svh overflow-x-hidden px-5 py-[max(1.25rem,env(safe-area-inset-top))] text-white">
      <section className="mx-auto flex min-h-[calc(100svh-2.5rem)] w-full max-w-6xl flex-col justify-center gap-10 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-10 lg:grid lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-14">
        <motion.div {...riseIn} className="relative z-10">
          <div className="liquid-panel rounded-[2.15rem] px-5 py-6 sm:px-7 sm:py-8 lg:max-w-[42rem]">
            <div className="relative">
              <div className="liquid-control mb-6 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-100/90">
                <Sparkles className="h-3.5 w-3.5 text-amber-200" />
                {siteContent.hero.eyebrow}
              </div>

              <h1 className="text-balance text-[clamp(3rem,15vw,7rem)] font-semibold leading-[0.88] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.34)]">
                {siteContent.hero.headline.split(' ').map((word, index) => (
                  <motion.span
                    key={word}
                    className="mr-[0.18em] inline-block"
                    initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      delay: 0.12 + index * 0.12,
                      duration: 0.72,
                      ease: softEase,
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.58, duration: 0.55 }}
                className="mt-6 max-w-xl text-pretty text-xl leading-8 text-violet-50/88 sm:text-2xl sm:leading-9"
              >
                {siteContent.hero.subtitle}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.72, duration: 0.55 }}
                className="mt-4 max-w-xl text-pretty text-base leading-7 text-violet-100/74"
              >
                {siteContent.hero.body}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.86, duration: 0.55 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <button
                  type="button"
                  className="liquid-button flex h-14 min-w-44 items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-6 text-base font-bold text-purple-950 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-100"
                >
                  <Gift className="h-4 w-4" />
                  {siteContent.hero.cta}
                </button>
                <div className="liquid-control rounded-2xl px-4 py-3 text-sm leading-6 text-violet-50/78">
                  {siteContent.hero.note}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.8, ease: softEase }}
          className="relative mx-auto h-[31rem] w-full max-w-[25rem] sm:h-[34rem] lg:h-[38rem]"
        >
          <div className="absolute inset-8 rounded-full border border-fuchsia-200/10 bg-fuchsia-300/5 blur-sm" />
          <div className="absolute inset-16 rounded-full bg-violet-400/10 blur-3xl" />
          <div className="liquid-panel absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 sm:h-56 sm:w-56" />

          {siteContent.floatingPhotos.map((photo, index) => (
            <motion.article
              key={photo.id}
              className="absolute w-36 rounded-[1.35rem] border border-white/20 bg-white/90 p-2 text-purple-950 shadow-[0_22px_60px_rgba(0,0,0,0.42)] sm:w-48"
              style={{
                rotate: photo.rotate,
                left: index === 0 ? '0%' : index === 1 ? '47%' : '18%',
                top: index === 0 ? '8%' : index === 1 ? '25%' : '51%',
              }}
              animate={{
                y: [0, index % 2 === 0 ? -14 : 14, 0],
                rotate: [
                  photo.rotate,
                  index % 2 === 0 ? '-4deg' : '10deg',
                  photo.rotate,
                ],
              }}
              transition={{
                duration: 7 + index,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div
                className={`aspect-[4/5] rounded-[1rem] bg-gradient-to-br ${photo.gradient} shadow-inner`}
              >
                <div className="flex h-full items-center justify-center">
                  <Heart className="h-10 w-10 fill-white/45 text-white/80 drop-shadow-[0_0_18px_rgba(255,255,255,0.55)]" />
                </div>
              </div>
              <div className="px-1.5 py-3">
                <h2 className="text-base font-black leading-none sm:text-lg">
                  {photo.title}
                </h2>
                <p className="mt-1 text-[0.7rem] font-medium leading-4 text-purple-950/58 sm:text-xs">
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
