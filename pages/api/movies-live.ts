import type { NextApiRequest, NextApiResponse } from 'next';
import { CINEMAS } from '../../lib/cinemas';

type Show = { title: string; times: string[]; rating?: string; format?: string };
type CinemaShows = { key: string; island: string; name: string; url: string; shows: Show[] };

function toText(html: string){
  // strip tags, scripts, styles
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const TIME_RE = /\b(\d{1,2}:\d{2})\s?(AM|PM)\b/gi;

function parseTheater(text: string): Show[] {
  // Heuristic parser: split by 'SHOW DETAILS' (EN) or 'VER MAS DETALLES' (ES)
  const parts = text.split(/SHOW DETAILS|VER MAS DETALLES/i).slice(1);
  const out: Show[] = [];
  for (const part of parts){
    // Title line is usually right after the split, introduced by a '#' or capitalized
    const titleMatch = part.match(/#\s*([\w\-:'!.,\s]+)/) || part.match(/\b([A-Z][\w\-:'!.,\s]{3,60})\b/);
    const title = titleMatch ? titleMatch[1].trim() : '';
    const ratingMatch = part.match(/RATING:\s*([A-Z0-9\-+]+)/i) || part.match(/CLASIFICACION:\s*([A-Z0-9\-+]+)/i);
    const formatMatch = part.match(/(CXC|IMAX|4DX|PREMIUM|SCREENX|ATMOS|VIP)/i);
    const times = Array.from(part.matchAll(TIME_RE)).map(m => (m[0].toUpperCase()));
    if (title && times.length){
      out.push({ title, times, rating: ratingMatch?.[1]?.toUpperCase(), format: formatMatch?.[1]?.toUpperCase() });
    }
  }
  // Fallback: some pages don’t use the split token; try by movie blocks starting with '#'
  if (out.length === 0){
    const blocks = partByHash(text);
    for (const b of blocks){
      const tmatch = b.match(/^#\s*(.+?)\s(\bGENRE\b|RATING:|CLASIFICACION:|\d{1,2}:\d{2}\s?(AM|PM))/i);
      const title = tmatch ? tmatch[1].trim() : '';
      const times = Array.from(b.matchAll(TIME_RE)).map(m => (m[0].toUpperCase()));
      const ratingMatch = b.match(/RATING:\s*([A-Z0-9\-+]+)/i) || b.match(/CLASIFICACION:\s*([A-Z0-9\-+]+)/i);
      if (title && times.length) out.push({ title, times, rating: ratingMatch?.[1]?.toUpperCase() });
    }
  }
  // De-dup
  const uniq = new Map<string, Show>();
  for (const s of out){
    const k = s.title + '|' + (s.rating || '');
    const prev = uniq.get(k);
    if (!prev) uniq.set(k, s);
    else {
      // merge times
      const merged = Array.from(new Set([...(prev.times||[]), ...(s.times||[]) ]));
      uniq.set(k, { ...prev, times: merged });
    }
  }
  return Array.from(uniq.values());
}

function partByHash(text: string){
  // naive split on headings ( '# Title' appeared in our text stripping for CC pages )
  return text.split(/\s#\s/).map((p,i)=> (i===0 ? p : ('# ' + p)));
}

async function fetchText(url: string, timeoutMs = 12000){
  const ctrl = new AbortController();
  const t = setTimeout(()=>ctrl.abort(), timeoutMs);
  try{
    const res = await fetch(url, { signal: ctrl.signal, cache: 'no-store', headers: { 'user-agent': 'CaribePulseBot/1.0 (+caribepulse.netlify.app)' } });
    if (!res.ok) throw new Error('Bad status ' + res.status);
    return await res.text();
  } finally { clearTimeout(t); }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CinemaShows[] | { error: string }>) {
  const island = (req.query.island as string | undefined)?.toLowerCase();
  const list = island ? CINEMAS.filter(c => c.island.toLowerCase().includes(island)) : CINEMAS;
  try{
    const results: CinemaShows[] = [];
    for (const c of list){
      try{
        const html = await fetchText(c.url);
        const shows = parseTheater(toText(html));
        results.push({ key: c.key, island: c.island, name: c.name, url: c.url, shows });
      }catch(e){
        results.push({ key: c.key, island: c.island, name: c.name, url: c.url, shows: [] });
      }
    }
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=300');
    res.status(200).json(results);
  }catch(e: any){
    res.status(200).json({ error: e?.message || 'failed' });
  }
}
