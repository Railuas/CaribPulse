// pages/api/news.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';
import { FEEDS } from '../../lib/newsSources';

function norm(s: string){ return (s||'').toLowerCase().replace(/&/g,'and').replace(/[^a-z]/g,''); }

type ItemOut = { id:string; title:string; link:string; source:string; country:string; published?:string; image?:string };

const parser = new Parser({ customFields: { item: [['media:content','mediaContent'], ['media:thumbnail','mediaThumb'], ['content:encoded','contentEncoded']] } });
let cache: { t:number; key:string; data:any } | null = null;
const TTL = 5*60*1000, ENRICH_TOP = 20;

function firstImg(html?:string){ if(!html) return; const m = html.match(/<img[^>]*src=["']([^"']+)["']/i); return m?m[1]:undefined; }
function abs(u:string, base:string){ try{ return new URL(u, base).toString(); }catch{ return u; } }
function imgFromItem(it:any, feedUrl:string){
  if (it.enclosure?.url) return abs(String(it.enclosure.url), feedUrl);
  const mc = it.mediaContent; if (mc){ if (Array.isArray(mc)) for (const x of mc) if (x?.$?.url) return abs(String(x.$.url), feedUrl); else if ((mc as any).$?.url) return abs(String((mc as any).$.url), feedUrl); }
  const mt = it.mediaThumb; if (mt && (mt as any).$?.url) return abs(String((mt as any).$.url), feedUrl);
  const a = firstImg(it.contentEncoded); if (a) return abs(a, feedUrl);
  const b = firstImg(it.contentSnippet); if (b) return abs(b, feedUrl);
  return undefined;
}
async function fetchOg(url:string){ try{ const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }); const h = await r.text(); const m = h.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || h.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i); return m?m[1]:undefined; }catch{ return undefined; } }

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const countryRaw = String(req.query.country || 'All Caribbean');
  const k = 'news:'+norm(countryRaw);
  const now = Date.now();
  if (cache && cache.key === k && (now - cache.t) < TTL){ res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=300'); return res.status(200).json(cache.data); }

  const feeds = norm(countryRaw) === norm('All Caribbean')
    ? FEEDS
    : FEEDS.filter(f => { const a = norm(f.country); const b = norm(countryRaw); return a===b || a.includes(b) || b.includes(a); });

  const out: ItemOut[] = [];
  for (const f of feeds){
    try{
      const feed = await parser.parseURL(f.url);
      for (const it of feed.items || []){
        const id = (it.guid || it.link || `${f.name}-${it.title}` || `${f.url}-${Math.random()}`).toString();
        out.push({ id, title: String(it.title||'').trim(), link: String(it.link||''), source: f.name, country: f.country, published: (it.isoDate||it.pubDate||'') as string, image: imgFromItem(it, f.url) });
      }
    }catch{}
  }
  const seen = new Set<string>();
  const dedup = out.filter(i => i.link && !seen.has(i.link) && (seen.add(i.link) || true));
  dedup.sort((a,b)=> new Date(b.published||0).getTime() - new Date(a.published||0).getTime());
  await Promise.all(dedup.slice(0, ENRICH_TOP).map(async it => { if (!it.image){ const im = await fetchOg(it.link); if (im) it.image = im; } }));
  const payload = { ok:true, items: dedup.slice(0,150) };
  cache = { t: now, key: k, data: payload };
  res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=300');
  res.status(200).json(payload);
}
