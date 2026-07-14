# JourneyHub Section

## Purpose
The Journey Hub is the routed chapter picker after the opening hero. It keeps the app from becoming one long page and gives each major feature a premium entry card.

## Technical Notes
- Route: `/journey`
- Component: `JourneyHub.tsx`
- Data source: `src/app/experienceRegistry.ts`
- Navigation uses React Router `Link`.
- Visual style: heading directly on the night sky (`night-veil` + `text-glow`); chapter cards are **sealed letters** (`ChapterLetter.tsx`) modeled on the *back* of a fine wedding envelope — premium through restraint: cream paper, one deep-V flap, one irregular wax seal stamped with the chapter icon (the card's only icon), and a **centered script (Parisienne) address** — the sanctioned exception to the one-script rule (design-system §type). No stamps, postmarks, or stripes. The revealed Heart Locker is the one `velvet`-tone midnight envelope with a champagne-gold seal.
- Activation plays the **unsealing** (~0.95s, then navigation under the chapter curtain): the wax cracks and falls, the flap swings open on its top fold revealing a darker underside, a small note rises out in front, and the letter drifts toward the viewer. Locked locker letters skip the animation and open the password prompt; reduced motion navigates immediately.
- While the Heart Locker is hidden, a non-interactive dashed "a page yet unwritten" ghost card holds its grid seat (keeps the 2-col desktop grid balanced and teases the secret); the revealed locker card replaces it.

## Extensibility
Add new sections to `experienceRegistry.ts` first, then include the section id in the hub filter when that section should appear here.
