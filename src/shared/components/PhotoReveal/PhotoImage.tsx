import { useState } from 'react'
import { CalendarHeart } from 'lucide-react'
import type { RevealPhotoItem } from '../../../content/types'
import { publicAssetPath } from '../../lib/assetPath'

type PhotoImageProps = {
  item: RevealPhotoItem
  className?: string
  /**
   * Text inside the missing-photo fallback art. Turn off when the photo sits
   * above a caption plate that already names the memory (e.g. the shuffle
   * stack), so the title never appears twice on one card.
   */
  showFallbackText?: boolean
}

export function PhotoImage({
  item,
  className = '',
  showFallbackText = true,
}: PhotoImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_50%),linear-gradient(150deg,#ecd5fc_0%,#fbd3e3_55%,#f8e3bd_100%)] text-center text-[#2b1048] ${className}`}
      >
        <div className="px-5">
          <CalendarHeart
            className={`mx-auto text-[#2b1048]/55 ${showFallbackText ? 'mb-3 h-9 w-9' : 'h-11 w-11'}`}
          />
          {showFallbackText ? (
            <>
              <p className="type-quote text-lg font-semibold leading-tight">
                {item.heading}
              </p>
              {item.label ? (
                <p className="type-eyebrow mt-2 !tracking-[0.22em] text-[#2b1048]/45">
                  {item.label}
                </p>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <img
      src={publicAssetPath(item.photo)}
      alt={item.alt ?? item.heading}
      className={`h-full w-full object-cover ${className}`}
      onError={() => setHasError(true)}
      draggable={false}
    />
  )
}
