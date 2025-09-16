// pages/api/movies-live.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { CINEMAS } from '../../lib/cinemas';

type Show = { title: string; times: string[]; rating?: string; format?: string; poster?: string };
type CinemaShows = { key: string; island: string; name: string; url: string; shows: Show[] };

function norm(s: string){ return (s||'').toLowerCase().replace(/&/g,'and').replace(/[^a-z]/g,''); }

function toText(html: string){
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findPosterForTitle(html: string | undefined, title: string): string | undefined {
  if (!html || !title) return undefined;
  const safe = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<img[^>]+(?:alt=["'][^"']*${safe}[^"']*["']|title=["'][^"']*${safe}[^"']*["'])[^>]*>`, 'i');
  const m = html.match(re);
  if (m) {
    const tag = m[0];
    const src = tag.match(/\ssrc=["']([^"']+)["']/i)?.[1] || tag.match(/\sdata-src=["']([^"']+)["']/i)?.[1];
    if (src) {
      try { return new URL(src, 'https://caribbeancinemas.com').toString(); } catch { return src; }
    }
  }
  return undefined;
}

const TIME_RE = /\b(\d{1,2}:\d{2})\s?(AM|PM)\b/gi;

function parseTheater(text: string): Show[];
function parseTheater(text: string, html?: string): Show[];
function parseTheater(text: string, html?: string): Show[] {
  const out: Show[] = [];

  // Caribbean Cinemas cards usually include "SHOW DETAILS" / "VER MAS DETALLES"
  const blocks = text.split(/SHOW DETAILS|VER MAS DETALLES/i);
  if (blocks.length > 1){
    for (const b of blocks){
      const titleMatch = b.match(/#\s*([A-Z0-9][\w\-:'!.,\s]{2,80})/);
      const title = titleMatch ? titleMatch[1].trim() : '';
      const times = Array.from(b.matchAll(TIME_RE)).map(m => m[0].toUpperCase());
      if (title && times.length){
        const rating = b.match(/RATING:\s*([A-Z0-9\-+]+)/i)?.[1]?.toUpperCase();
        const format = b.match(/\b(CXC|IMAX|4DX|PREMIUM|SCREENX|ATMOS|VIP)\b/i)?.[1]?.toUpperCase();
        out.push({ title, times, rating, format, poster: findPosterForTitle(html, title) });
      }
    }
  }

  // fallback: detect by "# Title" headings
  if (!out.length){
    for (const b of text.split(/\s#\s/)){
      const blk = b.startsWith('# ') ? b : '# ' + b;
      const tmatch = blk.match(/^#\s*(.+?)\s(\bGENRE\b|RATING:|CLASIFICACION:|\d{1,2}:\d{2}\s?(AM|PM))/i);
      const title = tmatch ? tmatch[1].trim() : '';
      const times = Array.from(blk.matchAll(TIME_RE)).map(m => m[0].toUpperCase());
      if (title && times.length) out.push({ title, times, poster: findPosterForTitle(html, title) });
    }
  }

  // dedupe/merge
  const uniq = new Map<string, Show>();
  for (const s of out){
    const k = s.title.toUpperCase();
    const prev = uniq.get(k);
    if (!prev) uniq.set(k, s);
    else uniq.set(k, { ...prev, times: Array.from(new Set([...(prev.times||[]), ...(s.times||[])])), poster: prev.poster || s.poster });
  }
  return Array.from(uniq.values());
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
  const islandRaw = String((req.query.island as string | undefined) || 'All Caribbean');
  const iln = norm(islandRaw);
  const list = iln === norm('All Caribbean')
    ? CINEMAS
    : CINEMAS.filter(c => {
        const n = norm(c.island);
        return n === iln || n.includes(iln) || iln.includes(n);
      });

  try{
    const results: CinemaShows[] = [];
    for (const c of list){
      try{
        const html = await fetchText(c.url);
        const shows = parseTheater(toText(html), html);
        results.push({ key: c.key, island: c.island, name: c.name, url: c.url, shows });
      }catch{
        results.push({ key: c.key, island: c.island, name: c.name, url: c.url, shows: [] });
      }
    }
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=300');
    res.status(200).json(results);
  }catch(e: any){
    res.status(200).json({ error: e?.message || 'failed' });
  }
}