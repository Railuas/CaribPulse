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

let cache: { t: number; data: any } | null = null;
const TTL = 5 * 60 * 1000;

function firstImgFromHtml(html?: string): string | undefined {
  if (!html) return undefined;
  const m = html.match(/<img[^>]*src=["']([^"']+)["']/i);
  return m ? m[1] : undefined;
}

function imageFromItem(it: any): string | undefined {
  if (it.enclosure?.url) return String(it.enclosure.url);
  const mc = it.mediaContent;
  if (mc && typeof mc === 'object') {
    if (Array.isArray(mc)) {
      for (const x of mc) { if (x?.$?.url) return String(x.$.url); }
    } else if (mc.$?.url) { return String(mc.$.url); }
  }
  const mt = it.mediaThumb;
  if (mt && typeof mt === 'object' && mt.$?.url) return String(mt.$.url);
  const im = firstImgFromHtml(it.contentEncoded);
  if (im) return im;
  const im2 = firstImgFromHtml(it.contentSnippet);
  if (im2) return im2;
  return undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  try{
    const now = Date.now();
    if (cache && now - cache.t < TTL){
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=300');
      return res.status(200).json(cache.data);
    }

    const out: ItemOut[] = [];
    for (const feed of FEEDS){
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
            image: imageFromItem(it)
          });
        }
      }catch(e){}
    }

    const seen = new Set<string>();
    const dedup = out.filter(i => {
      if(!i.link) return false;
      if(seen.has(i.link)) return false;
      seen.add(i.link);
      return true;
    });

    dedup.sort((a,b)=> new Date(b.published || 0).getTime() - new Date(a.published || 0).getTime());

    const payload = { ok: true, items: dedup.slice(0, 150) };
    cache = { t: now, data: payload };
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=300');
    res.status(200).json(payload);
  }catch(e:any){
    res.status(200).json({ ok:false, items:[], error: e?.message || 'failed' });
  }
}

export const config = { api: { externalResolver: true }, runtime: 'nodejs' };
