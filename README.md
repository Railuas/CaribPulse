# CaribePulse WeatherStage Add‑on

This drop‑in replaces the empty red‑rings placeholder with a modern animated panel:
- Tabs: **Radar**, **Hourly**, **Alerts**, **Storms**
- Live Windy radar embed centered on the selected island
- Smooth micro‑animations and glassy UI
- Lightweight SVG sparklines (no heavy chart libs)
- Works without extra deps; pure React + CSS

## Files
- `app/components/WeatherStage.tsx` – the main panel
- `app/components/Spark.tsx` – tiny SVG sparkline (skip if you already have one)
- `app/styles/weather-stage.css` – styles for the panel
- `sample/fixtures.ts` – example location+hourly data (for testing)

## How to wire it in (Next.js app router)
1) Copy files into your project in the same folders.
2) Import and render the panel where the red rings container lives, e.g. in `app/page.tsx`:

```tsx
import WeatherStage from "./components/WeatherStage";
import { samplePoint, sampleHourly, sampleAlerts, sampleStorms } from "../sample/fixtures";

// Use your real selected island's lat/lon + hourly + alerts if you have them.
// For now you can test with the sample fixtures.
<WeatherStage
  point={selectedPoint ?? samplePoint}
  hourly={hourly ?? sampleHourly}
  alerts={alerts ?? sampleAlerts}
  storms={storms ?? sampleStorms}
/>
```

3) Ensure the container for the right‑hand column allows the panel to grow. For example:
```tsx
<div className="stage-wrap">
  <WeatherStage point={{lat:17.3, lon:-62.73, name:"St Kitts"}} hourly={sampleHourly} alerts={sampleAlerts} storms={sampleStorms} />
</div>
```

4) Include the CSS once (e.g., in `app/layout.tsx` or the page that renders the panel):
```tsx
import "./styles/weather-stage.css";
```

### Windy embed note
Radar uses the public Windy embed. No API key is required for the default overlay.
If you already track `selectedIsland` or `selectedPoint` in state, pass it into `WeatherStage` via the `point` prop and the iframe will auto‑center.

### Customize
- Accent color: change `--accent` in `weather-stage.css`
- Ring color: change `--ring`
- Default zoom: tweak the `zoom` constant near the top of `WeatherStage.tsx`

Enjoy!
