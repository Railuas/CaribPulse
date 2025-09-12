import type { NextApiRequest, NextApiResponse } from 'next';
import { CARIBBEAN_CINEMAS_LOCATIONS } from '@/lib/moviesMap';

type Showtime = { title: string; times: string[]; cinema: string; url: string };

function extractTimesBlock(html: string){
  // Try a few common patterns from Caribbean Cinemas pages
  const blocks = html.match(/<ul[^>]*class=["'][^"']*(showtimes|times)[^"']*["'][^>]*>[\s\S]*?<\/ul>/gi) || [];
  const alt = html.match(/<div[^>]*class=["'][^"']*(showtimes|times)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi) || [];
  return blocks.concat(alt).join('\n');
}

function pickAll(re: RegExp, s: string){ const out: string[] = []; let m: RegExpExecArray | null;
  while ((m = re.exec(s))){ out.push(m[1].trim()); } return out; }

function decodeHtml(s: string){
  return s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
}

function extractMovies(html: string, cinemaName: string, url: string): Showtime[] {
  const section = extractTimesBlock(html) || html;

  // Titles: look for h3/h2 with movie names near showtimes
  const titles = pickAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi, section).map(decodeHtml);
  // Times: look like "4:30 PM", "19:10", etc.
  const timesPerTitle: string[][] = [];
  const chunks = section.split(/<h[23][^>]*>/i).slice(1);

  for (const ch of chunks){
    const times = pickAll(/\b(\d{1,2}[:.]\d{2}\s*(AM|PM)?|\d{1,2}\s*(AM|PM))\b/gi, ch);
    timesPerTitle.push(times);
  }

  const out: Showtime[] = [];
  for (let i=0;i<titles.length;i++){
    const t = titles[i].replace(/<[^>]+>/g,'').trim();
    if (!t) continue;
    const times = timesPerTitle[i] || [];
    if (times.length === 0) continue;
    out.push({ title: t, times, cinema: cinemaName, url });
  }
  return out;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const country = (req.query.country as string) || 'All Caribbean';
  const locs = CARIBBEAN_CINEMAS_LOCATIONS[country] || [];
  if (!locs.length){
    // If no country match, search across all configured locations
    const all: Showtime[] = [];
    const entries = Object.values(CARIBBEAN_CINEMAS_LOCATIONS).flat();
    const responses = await Promise.allSettled(entries.map(async loc => {
      const r = await fetch(loc.url, { headers: { 'user-agent': 'MagnetideBot/1.0' } });
      const html = await r.text();
      return extractMovies(html, loc.name, loc.url);
    }));
    for (const r of responses){
      if (r.status === 'fulfilled') all.push(...r.value);
    }
    const dedup = deduplicate(all);
    return res.status(200).json({ ok:true, country, items: dedup });
  }

  try{
    const out: Showtime[] = [];
    const responses = await Promise.allSettled(locs.map(async loc => {
      const r = await fetch(loc.url, { headers: { 'user-agent': 'MagnetideBot/1.0' } });
      const html = await r.text();
      return extractMovies(html, loc.name, loc.url);
    }));
    for (const r of responses){
      if (r.status === 'fulfilled') out.push(...r.value);
    }
    const dedup = deduplicate(out);
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=900');
    return res.status(200).json({ ok:true, country, items: dedup });
  }catch(e:any){
    return res.status(200).json({ ok:false, country, items: [], error: e?.message || 'failed' });
  }
}

function deduplicate(items: Showtime[]): Showtime[]{
  const seen = new Set<string>();
  const out: Showtime[] = [];
  for (const it of items){
    const key = it.title + '|' + it.cinema;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
}
