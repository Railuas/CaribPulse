// pages/api/news.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';
import { FEEDS } from '@/lib/newsSources';

type Item = {
  id: string;
  title: string;
  url: string;
  source: string;
  country: string;
  published?: string;
  image?: string;
  summary?: string;
};

const parser = new Parser();
let cache: { t: number; data: any } | null = null;
const TTL = 5 * 60 * 1000;

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  try{
    const now = Date.now();
    if (cache && now - cache.t < TTL){
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=300');
      return res.status(200).json(cache.data);
    }

    const items: Item[] = [];
    for (const feed of FEEDS){
      try{
        const f = await parser.parseURL(feed.url);
        for (const it of f.items || []){
          const id = (it.guid || it.link || `${feed.name}-${it.title}` || `${feed.url}-${Math.random()}`).toString();
          items.push({
            id,
            title: String(it.title || '').trim(),
            url: String(it.link || ''),
            source: feed.name,
            country: feed.country,
            published: (it.isoDate || it.pubDate || '') as string,
            summary: (it.contentSnippet || '').toString()
          });
        }
      }catch(e){}
    }

    // dedupe by url
    const seen = new Set<string>();
    const dedup = items.filter(i => {
      if(!i.url) return false;
      if(seen.has(i.url)) return false;
      seen.add(i.url);
      return true;
    });

    // sort by published desc
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
