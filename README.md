# Live Movies (Caribbean Cinemas) + Multi‑Island Ferries

This pack makes **Movies** and **Ferries** pages live with real data.

## Movies — `/api/movies-live` + `/movies`
- Scrapes official **Caribbean Cinemas** theater pages for each cinema in `lib/cinemas.ts` (e.g., Trincity, Southpark, St. Kitts, St. Lucia).
- Extracts **title**, **rating** (when present), and **showtimes** like `01:20 PM`.
- UI lets you **filter by island** and **search title**.

> Caribbean Cinemas updates showtimes weekly (usually Thursdays).

## Ferries — `/api/ferries-live` + `/ferries`
Providers included:
- **St. Kitts & Nevis** — NASPA (weekday/fri/sat/sun) and **Water Taxi** pages; fallback **SKNVibes** ferry page.
- **Antigua & Barbuda** — Barbuda Express schedule page.
- **Trinidad & Tobago** — TTIT schedule page.

UI lets you choose **island** (SKN / Antigua / T&T), toggle **Ferry / Water Taxi** when applicable, select **day**, and switch **source** for SKN.

### Install
1. Copy these into your repo root:
   - `lib/cinemas.ts`
   - `pages/api/movies-live.ts`, `pages/movies.tsx`
   - `pages/api/ferries-live.ts`, `pages/ferries.tsx`
2. Deploy. No API keys required.

### Extend
- Add more theaters in `lib/cinemas.ts` (copy an entry and set the correct `url`).
- Add more ferry providers inside `pages/api/ferries-live.ts` by following the existing parser pattern.

### Notes
- Some operator sites change HTML occasionally. If a parser breaks, ping me with the exact link — I’ll tweak the selector quickly.
- Zoom Earth still blocks embeds; Hurricanes page already opens it in a new tab with Windy as the default embedded radar.
