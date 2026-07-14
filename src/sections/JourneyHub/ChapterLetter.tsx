import { useState } from 'react'
import { Heart } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Link, useNavigate } from 'react-router'
import { softEase } from '../../design/motion'

/**
 * A chapter as a sealed love letter — modeled on the back of a fine wedding
 * envelope, where premium means restraint: soft cream paper, one deep-V flap,
 * one wax seal (the chapter's icon, stamped once), and a centered handwritten
 * address. No stamps, postmarks or stripes competing for attention.
 *
 * Unsealing (on activation): the wax cracks and falls, the flap swings open
 * on its top fold revealing its darker underside, a little note rises out of
 * the envelope, and the whole letter drifts toward you — then the route
 * changes under the chapter curtain. The hidden Heart Locker is the one
 * `velvet` midnight envelope with champagne wax among the cream ones.
 */

type LetterTone = 'paper' | 'velvet'

type ChapterLetterProps = {
  /** Small letterpress line over the address, e.g. "Chapter II". */
  eyebrow: string
  title: string
  /** The one written line beneath the address. */
  note: string
  cta: string
  icon: LucideIcon
  tone?: LetterTone
  /** Static resting tilt in degrees — letters laid on a table. */
  tilt?: number
  /** Route to open after the unsealing animation. */
  to?: string
  /** Custom activation (Heart Locker). Runs after the animation… */
  onOpen?: () => void
  /** …or immediately when true (locked letter → password prompt). */
  skipOpen?: boolean
}

/** How long the unsealing plays before the route changes. */
const OPEN_MS = 950
/** Flap height — the seal sits exactly on its point. */
const FLAP = '5.6rem'

const TONES = {
  paper: {
    body: 'bg-[linear-gradient(172deg,#fdf9f0_0%,#f1e6d2_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_14px_rgba(2,0,10,0.32),0_22px_60px_rgba(2,0,10,0.45)] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_22px_rgba(2,0,10,0.4),0_30px_80px_rgba(2,0,10,0.55),0_0_46px_rgba(200,148,252,0.1)]',
    inside: 'bg-[linear-gradient(180deg,#e2d3ba_0%,#efe4cd_92%)]',
    sideFolds:
      'bg-[linear-gradient(104deg,rgba(43,16,72,0.05)_0%,transparent_22%),linear-gradient(256deg,rgba(43,16,72,0.05)_0%,transparent_22%),linear-gradient(0deg,rgba(43,16,72,0.035)_0%,transparent_30%)]',
    flap: 'bg-[linear-gradient(180deg,#fcf6ea_0%,#f3e8d2_55%,#e7d7ba_100%)]',
    flapInner: 'bg-[#cbb98f]',
    letter: 'bg-[linear-gradient(175deg,#fffef9,#f7efdf)] text-[#b9528b]',
    seal: 'bg-[radial-gradient(circle_at_36%_30%,#e78ab8_0%,#b34f86_56%,#8c3162_100%)] shadow-[0_4px_9px_rgba(43,16,72,0.42),inset_0_1.5px_2px_rgba(255,255,255,0.5),inset_0_-2.5px_4px_rgba(76,18,56,0.5)]',
    sealRim: 'border-[#f2bcd9]/45',
    sealInk: 'text-[#fbe3f0]',
    eyebrow: 'text-[#2b1048]/45',
    title: 'text-[#241040]',
    note: 'text-[#2b1048]/60',
    cta: 'text-[#a2487c]',
  },
  velvet: {
    body: 'border border-champagne/20 bg-[linear-gradient(172deg,#2d1756_0%,#170a2f_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_22px_60px_rgba(2,0,10,0.55),0_0_46px_rgba(244,217,166,0.1)] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_30px_80px_rgba(2,0,10,0.6),0_0_60px_rgba(244,217,166,0.18)]',
    inside: 'bg-[linear-gradient(180deg,#0f0722_0%,#1c0e39_92%)]',
    sideFolds:
      'bg-[linear-gradient(104deg,rgba(255,255,255,0.04)_0%,transparent_22%),linear-gradient(256deg,rgba(255,255,255,0.04)_0%,transparent_22%),linear-gradient(0deg,rgba(2,0,10,0.25)_0%,transparent_30%)]',
    flap: 'bg-[linear-gradient(180deg,#361b63_0%,#281247_55%,#1c0d38_100%)]',
    flapInner: 'bg-[#0e0620]',
    letter: 'bg-[linear-gradient(175deg,#fdf8ec,#f0e4c9)] text-[#9c7233]',
    seal: 'bg-[radial-gradient(circle_at_36%_30%,#f7dfae_0%,#c89a52_56%,#96702f_100%)] shadow-[0_4px_9px_rgba(2,0,10,0.55),inset_0_1.5px_2px_rgba(255,255,255,0.55),inset_0_-2.5px_4px_rgba(80,52,16,0.55)]',
    sealRim: 'border-[#f7e6c2]/50',
    sealInk: 'text-[#43290f]',
    eyebrow: 'text-champagne/70',
    title: 'text-starlight',
    note: 'text-moon/80',
    cta: 'text-champagne/90',
  },
} as const satisfies Record<LetterTone, Record<string, string>>

export function ChapterLetter({
  eyebrow,
  title,
  note,
  cta,
  icon: Icon,
  tone = 'paper',
  tilt = 0,
  to,
  onOpen,
  skipOpen = false,
}: ChapterLetterProps) {
  const t = TONES[tone]
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion() ?? false
  const [opening, setOpening] = useState(false)

  function activate() {
    if (opening) {
      return
    }
    if (skipOpen) {
      onOpen?.()
      return
    }
    if (reducedMotion) {
      if (to) {
        navigate(to)
      } else {
        onOpen?.()
      }
      return
    }
    setOpening(true)
    window.setTimeout(() => {
      if (to) {
        navigate(to)
      } else {
        onOpen?.()
      }
      // The curtain covers the swap; reseal quietly for the way back.
      window.setTimeout(() => setOpening(false), 900)
    }, OPEN_MS)
  }

  const envelope = (
    <motion.span
      className="relative block"
      style={{ rotate: `${tilt}deg` }}
      initial={false}
      animate={opening ? { y: -10, scale: 1.05 } : { y: 0, scale: 1 }}
      whileHover={opening ? undefined : { y: -5 }}
      transition={{ duration: 0.45, ease: softEase }}
    >
      {/* The note that slips out while the envelope opens. Sits above the
          flap (z-25) so it emerges in front of the opened paper; invisible
          at rest, so the stacking never shows. */}
      <motion.span
        aria-hidden="true"
        className={`absolute inset-x-12 top-1 z-[25] block h-[5.9rem] rounded-[0.4rem] shadow-[0_12px_32px_rgba(2,0,10,0.4)] ${t.letter}`}
        initial={false}
        animate={
          opening
            ? { y: -62, opacity: 1, rotate: -2.5 }
            : { y: 30, opacity: 0, rotate: 0 }
        }
        transition={{ duration: 0.48, ease: softEase, delay: opening ? 0.42 : 0 }}
      >
        <span className="flex h-full flex-col items-center justify-center gap-2">
          <Heart className="h-4 w-4 fill-current" />
          <span className="block h-px w-24 bg-current opacity-25" />
          <span className="block h-px w-16 bg-current opacity-25" />
        </span>
      </motion.span>

      {/* Envelope body */}
      <span
        className={`relative z-10 block min-h-[16.5rem] overflow-hidden rounded-[0.95rem] transition-shadow duration-300 ${t.body}`}
      >
        {/* Interior, exposed once the flap lifts */}
        <span
          className={`absolute inset-x-0 top-0 block ${t.inside} shadow-[inset_0_8px_14px_rgba(2,0,10,0.18)]`}
          style={{ height: FLAP }}
        />
        {/* The two side folds + bottom fold, whispered in with gradients */}
        <span
          aria-hidden="true"
          className={`absolute inset-0 block ${t.sideFolds}`}
        />

        {/* The address, centered like fine stationery */}
        <span className="relative block px-6 pb-7 text-center" style={{ paddingTop: '7.6rem' }}>
          <span className={`type-eyebrow block ${t.eyebrow}`}>{eyebrow}</span>
          <span
            className={`type-script mt-2 block text-[1.95rem] leading-[1.15] sm:text-[2.1rem] ${t.title}`}
          >
            {title}
          </span>
          <span
            className={`type-quote mx-auto mt-2 block max-w-[17.5rem] text-sm leading-6 ${t.note}`}
          >
            {note}
          </span>
          <span
            className={`type-eyebrow mt-5 inline-flex min-h-6 items-center gap-2 opacity-85 transition-opacity duration-300 group-hover:opacity-100 ${t.cta}`}
          >
            {cta}
            <Heart className="h-3 w-3 fill-current" />
          </span>
        </span>
      </span>

      {/* The deep-V flap: swings open on its top fold when unsealing */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-20 block [filter:drop-shadow(0_3px_3px_rgba(2,0,10,0.28))]"
        style={{ height: FLAP, transformOrigin: 'top center', transformPerspective: 900 }}
        initial={false}
        animate={{ rotateX: opening ? -168 : 0 }}
        transition={{
          duration: 0.55,
          ease: [0.45, 0, 0.2, 1],
          delay: opening ? 0.16 : 0,
        }}
      >
        <span
          className={`absolute inset-0 block rounded-t-[0.95rem] ${t.flap} [clip-path:polygon(0_0,100%_0,50%_100%)]`}
        />
        {/* Underside darkens as the flap turns over */}
        <motion.span
          className={`absolute inset-0 block rounded-t-[0.95rem] ${t.flapInner} [clip-path:polygon(0_0,100%_0,50%_100%)]`}
          initial={false}
          animate={{ opacity: opening ? 0.55 : 0 }}
          transition={{ duration: 0.3, delay: opening ? 0.32 : 0 }}
        />
      </motion.span>

      {/* The wax seal on the flap's point — cracks and falls on unseal */}
      <motion.span
        aria-hidden="true"
        className="absolute left-1/2 z-30 block"
        style={{ top: FLAP }}
        initial={false}
        animate={
          opening
            ? {
                scale: [1, 1.16, 0.94],
                y: [0, -3, 34],
                rotate: [0, -9, 20],
                opacity: [1, 1, 0],
              }
            : { scale: 1, y: 0, rotate: 0, opacity: 1 }
        }
        transition={
          opening
            ? { duration: 0.44, times: [0, 0.32, 1], ease: 'easeIn' }
            : { duration: 0.2 }
        }
      >
        <span
          className={`relative flex h-[3.4rem] w-[3.4rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden ${t.seal}`}
          style={{ borderRadius: '47% 53% 50% 50% / 53% 47% 55% 45%' }}
        >
          <span
            className={`absolute inset-[0.3rem] border ${t.sealRim}`}
            style={{ borderRadius: '48% 52% 50% 50% / 50% 50% 54% 46%' }}
          />
          <Icon className={`h-[1.15rem] w-[1.15rem] ${t.sealInk}`} />
          {/* sheen that glints across on hover */}
          <span className="absolute inset-y-[-30%] left-[-80%] w-[45%] rotate-[24deg] bg-white/25 blur-[3px] transition-transform duration-700 ease-out group-hover:translate-x-[300%]" />
        </span>
      </motion.span>
    </motion.span>
  )

  const className =
    'group block rounded-[0.95rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid'

  if (to) {
    return (
      <Link
        to={to}
        className={className}
        onClick={(event) => {
          event.preventDefault()
          activate()
        }}
        aria-label={`${title} — ${cta}`}
      >
        {envelope}
      </Link>
    )
  }
  return (
    <button type="button" onClick={activate} className={`${className} w-full text-left`}>
      {envelope}
    </button>
  )
}

/** The empty grid seat while the Heart Locker stays hidden. */
export function UnwrittenLetter() {
  return (
    <div
      className="flex min-h-[16.5rem] flex-col items-center justify-center gap-3 rounded-[0.95rem] border-2 border-dashed border-white/12"
      style={{ rotate: '0.8deg' }}
    >
      <Heart className="h-4 w-4 text-white/20" />
      <p className="type-quote px-8 text-center text-sm text-faint">
        a letter yet unwritten…
      </p>
    </div>
  )
}
