import type { ComponentType } from 'react'
import type { FinaleVariantProps } from './finaleEngine'
import { CrystalModernFinale } from './CrystalModernFinale'
import { EditorialWaltzFinale } from './EditorialWaltzFinale'
import { EngravedGoldFinale } from './EngravedGoldFinale'
import { StarlightItalicFinale } from './StarlightItalicFinale'
import { VelvetScriptFinale } from './VelvetScriptFinale'

/**
 * The five candidate finales — each a different typeface AND a different
 * material, all sharing FinaleEmbers' interface and the exact same
 * scroll-driven eight-beat choreography (finaleEngine). Whichever wins simply
 * replaces <FinaleEmbers/> inside FinaleAct — one line.
 */

export type FinaleVariantMeta = {
  id: string
  number: number
  name: string
  fontLabel: string
  vibe: string
  component: ComponentType<FinaleVariantProps>
}

export const finaleVariants: FinaleVariantMeta[] = [
  {
    id: 'velvet-script',
    number: 1,
    name: 'Velvet Script',
    fontLabel: 'Parisienne · handwritten',
    vibe: 'the name handwritten in flowing script, drawn out of tiny drifting hearts — blush to orchid to champagne',
    component: VelvetScriptFinale,
  },
  {
    id: 'engraved-gold',
    number: 2,
    name: 'Engraved Gold',
    fontLabel: 'Cinzel · roman capitals',
    vibe: 'a museum inscription stitched in gold thread, row by row; the N unpicks and re-stitches as the S',
    component: EngravedGoldFinale,
  },
  {
    id: 'starlight-italic',
    number: 3,
    name: 'Starlight Italic',
    fontLabel: 'Fraunces italic · the house serif',
    vibe: 'the sky’s own language — named stars and faint constellation lines that re-link N into S',
    component: StarlightItalicFinale,
  },
  {
    id: 'crystal-modern',
    number: 4,
    name: 'Crystal Modern',
    fontLabel: 'DM Sans bold · geometric',
    vibe: 'clean modern letters cut from tumbling crystal shards that glint as they turn; the N shatters and refreezes as the S',
    component: CrystalModernFinale,
  },
  {
    id: 'editorial-waltz',
    number: 5,
    name: 'Editorial Waltz',
    fontLabel: 'Playfair Display italic · classic romance',
    vibe: 'soft bokeh fireflies waltzing tiny orbits around high-contrast italics — dreamy, breathing, out of focus',
    component: EditorialWaltzFinale,
  },
]

export type { FinaleVariantProps }
