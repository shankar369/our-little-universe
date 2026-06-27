# AtlasMap

## Purpose
A controlled MapLibre GL JS map for Our Little Atlas. It renders heart "NS" markers for
a set of places, reports marker taps, and flies the camera to the selected place.

## Why MapLibre + Carto dark-matter
- WebGL/GPU rendering → smooth `flyTo` (zoom-out-then-in) transitions, the core feel.
- Vector tiles, fully open-source, no API key when paired with the free Carto
  `dark-matter` basemap (`https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`),
  whose dark palette matches Midnight Velvet. Works on static GitHub Pages.

## Props Contract
- `places: JourneyPlace[]` — pins to render (stable for the map's lifetime).
- `activePlaceId: string | null` — controlled focus. Changing it flies the camera and
  toggles the `is-active` marker class; `null` flies back to `defaultView`.
- `onMarkerClick(placeId)` — fired when a heart marker is tapped (latest handler is held
  in a ref so markers are never rebuilt).
- `defaultView: { center: [lng, lat]; zoom }` and `focusZoom: number`.
- `className` — sizing/positioning (the section passes `absolute inset-0`).

## Implementation Notes
- The map is created once; markers are plain DOM (`createMarkerElement`) added on `load`.
  Marker styling (heart, NS label, active pulse) lives in `index.css` under `.atlas-marker`.
- A `ResizeObserver` calls `map.resize()`; rotation/keyboard are disabled for a calm feel.
- `prefers-reduced-motion` → `jumpTo` instead of `flyTo`.
- WebGL failure is caught and rendered as a graceful fallback.

## Reuse
Specific to atlas-style place maps. For a different map, pass different `places` and
views; keep marker visuals in `index.css` so all maps share the heart language.
