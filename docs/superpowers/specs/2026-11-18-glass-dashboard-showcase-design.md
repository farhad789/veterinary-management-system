# Glass dashboard showcase: design

Date: 2026-11-18. Status: waiting for owner approval.

## Intent and why
Dr. Riazi shared a 14 s vertical video of a farm dashboard ("Verdan Farm OS"): dark frosted-glass cards over a field backdrop, KPI tiles, a donut chart, a bar chart, a progress strip, a message list, and a slow zoom between panels. He wants designs in that style, based on his site, for three uses at once: mockup images, a live section on the site, and short Instagram clips.

The site's goal (CLAUDE.md) is that a visitor trusts the doctor and takes ONE action. The showcase makes the tools (herd overview, vaccination schedule, feed cost per kg of milk) look concrete and credible. It is not decoration.

## Goals
- One set of React components that produces all three outputs, so they always match the site.
- Matches the existing look: dark slate, teal accent, `dir` aware, Persian first.
- Mobile first (375 px), light on a slow connection.

## Non-goals
- No restyle of the rest of the site.
- No new dependencies. Tailwind, lucide-react and plain SVG only.
- No photo backdrop. No auto-playing video on the site.

## Anti-goals (a failure even if it works)
- Looks like a copy of the crop-farming video (lime green, tractors, "NDVI").
- Breaks RTL, or slows the landing page noticeably on mobile.
- Shows numbers that look like real results, or any drug names, doses or prices.
- Adds a second main call-to-action on a screen.

## Constraints (from CLAUDE.md)
Sample data only and clearly labelled "نمونه" (example). No fake reviews or results. No medical claims. Simple Persian. Check RTL and 375 px before calling it done. Run `npm run build`.

## Approaches considered
1. One component set, three outputs (chosen by the owner). Live section on the site; the same components screenshotted for mockups and recorded for clips.
2. Three separate pieces (static mockups, separate page, separate video). Faster to start but drifts from the site. Rejected.
3. Restyle the whole site. Largest change and against "remove before you add". Rejected.

## Design

### Components (`src/components/showcase/`)
- `FieldBackdrop`: CSS/SVG field texture (soft contour stripes, a circular plot, a small farm marker) in dark teal. Replaces the aerial photo. Weighs a few KB.
- `GlassCard`: translucent dark panel with a thin light border and blur, matching the existing `bg-white/5 border-white/10` language.
- `KpiTile`: label, big value, small trend chip, optional mini line.
- `Donut` and `Bars`: hand-written SVG, no chart library.
- `ProgressStrip`: segmented bar (like the irrigation zones, used for vaccination stages).
- `ShowcaseDashboard`: composes the above into the "herd overview" screen.

### Content (Persian first, English strings for non-fa like the quiz section)
Panels, all sample data and labelled "نمونه":
- Herd overview: number of cows, milk per day, feed cost per kg of milk, vaccinations due.
- Ration mix donut: forage, concentrate, other (shares).
- Monthly milk bars with one highlighted month.
- Vaccination progress strip with stages.
- Recent notes list (visit, lab result received, reminder), no drug names.

### Live section
Added to `LandingPage` next to the existing dairy teaser (visual on top of its existing text, reusing its existing single CTA). Motion is CSS only: cards fade and rise on first view, a gentle hover lift. All motion is off under `prefers-reduced-motion`. No video.

### Mockups and clips
- A second dev entry `showcase.html` (not part of the production build; no change to `vite.config.ts`) renders `ShowcaseDashboard` at fixed sizes and with scripted camera moves (zoom to a panel, pan, zoom out) driven by URL parameters.
- A Playwright script (kept outside `src/`, in `scripts/showcase/`) exports PNG mockups (1080×1350 and 1920×1080) and records the camera moves as a ~14 s 1080×1920 clip, converted with ffmpeg to MP4. Clip intro and outro cards show the site name and Instagram handle.
- Outputs are written to `showcase-out/` and sent to the owner. They are not committed.

## Decisions by the owner
Option 1; all three outputs; based on the site.

## My calls (owner can override)
Keep teal as the accent, not lime. Sample data labelled as examples. Persian first with simple English fallback. Dev-only export page.

## Left to the builder
Exact sizes, spacing, easing, chart proportions, and which Persian font to use for the exports (the site itself keeps its current fonts). Check a Persian font is installed in the render environment first; if none is, tell the owner.
