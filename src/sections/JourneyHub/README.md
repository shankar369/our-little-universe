# JourneyHub Section

## Purpose
The Journey Hub is the routed chapter picker after the opening hero. It keeps the app from becoming one long page and gives each major feature a premium entry card.

## Technical Notes
- Route: `/journey`
- Component: `JourneyHub.tsx`
- Data source: `src/app/experienceRegistry.ts`
- Navigation uses React Router `Link`.
- Visual style: heading directly on the night sky (`night-veil` + `text-glow`), chapter cards as `glass-panel` tickets with roman numerals and per-chapter accent glows, per `docs/design-system.md`.

## Extensibility
Add new sections to `experienceRegistry.ts` first, then include the section id in the hub filter when that section should appear here.
