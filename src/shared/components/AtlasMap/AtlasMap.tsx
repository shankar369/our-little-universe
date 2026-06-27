import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { JourneyPlace } from '../../../content/types'

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

const HEART_PATH =
  'M18 32 C 6 22, 2 15, 2 9.6 C 2 4.9, 5.6 2, 9.4 2 C 12.7 2, 15.7 4.1, 18 7.5 C 20.3 4.1, 23.3 2, 26.6 2 C 30.4 2, 34 4.9, 34 9.6 C 34 15, 30 22, 18 32 Z'

function createMarkerElement(
  place: JourneyPlace,
  index: number,
  onActivate: () => void,
): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'atlas-marker'
  button.setAttribute('aria-label', `${place.name} — open photos`)
  button.innerHTML = `
    <span class="atlas-marker__pin">
      <svg class="atlas-marker__heart" viewBox="0 0 36 34" aria-hidden="true">
        <defs>
          <linearGradient id="atlas-heart-${index}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f7b8d4" />
            <stop offset="52%" stop-color="#e3a6f0" />
            <stop offset="100%" stop-color="#c894fc" />
          </linearGradient>
        </defs>
        <path d="${HEART_PATH}" fill="url(#atlas-heart-${index})" stroke="rgba(255,255,255,0.6)" stroke-width="1" />
      </svg>
      <span class="atlas-marker__label">NS</span>
    </span>`

  button.addEventListener('click', (event) => {
    event.stopPropagation()
    onActivate()
  })

  return button
}

type AtlasMapProps = {
  places: JourneyPlace[]
  activePlaceId: string | null
  onMarkerClick: (placeId: string) => void
  defaultView: { center: [number, number]; zoom: number }
  focusZoom: number
  className?: string
}

export function AtlasMap({
  places,
  activePlaceId,
  onMarkerClick,
  defaultView,
  focusZoom,
  className = '',
}: AtlasMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<Record<string, HTMLButtonElement>>({})
  const onMarkerClickRef = useRef(onMarkerClick)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  // Keep the latest click handler without rebuilding markers.
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick
  }, [onMarkerClick])

  // Create the map once.
  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    let map: maplibregl.Map

    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE,
        center: defaultView.center,
        zoom: defaultView.zoom,
        minZoom: 2.4,
        maxZoom: 16,
        attributionControl: { compact: true },
        dragRotate: false,
        pitchWithRotate: false,
      })
    } catch {
      // Defer out of the effect body (e.g. WebGL unavailable) to render the fallback.
      queueMicrotask(() => setFailed(true))
      return
    }

    mapRef.current = map
    map.touchZoomRotate.disableRotation()
    map.keyboard.disable()

    map.on('load', () => {
      for (const [index, place] of places.entries()) {
        const element = createMarkerElement(place, index, () =>
          onMarkerClickRef.current(place.id),
        )
        new maplibregl.Marker({ element, anchor: 'bottom' })
          .setLngLat([place.lng, place.lat])
          .addTo(map)
        markersRef.current[place.id] = element
      }
      setReady(true)
    })

    map.on('error', () => {
      // Tile/style errors shouldn't crash the experience; the dark canvas remains.
    })

    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
      markersRef.current = {}
    }
    // Places and view are stable for the section's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Highlight the active marker and fly the camera to match the selection.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) {
      return
    }

    for (const [id, element] of Object.entries(markersRef.current)) {
      element.classList.toggle('is-active', id === activePlaceId)
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const activePlace = places.find((place) => place.id === activePlaceId)

    if (activePlace) {
      const target = { center: [activePlace.lng, activePlace.lat] as [number, number], zoom: focusZoom }
      if (reducedMotion) {
        map.jumpTo(target)
      } else {
        map.flyTo({ ...target, speed: 0.85, curve: 1.6, essential: true })
      }
    } else if (reducedMotion) {
      map.jumpTo(defaultView)
    } else {
      map.flyTo({ ...defaultView, speed: 0.7, curve: 1.5, essential: true })
    }
  }, [activePlaceId, ready, places, focusZoom, defaultView])

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-deep text-center ${className}`}
      >
        <p className="type-quote px-6 text-moon">
          the map needs a browser with WebGL — try another device
        </p>
      </div>
    )
  }

  return <div ref={containerRef} className={`atlas-map ${className}`} />
}
