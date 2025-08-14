# CaribePulse drop-in (fixed)

- `app/layout.tsx` imports `app/globals.css`
- `app/components/WeatherStage.tsx` has relaxed `severity` type and animations
- `sample/fixtures.ts` uses `as const` for severities
- `app/page.tsx` demo wired to sample data

Build:
  npm run build && npm run start
