# Island‑Filtered News + Remove Flights

This pack does two things:
1) **Per‑island news** — when you open an island hub, the News tab now shows only headlines that match that island (by name + common synonyms). Uses `/api/news?island=<slug>`.
2) **Remove Flights** — the Flights tab and nav item are removed, as requested.

## Files
- `pages/api/news.ts` — adds `?island=<slug>` filter (title keyword match), keeps images and debug.
- `components/NewsList.tsx` — accepts `{ island }` and calls `/api/news?island=...`.
- `pages/island/[slug].tsx` — removes Flights tab; News tab passes `island={slug}`.
- `pages/_app.tsx` — removes "Flights" from the top nav.

## Test
- Open `/api/news?debug=1` — you should see per‑feed status.
- Go to any island, click **News** — headlines should be specific to that island.
