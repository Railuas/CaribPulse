# CaribePulse Component Only Pack (safe)

This pack WON'T override your homepage. It only adds:
- /components/WeatherStage.tsx
- /styles/global.css
- /sample/fixtures.ts
- /pages/_app.tsx (imports the global CSS)

## Install
1) Copy everything into your repo (merge folders).
2) If you already have `pages/_app.tsx`, just add this line at the top:
   `import '../styles/global.css';`

## Use
On whatever page has the red circle area, import and render:
```tsx
import WeatherStage from '../components/WeatherStage';
import { samplePoint, sampleHourly, sampleAlerts, sampleStorms } from '../sample/fixtures';

<WeatherStage
  point={samplePoint}       // replace with your selected island {lat, lon, name}
  hourly={sampleHourly}     // replace with your forecast array
  alerts={sampleAlerts}     // optional
  storms={sampleStorms}     // optional
/>
```
