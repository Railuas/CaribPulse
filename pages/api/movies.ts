
import type { NextApiRequest, NextApiResponse } from 'next';
import { CARIBBEAN_CINEMAS_LOCATIONS } from '@/lib/moviesMap';

type Showtime = { title: string; times: string[]; cinema: string; url: string };

function ensureStrings(arr: RegExpMatchArray | null): string[] {
  if (!arr) return [];
  return Array.from(arr).map(s => String(s));
}

function extractTimesBlock(html: string): string{
  const blocks = ensureStrings(html.match(/<ul[^>]*class=["'][^"']*(showtimes|times)[^"']*["'][^>]*>[\s\S]*?<\/ul>/gi));
  const alt    = ensureStrings(html.match(/<div[^>]*class=["'][^"']*(showtimes|times)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi));
  return [...blocks, ...alt].join('\n');
}

function pickAll(re: RegExp, s: string){ const out: string[] = []; let m: RegExpExecArray | null;
  while ((m = re.exec(s))){ out.push(m[1].trim()); } return out; }

function decodeHtml(s: string){
  return s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
}

function stripTags(s: string){ return s.replace(/<[^>]+>/g,''); }

function extractMovies(html: string, cinemaName: string, url: string): Showtime[] {
  const section = extractTimesBlock(html) || html;

  const titles = pickAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi, section).map(t => decodeHtml(stripTags(t)));
  const timesPerTitle: string[][] = [];
  const chunks = section.split(/<h[23][^>]*>/i).slice(1);

  for (const ch of chunks){
    const times = pickAll(/\b(\d{1,2}[:.]\d{2}\s*(AM|PM)?|\d{1,2}\s*(AM|PM))\b/gi, ch);
    timesPerTitle.push(times);
  }

  const out: Showtime[] = [];
  for (let i=0;i<titles.length;i++){
    const t = titles[i]?.trim();
    if (!t) continue;
    const times = (timesPerTitle[i] || []).map(x => x.replace(/\s+/g,' ').trim()).filter(Boolean);
    if (times.length === 0) continue;
    out.push({ title: t, times, cinema: cinemaName, url });
  }
  return out;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const country = (req.query.country as string) || 'All Caribbean';
  const locs = CARIBBEAN_CINEMAS_LOCATIONS[country] || [];
  const entries = locs.length ? locs : Object.values(CARIBBEAN_CINEMAS_LOCATIONS).flat();

  try{
    const out: Showtime[] = [];
    const responses = await Promise.allSettled(entries.map(async loc => {
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
