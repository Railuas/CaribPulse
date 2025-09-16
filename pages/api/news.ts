// pages/api/news.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';
import { FEEDS } from '@/lib/newsSources';

type ItemOut = {
  id: string;
  title: string;
  link: string;
  source: string;
  country: string;
  published?: string;
  image?: string;
};

const parser = new Parser({ customFields: {
  item: [
    ['media:content', 'mediaContent'],
    ['media:thumbnail', 'mediaThumb'],
    ['content:encoded', 'contentEncoded'],
  ]
}});

let cache: { t: number; key: string; data: any } | null = null;
const TTL = 5 * 60 * 1000;
const ENRICH_TOP = 20;

function firstImgFromHtml(html?: string): string | undefined {
  if (!html) return undefined;
  const m = html.match(/<img[^>]*src=["']([^"']+)["']/i);
  return m ? m[1] : undefined;
}
function absolute(u: string, base: string): string {
  try { return new URL(u, base).toString(); } catch { return u; }
}

function imageFromItem(it: any, feedUrl: string): string | undefined {
  if (it.enclosure?.url) return absolute(String(it.enclosure.url), feedUrl);
  const mc = it.mediaContent;
  if (mc && typeof mc === 'object') {
    if (Array.isArray(mc)) for (const x of mc) if (x?.$?.url) return absolute(String(x.$.url), feedUrl);
    else if ((mc as any).$?.url) return absolute(String((mc as any).$.url), feedUrl);
  }
  const mt = it.mediaThumb;
  if (mt && typeof mt === 'object' && (mt as any).$?.url) return absolute(String((mt as any).$.url), feedUrl);
  const im = firstImgFromHtml(it.contentEncoded);
  if (im) return absolute(im, feedUrl);
  const im2 = firstImgFromHtml(it.contentSnippet);
  if (im2) return absolute(im2, feedUrl);
  return undefined;
}

async function fetchOg(url: string): Promise<string | undefined> {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await r.text();
    const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i)
           || html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i);
    return m ? m[1] : undefined;
  } catch { return undefined; }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  try{
    const countryQ = String(req.query.country || 'All Caribbean').trim();
    const key = countryQ.toLowerCase();
    const now = Date.now();
    if (cache && cache.key === key && (now - cache.t) < TTL) {
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=300');
      return res.status(200).json(cache.data);
    }

    const feeds = countryQ.toLowerCase() === 'all caribbean'
      ? FEEDS
      : FEEDS.filter(f => f.country.toLowerCase() === countryQ.toLowerCase());

    const out: ItemOut[] = [];
    for (const feed of feeds){
      try{
        const f = await parser.parseURL(feed.url);
        for (const it of f.items || []){
          const id = (it.guid || it.link || `${feed.name}-${it.title}` || `${feed.url}-${Math.random()}`).toString();
          out.push({
            id,
            title: String(it.title || '').trim(),
            link: String(it.link || ''),
            source: feed.name,
            country: feed.country,
            published: (it.isoDate || it.pubDate || '') as string,
            image: imageFromItem(it, feed.url)
          });
        }
      }catch{}
    }

    const seen = new Set<string>();
    let dedup = out.filter(i => {
      if (!i.link) return false;
      if (seen.has(i.link)) return false;
      seen.add(i.link); return true;
    });

    dedup.sort((a,b)=> new Date(b.published || 0).getTime() - new Date(a.published || 0).getTime());

    const toEnrich = dedup.slice(0, ENRICH_TOP);
    await Promise.all(toEnrich.map(async (it) => {
      if (!it.image) {
        const img = await fetchOg(it.link);
        if (img) it.image = img;
      }
    }));

    const payload = { ok: true, items: dedup.slice(0, 150) };
    cache = { t: now, key, data: payload };
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=300');
    res.status(200).json(payload);
  }catch(e:any){
    res.status(200).json({ ok:false, items:[], error: e?.message || 'failed' });
  }
}

export const config = { api: { externalResolver: true }, runtime: 'nodejs' };