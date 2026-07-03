import { useCallback, useMemo, useState } from 'react'
import { Compass, Images, MapPin, Sparkles, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import {
  getPlacePhotos,
  indiaDefaultView,
  ourLittleAtlasPlaces,
  placeFocusZoom,
} from '../../content/ourLittleAtlas'
import type { JourneyPlace } from '../../content/types'
import { softEase } from '../../design/motion'
import { AtlasMap } from '../../shared/components/AtlasMap/AtlasMap'
import { PhotoGalleryModal } from '../../shared/components/PhotoGallery/PhotoGalleryModal'

export function OurLittleAtlas() {
  const places = useMemo(() => ourLittleAtlasPlaces, [])

  const [activePlaceId, setActivePlaceId] = useState<string | null>(null)
  const [previewPlaceId, setPreviewPlaceId] = useState<string | null>(null)
  const [isPlacesOpen, setIsPlacesOpen] = useState(false)
  const [galleryPlaceId, setGalleryPlaceId] = useState<string | null>(null)

  const previewPlace = places.find((place) => place.id === previewPlaceId) ?? null
  const galleryPlace = places.find((place) => place.id === galleryPlaceId) ?? null
  const galleryPhotos = galleryPlace ? getPlacePhotos(galleryPlace.folder) : []

  const handleSelectFromList = useCallback((placeId: string) => {
    // Per the design: selecting from the list zooms to (and highlights) the place;
    // the photos open only when the heart marker itself is tapped.
    setActivePlaceId(placeId)
    setPreviewPlaceId(null)
    setIsPlacesOpen(false)
  }, [])

  const handleMarkerClick = useCallback((placeId: string) => {
    setActivePlaceId(placeId)
    setPreviewPlaceId(placeId)
  }, [])

  const handleShowAll = useCallback(() => {
    setActivePlaceId(null)
    setPreviewPlaceId(null)
    setIsPlacesOpen(false)
  }, [])

  return (
    <main className="relative h-svh w-full overflow-hidden text-starlight">
      <AtlasMap
        places={places}
        activePlaceId={activePlaceId}
        onMarkerClick={handleMarkerClick}
        defaultView={indiaDefaultView}
        focusZoom={placeFocusZoom}
        className="absolute inset-0"
      />

      {/* Edge scrims so the floating UI stays legible over any tile */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-44 bg-gradient-to-b from-night/85 via-night/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-t from-night/85 via-night/30 to-transparent" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: softEase }}
        className="absolute inset-x-0 top-0 z-20 px-5 pt-[max(1.25rem,env(safe-area-inset-top))]"
      >
        <div className="mx-auto flex max-w-5xl items-start justify-between gap-3">
          <div className="pointer-events-none">
            <div className="mb-1.5 inline-flex items-center gap-2 text-champagne/85">
              <MapPin className="h-3.5 w-3.5" />
              <span className="type-eyebrow">Our Little Atlas</span>
            </div>
            <h1 className="text-glow text-[clamp(1.4rem,5vw,2.1rem)] font-medium leading-[1.05]">
              <span className="type-quote text-aurora pb-1">every place that became us.</span>
            </h1>
          </div>
          <button
            type="button"
            onClick={handleShowAll}
            className="btn-ghost flex h-11 w-11 shrink-0 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
            aria-label="Zoom back out to all of India"
            title="Show all"
          >
            <Compass className="h-5 w-5 text-champagne" />
          </button>
        </div>
      </motion.div>

      {/* Places opener */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55, ease: softEase }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsPlacesOpen(true)}
          className="glass-chip flex h-12 items-center gap-2.5 rounded-full pl-5 pr-4 text-sm font-semibold text-starlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
        >
          <Images className="h-4.5 w-4.5 text-orchid" />
          Places
          <span className="ml-0.5 rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-moon">
            {places.length}
          </span>
        </motion.button>
      </div>

      {/* Places list */}
      <AnimatePresence>
        {isPlacesOpen ? (
          <PlacesPanel
            places={places}
            activePlaceId={activePlaceId}
            onSelect={handleSelectFromList}
            onClose={() => setIsPlacesOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      {/* Marker preview */}
      <AnimatePresence>
        {previewPlace ? (
          <PlacePreview
            place={previewPlace}
            photos={getPlacePhotos(previewPlace.folder)}
            onViewAll={() => setGalleryPlaceId(previewPlace.id)}
            onClose={() => setPreviewPlaceId(null)}
          />
        ) : null}
      </AnimatePresence>

      <PhotoGalleryModal
        open={Boolean(galleryPlace)}
        photos={galleryPhotos}
        title={galleryPlace?.name}
        subtitle={galleryPlace?.region}
        onClose={() => setGalleryPlaceId(null)}
      />
    </main>
  )
}

type PlacesPanelProps = {
  places: JourneyPlace[]
  activePlaceId: string | null
  onSelect: (placeId: string) => void
  onClose: () => void
}

function PlacesPanel({ places, activePlaceId, onSelect, onClose }: PlacesPanelProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-[55] bg-night/55 backdrop-blur-sm"
      />
      <motion.aside
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 28 }}
        transition={{ duration: 0.36, ease: softEase }}
        className="menu-panel fixed inset-x-0 bottom-0 z-[60] flex max-h-[76svh] flex-col rounded-t-[1.75rem] lg:inset-y-0 lg:right-auto lg:left-0 lg:max-h-none lg:w-[24rem] lg:max-w-[90vw] lg:rounded-t-none lg:rounded-r-[1.75rem]"
        aria-label="Places we've been"
      >
        <div className="relative z-10 flex shrink-0 items-center justify-between gap-3 px-5 pt-5 lg:pt-[max(1.5rem,env(safe-area-inset-top))]">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-2 text-champagne/85">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="type-eyebrow">The places</span>
            </div>
            <h2 className="font-display text-xl font-semibold leading-tight">
              Where we&rsquo;ve wandered
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
            aria-label="Close places list"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative z-10 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-3 py-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {places.map((place) => {
            const count = getPlacePhotos(place.folder).length
            const isActive = place.id === activePlaceId

            return (
              <button
                type="button"
                key={place.id}
                onClick={() => onSelect(place.id)}
                className={`flex w-full items-center gap-3.5 rounded-2xl px-3 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orchid ${
                  isActive
                    ? 'bg-white/10'
                    : 'hover:bg-white/[0.06]'
                }`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    isActive ? 'bg-orchid/25 text-starlight' : 'bg-white/8 text-orchid'
                  }`}
                >
                  <MapPin className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-display text-lg font-semibold leading-tight">
                      {place.name}
                    </span>
                    {place.dateLabel ? (
                      <span className="type-eyebrow shrink-0 text-faint">
                        {place.dateLabel}
                      </span>
                    ) : null}
                  </span>
                  <span className="type-quote mt-0.5 block truncate text-sm text-moon/85">
                    {place.note}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-faint">
                  <Images className="h-3.5 w-3.5" />
                  {count > 0 ? count : 'soon'}
                </span>
              </button>
            )
          })}
        </div>
      </motion.aside>
    </>
  )
}

type PlacePreviewProps = {
  place: JourneyPlace
  photos: string[]
  onViewAll: () => void
  onClose: () => void
}

function PlacePreview({ place, photos, onViewAll, onClose }: PlacePreviewProps) {
  const previewPhotos = photos.slice(0, 4)
  const remaining = photos.length - previewPhotos.length

  return (
    <motion.aside
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 32 }}
      transition={{ duration: 0.38, ease: softEase }}
      className="menu-panel fixed inset-x-0 bottom-0 z-[60] rounded-t-[1.75rem] lg:inset-x-auto lg:bottom-6 lg:left-6 lg:w-[26rem] lg:rounded-[1.5rem]"
      aria-label={`${place.name} photos`}
    >
      <div className="relative z-10 p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 inline-flex items-center gap-2 text-champagne/85">
              <MapPin className="h-3.5 w-3.5" />
              <span className="type-eyebrow">
                {place.region ?? 'a place that mattered'}
              </span>
            </div>
            <h2 className="truncate font-display text-2xl font-semibold leading-tight">
              {place.name}
            </h2>
            <p className="type-quote mt-1 text-pretty text-sm leading-6 text-moon/90">
              {place.note}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost flex h-10 w-10 shrink-0 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
            aria-label="Close"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {photos.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-8 text-center">
            <Images className="mb-2.5 h-7 w-7 text-blush/55" />
            <p className="type-quote text-sm text-moon">
              memories are landing here soon
            </p>
          </div>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {previewPhotos.map((src, index) => (
                <button
                  type="button"
                  key={src}
                  onClick={onViewAll}
                  className="relative aspect-square overflow-hidden rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orchid"
                >
                  <img
                    src={src}
                    alt={`${place.name} memory ${index + 1}`}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover transition duration-500 hover:scale-[1.05]"
                  />
                  {index === previewPhotos.length - 1 && remaining > 0 ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-night/55 font-display text-xl font-semibold text-starlight backdrop-blur-[1px]">
                      +{remaining}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onViewAll}
              className="btn-primary mt-3.5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orchid"
            >
              <Images className="h-4 w-4" />
              View all {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
            </button>
          </>
        )}
      </div>
    </motion.aside>
  )
}
