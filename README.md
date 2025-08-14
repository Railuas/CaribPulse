# CaribePulse Drop‑In (App Router)

This package gives you *everything* wired:
- `app/layout.tsx` + `app/globals.css`
- `app/components/WeatherStage.tsx`
- `sample/fixtures.ts`
- `app/page.tsx` demo page

## Install
1) Back up your existing app files if needed.
2) Copy the `/app` and `/sample` folders into your project root, **overwrite if asked**.
3) Run dev server and open the root page.

If you already have a homepage and only want the panel, copy the `<WeatherStage .../>` block from `app/page.tsx` into your page and keep the global CSS import in `app/layout.tsx`.
