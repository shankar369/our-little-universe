import type { ConstellationPart } from './constellationData'

type ConstellationGlyphProps = {
  parts: ConstellationPart[]
  viewBox: string
  className?: string
}

/**
 * Renders a constellation letterform: faint connecting lines plus glowing
 * stars (halo circle + core circle — no SVG filters, they wreck compositing).
 * Roughly a third of the stars twinkle via the `star-twinkle` CSS keyframe;
 * under reduced motion the constellation simply holds still, fully visible.
 */
export function ConstellationGlyph({ parts, viewBox, className = '' }: ConstellationGlyphProps) {
  return (
    <svg viewBox={viewBox} className={className} aria-hidden="true">
      {parts.map((part, partIndex) => (
        <g key={partIndex} transform={part.transform}>
          {part.glyph.segments.map(([from, to], segmentIndex) => {
            const a = part.glyph.stars[from]
            const b = part.glyph.stars[to]
            return (
              <line
                key={`s-${segmentIndex}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#f5f0ff"
                strokeOpacity={0.13}
                strokeWidth={1}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
          {part.glyph.stars.map((star, starIndex) => {
            const twinkles = starIndex % 3 === 1
            const coreColor = star.anchor ? '#f4d9a6' : '#f5f0ff'
            return (
              <g key={`p-${starIndex}`}>
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.r * 3}
                  fill={coreColor}
                  opacity={star.anchor ? 0.12 : 0.08}
                />
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.r}
                  fill={coreColor}
                  opacity={star.anchor ? 0.95 : 0.85}
                  className={twinkles ? 'star-twinkle' : undefined}
                  style={
                    twinkles
                      ? {
                          animationDuration: `${3.5 + (starIndex % 4) * 0.7}s`,
                          animationDelay: `${(starIndex * 0.9 + partIndex * 1.3) % 4}s`,
                        }
                      : undefined
                  }
                />
              </g>
            )
          })}
        </g>
      ))}
    </svg>
  )
}
