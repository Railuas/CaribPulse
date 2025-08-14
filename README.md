# SKN Live Ferries Scraper Pack

Adds a **live St. Kitts & Nevis ferries** endpoint that scrapes official sources, and updates the `/ferries` page to use it.

## API
- `GET /api/ferries-live?type=ferry|taxi&day=Monday|...&source=naspa|sknvibes`
  - **naspa**: official NASPA schedules (weekday/fri/sat/sun) and the water taxi schedule
  - **sknvibes**: legacy fallback page

## Frontend
- `/ferries`: new UI with day selector, Ferry vs Water Taxi toggle, and source switcher

> Note: These pages can occasionally change. The parser is resilient but not perfect. If NASPA changes layout, ping me and I’ll adjust selectors quickly.
