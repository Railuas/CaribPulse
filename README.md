# Island Ferries Tab + News Fix

This pack:
1) Adds a **Ferries** tab to each island hub (`/island/[slug]`) that pulls **live schedules** by island:
   - St. Kitts & Nevis → NASPA (with Water Taxi + SKNVibes fallback)
   - Antigua & Barbuda → Barbuda Express
   - Trinidad & Tobago → TTIT
   - Others → placeholder message (tell me the operator to add).

2) Hardens the **News API** and shows a friendly error if feeds are down.

## Files
- `components/IslandFerriesPanel.tsx` — live ferry UI (auto-selects provider from island name).
- `pages/island/[slug].tsx` — adds the **Ferries** tab.
- `pages/api/news.ts` — resilient feed fetcher + image extraction; forces Node runtime.
- `components/NewsList.tsx` — shows errors / loading states clearly.

## Install
1) Copy these files into your repo (merge/overwrite).
2) Deploy.
3) Test:
   - `/api/news` should return `{ ok: true, items: [...] }`.
   - Go to an island (e.g., St. Kitts) → Ferries tab → live times appear.
