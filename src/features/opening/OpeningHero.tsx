import { Heart, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { siteContent } from '../../content/siteContent'
import {
  getOpeningStoryPhotos,
  openingStoryGradients,
} from '../../content/openingStory'
import { useRichMotion } from '../../shared/lib/richMotion'
import { publicAssetPath } from '../../shared/lib/assetPath'
import { BirthdayWish } from './BirthdayWish'
import { CakeMoment } from './CakeMoment'
import { StoryOfYou } from './StoryOfYou'
import { WishOverture } from './WishOverture'

/**
 * The opening overture at `/` — a three-act birthday cinematic:
 *
 *   1. WishOverture — the birthday quote rises out of the night sky.
 *   2. StoryOfYou — a scroll cinema telling one sentence in three verses
 *      ("you were born" → "became a princess" → "to be mine"), each verse
 *      performed by the photos in `src/content/openingPhotos/group1|2|3/`.
 *   3. CakeMoment — the interactive 3D drip cake; blow the candles to
 *      reveal the door into the journey.
 *
 * Without rich motion (reduced motion or no WebGL) the page falls back to a
 * single calm column with the story verses as static polaroid rows, the
 * original tappable candle, and an ungated CTA.
 */

export function OpeningHero() {
  const { rich, compact } = useRichMotion()

  if (!rich) {
    return <OpeningStatic />
  }

  return (
    <main className="relative text-starlight">
      <WishOverture />
      <StoryOfYou />
      <CakeMoment compact={compact} />
    </main>
  )
}

const STATIC_TILTS = ['-6deg', '5deg', '-3deg', '4deg', '-5deg', '3deg'] as const

/** Calm single-column fallback: quote, the story verses, the candle, the door. */
function OpeningStatic() {
  const hero = siteContent.hero

  return (
    <main className="relative min-h-svh px-6 py-[max(3rem,env(safe-area-inset-top))] text-starlight">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-12 pb-[max(3rem,env(safe-area-inset-bottom))] text-center">
        <header className="night-veil">
          <div className="mb-6 inline-flex items-center gap-2.5 text-champagne/85">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="type-eyebrow">{hero.eyebrow}</span>
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <h1 className="text-glow text-balance font-medium leading-[1.04]">
            <span className="block text-[clamp(2.4rem,9vw,4rem)]">{hero.headline}</span>
            <span className="type-quote text-aurora block pb-2 pt-1 text-[clamp(2.8rem,11vw,4.8rem)]">
              {hero.headlineAccent}
            </span>
          </h1>
          <p className="type-quote mx-auto mt-6 max-w-xl text-pretty text-lg leading-8 text-moon">
            {hero.quote}
          </p>
        </header>

        {/* The story of you, told plainly: each verse and a couple of its photos */}
        {hero.story.verses.map((verse, verseIndex) => {
          const photos = getOpeningStoryPhotos(verse.folder).slice(0, 2)

          return (
            <section key={verse.id} className="flex flex-col items-center gap-6">
              <div className="night-veil">
                <p className="type-quote text-sm text-moon">{verse.lead}</p>
                <p className="font-display text-glow mt-1 text-[clamp(1.5rem,6vw,2rem)] font-medium leading-snug">
                  {verse.accent}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-5">
                {photos.map((photo, index) => (
                  <div
                    key={`${verse.id}-${index}`}
                    className="polaroid w-36 rounded-[1rem] p-1.5 sm:w-40"
                    style={{
                      rotate: STATIC_TILTS[(verseIndex * 2 + index) % STATIC_TILTS.length],
                    }}
                  >
                    <div
                      className={`relative aspect-[4/5] overflow-hidden rounded-[0.6rem] bg-gradient-to-br ${openingStoryGradients[index % openingStoryGradients.length]}`}
                    >
                      <img
                        src={publicAssetPath(photo)}
                        alt={`${verse.accent} — memory ${index + 1}`}
                        className="absolute inset-0 h-full w-full object-cover"
                        draggable={false}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none'
                        }}
                      />
                      <Heart className="absolute left-1/2 top-1/2 -z-10 h-7 w-7 -translate-x-1/2 -translate-y-1/2 fill-white/50 text-white/85" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}

        {/* The birthday beat — the candle still gets her wish */}
        <BirthdayWish />

        <div className="flex flex-col items-center gap-4">
          <Link
            to="/journey"
            className="btn-primary flex h-14 w-full max-w-[19rem] items-center justify-center gap-2 rounded-2xl px-8 text-base font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
          >
            <Heart className="h-4 w-4 fill-[#2b1048]" />
            {hero.cake.cta}
          </Link>
          <p className="type-quote text-sm text-faint">{hero.cake.note}</p>
        </div>
      </div>
    </main>
  )
}
