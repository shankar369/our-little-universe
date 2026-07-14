import { useRef } from 'react'
import { Crown, Heart, Sparkles, type LucideIcon } from 'lucide-react'
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { siteContent } from '../../content/siteContent'
import type { StoryVerse } from '../../content/types'
import {
  getOpeningStoryPhotos,
  openingStoryGradients,
} from '../../content/openingStory'
import { publicAssetPath } from '../../shared/lib/assetPath'
import { useRichMotion } from '../../shared/lib/richMotion'

/**
 * Act 2 of the opening overture: the story of you — one sentence told in three
 * scroll verses ("you were born" → "became a princess" → "to be mine"). Each
 * verse speaks its line center stage, lifts it toward the sky, then lets its
 * photos perform underneath with a choreography of its own: childhood photos
 * bloom out of a star-point, the princess years fan open like a tiara, and the
 * final photos arrive from opposite edges to lean into each other. A giant
 * translucent signature glyph (sparkle / crown / heart) glows behind each
 * verse's photos. Scroll position IS the timeline; everything maps through
 * MotionValues, no per-frame React state.
 */

/** Each verse owns 30% of the track; the outro takes the last stretch. */
const SEGMENT = 0.3

/** Verse-local beats (fractions of one verse's segment). */
const CARDS_IN = 0.26
const CARD_STAGGER = 0.06
const CARD_TRAVEL = 0.2
const HOLD_END = 0.86
const VERSE_OUT = 0.97

type Choreography = StoryVerse['choreography']

/** A card's place on the stage: `x` in vw, `y` in svh, rotate deg, scale. */
type Pose = { x: number; y: number; r: number; s: number }

/**
 * Resting layouts per photo count. Desktop spreads sideways; compact (≤640px)
 * cascades more vertically so every photo stays visible on a narrow screen
 * and nothing climbs into the verse text above (which ends ~30svh over
 * center once lifted).
 */
type PoseTable = { desktop: Pose[][]; compact: Pose[][] }

/** Bloom clusters: one primary photo leading, satellites drifting near. */
const BLOOM_LAYOUTS: PoseTable = {
  desktop: [
    [{ x: 0, y: 0, r: -3, s: 1 }],
    [
      { x: -11, y: 1, r: -5, s: 0.98 },
      { x: 11, y: -2, r: 4, s: 0.86 },
    ],
    [
      { x: 0, y: -1, r: -2, s: 1 },
      { x: -19, y: 5, r: -8, s: 0.68 },
      { x: 19, y: -4, r: 7, s: 0.62 },
    ],
    [
      { x: -11, y: -2, r: -5, s: 0.9 },
      { x: 12, y: -6, r: 5, s: 0.7 },
      { x: -20, y: 9, r: -9, s: 0.56 },
      { x: 19, y: 8, r: 8, s: 0.6 },
    ],
  ],
  compact: [
    [{ x: 0, y: 2, r: -3, s: 1 }],
    [
      { x: -12, y: -5, r: -5, s: 0.95 },
      { x: 13, y: 13, r: 4, s: 0.8 },
    ],
    [
      { x: 0, y: -5, r: -3, s: 1 },
      { x: -22, y: 17, r: -8, s: 0.7 },
      { x: 22, y: 15, r: 7, s: 0.64 },
    ],
    [
      { x: -12, y: -7, r: -5, s: 0.88 },
      { x: 15, y: -4, r: 5, s: 0.64 },
      { x: -21, y: 17, r: -9, s: 0.58 },
      { x: 19, y: 18, r: 8, s: 0.6 },
    ],
  ],
}

/** Meet layouts: sides first (entering from the edges), center cards last. */
const MEET_LAYOUTS: PoseTable = {
  desktop: [
    [{ x: 0, y: 0, r: -2, s: 1 }],
    [
      { x: -10, y: 2, r: -6, s: 0.96 },
      { x: 10, y: -2, r: 5, s: 0.94 },
    ],
    [
      { x: -17, y: 3, r: -8, s: 0.8 },
      { x: 17, y: -1, r: 7, s: 0.8 },
      { x: 0, y: 0, r: 0, s: 1 },
    ],
    [
      { x: -19, y: 3, r: -9, s: 0.74 },
      { x: 19, y: -2, r: 8, s: 0.74 },
      { x: -6, y: -2, r: -2, s: 0.94 },
      { x: 6, y: 2, r: 3, s: 0.92 },
    ],
  ],
  compact: [
    [{ x: 0, y: 2, r: -2, s: 1 }],
    [
      { x: -13, y: -6, r: -7, s: 0.95 },
      { x: 13, y: 12, r: 6, s: 0.9 },
    ],
    // 3–4 photos: the convergence. The two of them arrive side by side at
    // the top — one from each edge — and the couple photo rises from below
    // to land big and centered beneath them: every road was leading here.
    // (The last photo in the folder becomes the big destination photo.)
    [
      { x: -16, y: -4, r: -7, s: 0.82 },
      { x: 16, y: -4, r: 7, s: 0.82 },
      { x: 0, y: 20, r: -2, s: 1.15 },
    ],
    [
      { x: -16, y: -5, r: -7, s: 0.78 },
      { x: 16, y: -5, r: 7, s: 0.78 },
      { x: -11, y: 13, r: -4, s: 0.92 },
      { x: 12, y: 27, r: 5, s: 0.98 },
    ],
  ],
}

/**
 * Compact zigzag trails for 3–4 photos: on a phone there is no sideways room,
 * so each card owns its own vertical band, alternating left / right down the
 * screen — the photos only kiss at the corners and every one reads clearly.
 * The band starts at -6svh (just under the lifted verse text) and steps down.
 */
const ZIGZAG_COMPACT: Pose[][] = [
  [
    { x: -19, y: -6, r: -9, s: 1 },
    { x: 19, y: 10, r: 4, s: 1 },
    { x: -15, y: 26, r: 9, s: 0.98 },
  ],
  [
    { x: -19, y: -6, r: -9, s: 0.98 },
    { x: 19, y: 6, r: 6, s: 0.96 },
    { x: -17, y: 18, r: -4, s: 0.96 },
    { x: 18, y: 30, r: 8, s: 0.94 },
  ],
]

/** Cards fan open from a neat stack into a gentle tiara arc. */
function fanPose(index: number, count: number, compact: boolean): Pose {
  if (count <= 1) {
    return { x: 0, y: compact ? 2 : 0, r: -2, s: 1 }
  }
  // A phone fan of 3+ lands in the zigzag trail (the fanning entrance and
  // the tilts keep the tiara feeling on the way in).
  if (compact && count >= 3) {
    return ZIGZAG_COMPACT[count - 3][index]
  }
  const spread = count === 2 ? 24 : 34
  const r = (index / (count - 1) - 0.5) * spread
  const xPerDeg = compact ? 1.3 : 0.95
  const droop = compact ? 0.85 : 0.2
  const baseY = compact ? 0 : -1
  return { x: r * xPerDeg, y: Math.abs(r) * droop + baseY, r, s: 1 - Math.abs(r) * 0.006 }
}

/**
 * Desktop compositions sit a little below center: on short landscape
 * viewports the cards are tall enough to climb into the lifted verse text
 * without this breathing room.
 */
const DESKTOP_Y_SHIFT = 4.5

function restingPose(
  kind: Choreography,
  index: number,
  count: number,
  compact: boolean,
): Pose {
  const pose =
    kind === 'fan'
      ? fanPose(index, count, compact)
      : (compact
          ? (kind === 'bloom' ? BLOOM_LAYOUTS : MEET_LAYOUTS).compact
          : (kind === 'bloom' ? BLOOM_LAYOUTS : MEET_LAYOUTS).desktop)[
          Math.min(count, 4) - 1
        ][index]
  return compact ? pose : { ...pose, y: pose.y + DESKTOP_Y_SHIFT }
}

function enterPose(kind: Choreography, to: Pose): Pose {
  switch (kind) {
    case 'bloom':
      // A star-point at center that the photo grows out of.
      return { x: to.x * 0.2, y: to.y * 0.2 + 5, r: to.r, s: 0.12 }
    case 'fan':
      // The whole hand of cards starts as one neat stack, slightly low.
      return { x: 0, y: 11, r: 0, s: 0.92 }
    case 'meet': {
      // Side cards sweep in from beyond the edges; center cards rise up late.
      if (to.x === 0) {
        return { x: 0, y: to.y + 15, r: to.r, s: 0.9 }
      }
      const side = to.x < 0 ? -1 : 1
      return { x: side * 70, y: to.y + 3, r: to.r * 2.4, s: 0.97 }
    }
  }
}

/** Where the card slowly drifts while the verse holds — keeps the stage alive. */
function holdPose(kind: Choreography, to: Pose, index: number): Pose {
  switch (kind) {
    case 'bloom':
      return { ...to, y: to.y + (index % 2 === 0 ? -1.6 : 1.3) }
    case 'fan':
      return { ...to, r: to.r + Math.sign(to.r) * 1.4, y: to.y - 0.8 }
    case 'meet':
      // Gentle enough that the zigzag trail's corner kisses stay kisses.
      return { ...to, x: to.x * 0.94, r: to.r * 0.92 }
  }
}

/** How the verse lets go of its cards as the next verse takes the stage. */
function exitPose(kind: Choreography, from: Pose): Pose {
  switch (kind) {
    case 'bloom':
      // Rise and fade like sky lanterns.
      return { ...from, y: from.y - 15, r: from.r - 3, s: from.s * 1.03 }
    case 'fan':
      // The fan folds shut and lifts away.
      return { x: from.x * 0.4, y: from.y - 9, r: from.r * 0.35, s: from.s * 0.95 }
    case 'meet':
      return { ...from, y: from.y - 6, s: from.s * 0.96 }
  }
}

type VerseCardProps = {
  kind: Choreography
  photo: string
  gradient: string
  alt: string
  index: number
  count: number
  compact: boolean
  /** Verse-local progress, 0 → 1 across this verse's segment. */
  local: MotionValue<number>
}

function VerseCard({
  kind,
  photo,
  gradient,
  alt,
  index,
  count,
  compact,
  local,
}: VerseCardProps) {
  const to = restingPose(kind, index, count, compact)
  const from = enterPose(kind, to)
  const hold = holdPose(kind, to, index)
  const out = exitPose(kind, hold)
  const in0 = CARDS_IN + index * CARD_STAGGER
  const in1 = in0 + CARD_TRAVEL

  // Four beats per channel: enter → rest → (slow hold drift) → exit.
  const beats = [in0, in1, HOLD_END, VERSE_OUT]
  const x = useTransform(local, beats, [from.x, to.x, hold.x, out.x])
  const y = useTransform(local, beats, [from.y, to.y, hold.y, out.y])
  const rotate = useTransform(local, beats, [from.r, to.r, hold.r, out.r])
  const scale = useTransform(local, beats, [from.s, to.s, hold.s, out.s])
  const opacity = useTransform(
    local,
    [in0, in0 + 0.08, HOLD_END, VERSE_OUT - 0.01],
    [0, 1, 1, 0],
  )
  const blurPx = useTransform(local, [in0, in1], [16, 0])
  const blurFilter = useMotionTemplate`blur(${blurPx}px)`
  const xUnit = useMotionTemplate`${x}vw`
  const yUnit = useMotionTemplate`${y}svh`

  // Bloom lists its primary photo first (satellites drift behind it); fan and
  // meet enter back-to-front, so later cards land on top.
  const zIndex = kind === 'bloom' ? count - index : index + 1

  // The zigzag trail fits three-plus cards on a phone by trimming their
  // width a notch; bloom keeps its big primary childhood photo.
  const width =
    compact && count >= 3 && kind !== 'bloom'
      ? 'w-[min(42vw,15.5rem)]'
      : 'w-[min(48vw,15.5rem)]'

  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ zIndex }}
    >
      <motion.figure
        style={{
          x: xUnit,
          y: yUnit,
          rotate,
          scale,
          opacity,
          // Only the star-point bloom melts out of a blur; the other
          // choreographies speak through motion alone.
          filter: kind === 'bloom' ? blurFilter : undefined,
        }}
        className={`${width} lg:w-[min(19rem,34svh)]`}
      >
        <div className="polaroid rounded-[1rem] p-2 lg:p-2.5">
          <div
            className={`relative aspect-[4/5] overflow-hidden rounded-[0.6rem] bg-gradient-to-br ${gradient}`}
          >
            <img
              src={publicAssetPath(photo)}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
            <Heart className="absolute left-1/2 top-1/2 -z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 fill-white/50 text-white/85" />
          </div>
        </div>
      </motion.figure>
    </div>
  )
}

function VerseHeading({ verse, local }: { verse: StoryVerse; local: MotionValue<number> }) {
  // The whole line speaks center stage, then lifts to the sky as the photos
  // take over beneath it.
  const lift = useTransform(local, [0.2, 0.36], [0, -27])
  const liftUnit = useMotionTemplate`${lift}svh`
  const scale = useTransform(local, [0.2, 0.36], [1, 0.8])
  const opacity = useTransform(local, [HOLD_END, 0.95], [1, 0])

  const leadOpacity = useTransform(local, [0.03, 0.1], [0, 1])
  const leadY = useTransform(local, [0.03, 0.1], [18, 0])

  const accentOpacity = useTransform(local, [0.08, 0.16], [0, 1])
  const accentY = useTransform(local, [0.08, 0.16], [26, 0])
  const accentBlur = useTransform(local, [0.08, 0.16], [12, 0])
  const accentFilter = useMotionTemplate`blur(${accentBlur}px)`

  const whisperOpacity = useTransform(local, [0.14, 0.22], [0, 1])
  const whisperY = useTransform(local, [0.14, 0.22], [12, 0])

  return (
    <div className="absolute inset-x-0 top-1/2 z-30 -translate-y-1/2">
      <motion.div
        style={{ y: liftUnit, scale, opacity }}
        className="night-veil px-6 text-center"
      >
        <motion.p
          style={{ opacity: leadOpacity, y: leadY }}
          className="font-display text-glow mx-auto max-w-xl text-balance text-[clamp(1.35rem,4.6vw,2rem)] font-medium leading-snug text-starlight"
        >
          {verse.lead}
        </motion.p>
        <motion.p
          style={{ opacity: accentOpacity, y: accentY, filter: accentFilter }}
          className="type-quote text-aurora pb-1 pt-1 text-[clamp(2.1rem,8.5vw,3.4rem)] leading-[1.05]"
        >
          {verse.accent}
        </motion.p>
        <motion.p
          style={{ opacity: whisperOpacity, y: whisperY }}
          className="type-quote mx-auto mt-2 max-w-md text-pretty text-[clamp(0.95rem,3.2vw,1.15rem)] text-moon"
        >
          {verse.whisper}
        </motion.p>
      </motion.div>
    </div>
  )
}

/**
 * The verse's signature, written huge and faint behind the photos: a sparkle
 * for the night she was born, a crown for the princess years, a heart for
 * "to be mine". It swells in as the photos arrive and drifts while they hold.
 */
const EMBLEMS: Record<
  Choreography,
  { icon: LucideIcon; tint: string; y: number }
> = {
  bloom: { icon: Sparkles, tint: 'text-champagne/30', y: -2 },
  fan: { icon: Crown, tint: 'text-champagne/30', y: -5 },
  meet: { icon: Heart, tint: 'fill-blush/15 text-blush/35', y: 2 },
}

function VerseEmblem({ kind, local }: { kind: Choreography; local: MotionValue<number> }) {
  const spec = EMBLEMS[kind]
  // The glyph flares to full presence while the photos fly in, then settles
  // to a steady glow behind them for the hold.
  const opacity = useTransform(
    local,
    [0.16, 0.3, 0.52, 0.84, 0.94],
    [0, 1, 0.8, 0.8, 0],
  )
  const scale = useTransform(local, [0.16, 0.5, VERSE_OUT], [0.45, 1, 1.1])
  const rotate = useTransform(local, [0.16, VERSE_OUT], [-10, 6])
  const y = useTransform(local, [0.16, VERSE_OUT], [spec.y + 4, spec.y - 5])
  const yUnit = useMotionTemplate`${y}svh`
  const Icon = spec.icon

  return (
    <div
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <motion.span style={{ y: yUnit, scale, rotate, opacity }} className="block">
        <Icon
          className={`h-[min(64svh,42rem)] w-[min(64svh,42rem)] ${spec.tint}`}
          style={{ strokeWidth: 0.4 }}
        />
      </motion.span>
    </div>
  )
}

type StoryVerseStageProps = {
  verse: StoryVerse
  /** Global track progress where this verse's segment begins. */
  start: number
  progress: MotionValue<number>
  compact: boolean
}

function StoryVerseStage({ verse, start, progress, compact }: StoryVerseStageProps) {
  const local = useTransform(progress, [start, start + SEGMENT], [0, 1])
  const photos = getOpeningStoryPhotos(verse.folder)

  return (
    <div className="pointer-events-none absolute inset-0">
      <VerseEmblem kind={verse.choreography} local={local} />
      {photos.map((photo, index) => (
        <VerseCard
          // Keyed on the breakpoint so pose constants rebuild when it flips.
          key={`${verse.id}-${index}-${compact ? 'c' : 'd'}`}
          kind={verse.choreography}
          photo={photo}
          gradient={openingStoryGradients[index % openingStoryGradients.length]}
          alt={`${verse.accent} — memory ${index + 1}`}
          index={index}
          count={photos.length}
          compact={compact}
          local={local}
        />
      ))}
      <VerseHeading verse={verse} local={local} />
    </div>
  )
}

export function StoryOfYou() {
  const story = siteContent.hero.story
  const { compact } = useRichMotion()
  const trackRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  const eyebrowOpacity = useTransform(scrollYProgress, [0, 0.03, 0.86, 0.93], [0, 1, 1, 0])
  const outroOpacity = useTransform(scrollYProgress, [0.91, 0.975], [0, 1])
  const outroY = useTransform(scrollYProgress, [0.91, 0.975], [26, 0])

  // A soft center-stage aura that flares as each verse's photos arrive —
  // champagne for the star and the crown, blush for "to be mine".
  const warmGlow = useTransform(
    scrollYProgress,
    [0.04, 0.11, 0.2, 0.29, 0.34, 0.41, 0.5, 0.58],
    [0, 0.55, 0.4, 0.08, 0.05, 0.5, 0.35, 0],
  )
  const blushGlow = useTransform(
    scrollYProgress,
    [0.62, 0.7, 0.82, 0.9],
    [0, 0.55, 0.4, 0],
  )

  return (
    <section ref={trackRef} className="relative h-[560svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div
          style={{ opacity: warmGlow }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[52svh] w-[52svh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne/16 blur-3xl"
        />
        <motion.div
          style={{ opacity: blushGlow }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[52svh] w-[52svh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/18 blur-3xl"
        />

        <motion.p
          style={{ opacity: eyebrowOpacity }}
          className="type-eyebrow absolute inset-x-0 top-[max(3.5rem,env(safe-area-inset-top))] z-40 text-center text-champagne/85"
        >
          {story.eyebrow}
        </motion.p>

        {story.verses.map((verse, index) => (
          <StoryVerseStage
            key={verse.id}
            verse={verse}
            start={index * SEGMENT}
            progress={scrollYProgress}
            compact={compact}
          />
        ))}

        <div className="absolute inset-x-0 top-1/2 z-30 -translate-y-1/2">
          <motion.p
            style={{ opacity: outroOpacity, y: outroY }}
            className="type-script text-glow px-8 text-center text-starlight"
          >
            {story.outro}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
