# CaribePulse pages-router final pack

This pack assumes you're using **Next.js Pages Router** (the `pages/` folder).
It adds the global theme and fixes typings. It **requires removing** the `app/` folder to avoid router conflicts.

## Steps
1) Delete the `app/` folder from your repo and commit the removal.
2) Copy these files into your repo root (merge/overwrite):
   - `pages/_app.tsx`
   - `styles/global.css`
   - `components/WeatherStage.tsx`
   - `sample/fixtures.ts` (optional demo data)
3) On any page, render the widget:

```tsx
import WeatherStage from '../components/WeatherStage';
import { samplePoint, sampleHourly, sampleAlerts, sampleStorms } from '../sample/fixtures';

<WeatherStage
  point={samplePoint}
  hourly={sampleHourly}
  alerts={sampleAlerts}
  storms={sampleStorms}
/>
```

4) Ensure your `next.config.mjs` does not set `experimental.appDir`.
