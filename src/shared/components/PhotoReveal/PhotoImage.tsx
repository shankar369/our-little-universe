import { useState } from 'react'
import { CalendarHeart } from 'lucide-react'
import type { RevealPhotoItem } from '../../../content/types'

type PhotoImageProps = {
  item: RevealPhotoItem
  className?: string
}

export function PhotoImage({ item, className = '' }: PhotoImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-fuchsia-200 via-rose-100 to-amber-100 text-center text-purple-950 ${className}`}
      >
        <div className="px-5">
          <CalendarHeart className="mx-auto mb-3 h-10 w-10 text-purple-900/60" />
          <p className="text-lg font-black leading-tight">{item.heading}</p>
          {item.label ? (
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-purple-950/46">
              {item.label}
            </p>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <img
      src={item.photo}
      alt={item.alt ?? item.heading}
      className={`h-full w-full object-cover ${className}`}
      onError={() => setHasError(true)}
      draggable={false}
    />
  )
}
