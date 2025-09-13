import type { NextApiRequest, NextApiResponse } from 'next';
import { CARIBBEAN_CINEMAS_LOCATIONS } from '@/lib/moviesMap';

type Showtime = { cinema: string; url: string; title: string; times: string[] };

function ensureStrings(arr: RegExpMatchArray | null): string[] {
  return arr ? Array.from(arr, s => String(s)) : [];
}

function onlyValidTimes(tokens: string[]): string[] {
  // Accept: 04:30, 7:15 PM, 9 PM (but NOT 3.42 or 0.12)
  const valid = tokens
    .map(t => t.trim())
    .filter(Boolean)
    .filter(t => /^(\d{1,2}:\d{2}\s*(AM|PM)?|\b\d{1,2}\s*(AM|PM)\b)$/i.test(t));
  // Normalize spacing (e.g., "7 PM" -> "7 PM")
  return Array.from(new Set(valid));
}

function timeToMinutes(t: string): number {
  // "7 PM" / "07:30" / "07:30 PM"
  const ampm = /am|pm/i.test(t) ? t.trim().toUpperCase() : null;
  let h = 0, m = 0;
  const hm = t.match(/(\d{1,2})(?::(\d{2}))?/);
  if (hm) {
    h = parseInt(hm[1], 10);
    m = hm[2] ? parseInt(hm[2], 10) : 0;
  }
  if (ampm) {
    const isPM = /PM/.test(ampm);
    if (h === 12) h = isPM ? 12 : 0;
    else if (isPM) h += 12;
  }
  return h * 60 + m;
}

function sortTimes(times: string[]): string[] {
  return [...times].sort((a, b) => timeToMinutes(a) - timeToMinutes(b));
}

function extractTimesContainer(html: string): string {
  const blocks = ensureStrings(html.match(/<ul[^>]*class=["'][^"']*(showtimes|times)[^"']*["'][^>]*>[\s\S]*?<\/ul>/gi));
  const alt    = ensureStrings(html.match(/<div[^>]*class=["'][^"']*(showtimes|times)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi));
  return [...blocks, ...alt].join('\n');
}

function pickAll(re: RegExp, s: string) {
  const out: string[] = []; let m: RegExpExecArray | null;
  while ((m = re.exec(s))) out.push(m[1]);
  return out;
}
const stripTags = (s:string) => s.replace(/<[^>]+>/g,'').trim();
const decodeHtml = (s:string) => s
  .replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'")
  .replace(/&lt;/g,'<').replace(/&gt;/g,'>');

function extractFromHtml(html: string, cinemaName: string, url: string): Showtime[] {
  // Focus on the showtimes container if present
  const section = extractTimesContainer(html) || html;

  // Chunk by headings near times
  const parts = section.split(/<h[23][^>]*>/i).slice(1);
  const titles = pickAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi, section).map(t => decodeHtml(stripTags(t)));

  const result: Showtime[] = [];
  for (let i = 0; i < parts.length; i++) {
    const chunk = parts[i];

    // Collect candidate time tokens in the chunk
    const tokens = pickAll(/\b(\d{1,2}:\d{2}\s*(?:AM|PM)?|\d{1,2}\s*(?:AM|PM))\b/gi, chunk);
    const times = sortTimes(onlyValidTimes(tokens));
    if (times.length === 0) continue;

    const rawTitle = titles[i] || '';
    const title = rawTitle.replace(/\s{2,}/g,' ').trim();
    if (!title) continue;

    result.push({ cinema: cinemaName, url, title, times });
  }
  return result;
}

function dedupe(items: Showtime[]): Showtime[] {
  const seen = new Set<string>();
  const out: Showtime[] = [];
  for (const x of items) {
    const key = `${x.cinema}|${x.title}|${x.times.join(',')}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(x);
  }
  return out;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const country = (req.query.country as string) || 'All Caribbean';
  const locs = CARIBBEAN_CINEMAS_LOCATIONS[country] || [];
  const entries = locs.length ? locs : Object.values(CARIBBEAN_CINEMAS_LOCATIONS).flat();

  try {
    const all: Showtime[] = [];
    const responses = await Promise.allSettled(entries.map(async loc => {
      const r = await fetch(loc.url, { headers: { 'user-agent': 'MagnetideBot/1.0' } });
      const html = await r.text();
      return extractFromHtml(html, loc.name, loc.url);
    }));
    for (const r of responses) if (r.status === 'fulfilled') all.push(...r.value);
    const items = dedupe(all);
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=900');
    res.status(200).json({ ok: true, country, items });
  } catch (e:any) {
    res.status(200).json({ ok:false, country, items: [], error: e?.message || 'failed' });
  }
}
