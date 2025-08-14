# CaribPulse — Caribbean News, Weather & Hurricanes
Features added:
- **Per‑island pages** `/island/[code]` with 5‑day forecast, live radar (Windy embed), and alert links
- **OG image previews** via `/api/preview?url=...`
- **Bookmarks** (localStorage) + **Top stories** digest on home
- **Admin JSON for feeds**: edit at `/admin`, download `feeds.json`, replace `/public/feeds.json` in repo to update without code edits
- **Hurricane tracking** page `/hurricanes` with NHC map + advisories RSS

Deploy: Netlify with `@netlify/plugin-nextjs`. Build: `npm run build`; publish: `.next`.
