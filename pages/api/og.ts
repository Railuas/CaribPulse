import type { NextApiRequest, NextApiResponse } from 'next';

let cache: Record<string, { t: number; url: string | null }> = {};
const TTL = 60 * 60 * 1000; // 1 hour

function extractOg(html: string): string | null {
  const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i)
         || html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  return m ? m[1] : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const url = String(req.query.url || '');
  if (!url) return res.status(400).json({ error: 'missing url' });
  try{
    const now = Date.now();
    const hit = cache[url];
    if (hit && (now - hit.t) < TTL) {
      return res.status(200).json({ url: hit.url });
    }
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await r.text();
    const img = extractOg(html);
    cache[url] = { t: now, url: img };
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=3600');
    return res.status(200).json({ url: img });
  }catch(e:any){
    return res.status(200).json({ url: null, error: e?.message || 'failed' });
  }
}

export const config = { api: { externalResolver: true }, runtime: 'nodejs' };