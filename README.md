# CaribePulse Hotfix – Zoom Earth Hurricanes + TSConfig

This pack does two things:
1) Adds a **Hurricanes** page that uses **Zoom Earth** (with a Windy fallback) in a tidy tabbed tracker.
2) Fixes your Netlify build by telling TypeScript to **ignore archived folders** like `caribpulse_netlify_ready/` which are currently causing type errors.

## Install
1. Delete the `app/` folder from your repo if it still exists (router conflict).
2. Copy the contents of this zip to your repository root and commit.
3. Ensure your global CSS is already loaded (via `pages/_app.tsx`). If not, also import `styles/hurricane-embed.css` there.

### Files added
- `pages/hurricanes.tsx`
- `components/HurricaneTracker.tsx`
- `styles/hurricane-embed.css`
- `tsconfig.json` (safe replacement) – excludes archived dirs and adds `@/*` alias

## Why TS was failing
Next compiles **all** `.ts/tsx` files in the repo, not only pages. You have an uploaded folder:
`caribpulse_netlify_ready/caribpulse/app/page.tsx`
that imports `@/lib/islands` but no alias existed. The new `tsconfig.json` both **excludes** that folder and creates an alias so similar paths won’t break again.

## Use
Visit `/hurricanes`. The tracker has tabs:
- **Zoom Earth** – satellite + storms layer, centered on the Caribbean
- **Windy Radar** – quick radar fallback
Links to **NHC** and **CIMSS** are provided for official advisories.

You can also embed the tracker on any page:
```tsx
import HurricaneTracker from '../components/HurricaneTracker';

<HurricaneTracker lat={16.3} lon={-61.1} zoom={5} />
```
