# CaribePulse Full-Site Theme Pack

This turns the entire site into the new glassy, animated style AND fixes your build error.
Works with **Next.js pages router** (recommended for your repo).

## What’s inside
- `styles/global.css` — sitewide theme (colors, typography, layout, buttons, cards, tables, forms, utilities, WeatherStage styles)
- `pages/_app.tsx` — imports the global CSS
- `components/WeatherStage.tsx` — widget (types accept readonly arrays)
- `sample/fixtures.ts` — safe typed test data
- `README.md` — these instructions

## Install
1. Delete or rename the existing `app/` folder (e.g. `_app_disabled/`) so your original pages show again.
2. Copy this pack into your repo and **overwrite** when asked.
3. Ensure you have a `pages/` folder with your existing homepage. The new `pages/_app.tsx` will load the CSS globally.
4. Add the WeatherStage where you want it:

```tsx
// e.g. pages/index.tsx
import WeatherStage from '../components/WeatherStage';
import { samplePoint, sampleHourly, sampleAlerts, sampleStorms } from '../sample/fixtures';

<WeatherStage
  point={samplePoint}
  hourly={sampleHourly}
  alerts={sampleAlerts}
  storms={sampleStorms}
/>
```

## Notes
- The build error you saw was TypeScript thinking `sampleAlerts` was `readonly`. The component now accepts `Readonly<Alert[]>`, so it compiles.
- If you use Tailwind, the CSS coexists safely (Tailwind directives are at the top but optional).
- You can tweak the theme in `:root` tokens inside `styles/global.css`.
