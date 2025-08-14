# Ferries + Movies + Spacing + Hurricane Fix Pack

This pack adds:
- `/ferries` — searchable ferry routes (static JSON you can edit in `public/data/ferries.json`)
- `/movies` — island-by-island movie showtimes (edit `public/data/movies.json`)
- Better spacing & container sizing (`styles/addons.css`)
- Hurricane page uses **Windy** embed by default; **Zoom Earth** opens in a new tab (iframes often blocked)
- Top nav links to **Flights**, **Ferries**, **Movies**

## Install
1) Make sure you are using the **Pages Router** only (no `/app` folder anywhere).
2) Copy these files into your repo root (merge/overwrite):
   - `pages/_app.tsx`, `styles/addons.css`
   - `components/HurricaneTracker.tsx`, `pages/hurricanes.tsx`
   - `pages/ferries.tsx`, `pages/movies.tsx`
   - `public/data/ferries.json`, `public/data/movies.json`
3) Deploy to Netlify.

## Editing data
- **Ferries**: open `public/data/ferries.json`. Add, remove, or edit routes.
- **Movies**: open `public/data/movies.json`. Add cinemas per island and their showtimes.

> Want these driven by live APIs? I can wire specific providers if you share their endpoints or preferred sources.
