# CaribPulse — Netlify Ready

**What this is:** A Next.js app (App Router) that shows hourly weather (Open‑Meteo) and Caribbean news (server-side RSS). Preconfigured for **Netlify + GitHub**.

## Quick start
1. Upload this folder to a new GitHub repo.
2. On Netlify: **Add new site → Import from GitHub**, select the repo.
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Node: use 18+ (provided via `.nvmrc`).

## Local dev
```bash
npm i
npm run dev  # http://localhost:5173
```

## Files added for Netlify
- `netlify.toml` (uses @netlify/plugin-nextjs)
- `.gitignore`
- `.nvmrc` (Node 18)

## Customize
- Edit `lib/islands.ts` to add/adjust islands (coords).
- Add news feeds per island in `app/api/news/route.ts` (FEEDS).
