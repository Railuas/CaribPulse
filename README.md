# CaribePulse Island Hub Pack

What this adds
- **Island hub** at `/island/[slug]` with tabs: Weather • News • Schedules • Hurricanes
- **Island grid** on the homepage with **Open** buttons linking into the hub
- **News API** supports `?q=` to filter by island name
- **Hurricanes** page with Windy embed + Zoom Earth external button, plus a Back link in the tracker
- **Global header/footer**, **favicon**, small CSS add-ons
- **Schedules** powered by Aerodatabox via Netlify env `AERODATABOX_RAPIDAPI_KEY`

How to install
1) Delete the `app/` folder if it exists to avoid router conflicts.
2) Copy all files into your repo (merge/overwrite).
3) Ensure your global theme is imported in `pages/_app.tsx` (the provided file does this).
4) Add Netlify env `AERODATABOX_RAPIDAPI_KEY`.
5) Deploy, then visit `/` and click **Open** on any island card.

Edit islands
- `lib/islands.ts` — add/rename islands, update lat/lon and default `icao` for schedules.

Notes
- If Zoom Earth refuses to embed, use the button that opens it in a new tab.
- If the News widget is empty, feeds might be temporarily slow; it will populate as the API succeeds.
