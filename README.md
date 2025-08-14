# CaribePulse: News + Schedules + Hurricanes (Zoom Earth) Pack

This adds:
- `/api/news` + `<NewsList />` headlines widget
- `/api/flights` + `/schedules` arrivals/departures (uses Aerodatabox via RapidAPI)
- `/hurricanes` with **Zoom Earth** (Windy fallback)
- `tsconfig.snippet.json` with alias & excludes to avoid TS errors from uploaded archives

## Install
1) Unzip into your repo root (merge/overwrite if asked).
2) Ensure global CSS is loaded in `pages/_app.tsx`:
   ```tsx
   import '../styles/global.css';
   export default function MyApp({ Component, pageProps }) { return <Component {...pageProps} />; }
   ```
3) **Environment**: On Netlify, add env var `AERODATABOX_RAPIDAPI_KEY`.
4) (Optional) Merge TypeScript settings by copying fields from `tsconfig.snippet.json` into your existing `tsconfig.json`:
   - `compilerOptions.baseUrl`, `compilerOptions.paths`
   - `exclude` list to ignore uploaded archives
5) Add headlines to your homepage:
   ```tsx
   import NewsList from '../components/NewsList';
   <div className="card" style={{ marginTop: 16 }}>
     <h4 style={{ marginTop: 0 }}>Latest News</h4>
     <NewsList />
   </div>
   ```
6) Visit `/schedules` and `/hurricanes`.
