// pages/api/news.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { FEEDS } from '@/lib/newsSources';

type Item = {
  id: string;         // stable hash of URL
  title: string;
  url: string;
  source: string;
  country: string;
  published?: string;
  image?: string;
  summary?: string;
};

function b64(s: string){ return Buffer.from(s).toString('base64url'); }
function ub64(s: string){ return Buffer.from(s, 'base64url').toString(); }

function textBetween(s:string, start:string, end:string){
  const i = s.indexOf(start); if(i<0) return '';
  const j = s.indexOf(end, i+start.length); if(j<0) return '';
  return s.slice(i+start.length, j);
}

function pickOG(html: string){
  const get = (prop:string)=>{
    const m = html.match(new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i'));
    return m ? m[1] : undefined;
  };
  return {
    title: get('og:title') || get('twitter:title'),
    image: get('og:image') || get('twitter:image'),
    desc:  get('og:description') || get('twitter:description'),
  };
}

function decodeHTMLEntities(s:string){
  return s
    .replace(/&amp;/g,'&')
    .replace(/&quot;/g,'"')
    .replace(/&#39;/g,"'")
    .replace(/&lt;/g,'<')
    .replace(/&gt;/g,'>');
}

async function fetchXML(url:string){
  const r = await fetch(url, { headers: { 'user-agent': 'MagnetideBot/1.0' } });
  return await r.text();
}

// naive image grab from <img> or media:content
function extractImageFromItemXml(xml: string){
  const m1 = xml.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (m1) return m1[1];
  const m2 = xml.match(/<media:content[^>]+url=["']([^"']+)["']/i);
  if (m2) return m2[1];
  const m3 = xml.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
  if (m3) return m3[1];
  return undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const country = (req.query.country as string) || 'All Caribbean';
  const feeds = FEEDS.filter(f => country === 'All Caribbean' ? true : f.country === country);

  const out: Item[] = [];

  const results = await Promise.allSettled(feeds.map(async f => {
    const xml = await fetchXML(f.url);

    // Split crude per item
    const items = xml.split(/<item[\s>]/i).slice(1).map(it => '<item ' + it);
    for (const raw of items){
      const title = decodeHTMLEntities(textBetween(raw, '<title>', '</title>').replace(/<!\[CDATA\[|\]\]>/g,''));
      const link  = decodeHTMLEntities(textBetween(raw, '<link>', '</link>').replace(/<!\[CDATA\[|\]\]>/g,''));
      let pub     = textBetween(raw, '<pubDate>', '</pubDate>');
      if (!pub) pub = textBetween(raw, '<updated>', '</updated>');

      if (!title || !link) continue;

      const id = b64(link);
      const image = extractImageFromItemXml(raw);
      const summary = decodeHTMLEntities(textBetween(raw, '<description>', '</description>').replace(/<!\[CDATA\[|\]\]>/g,''));

      out.push({ id, title, url: link, source: f.name, country: f.country, published: pub, image, summary });
    }
  }));

  // de-dupe by URL
  const seen = new Set<string>();
  const dedup = out.filter(i => {
    if (seen.has(i.url)) return false;
    seen.add(i.url); return true;
  });

  // Sort newest first if pubDate present
  dedup.sort((a,b)=> (new Date(b.published || 0).getTime()) - (new Date(a.published || 0).getTime()));

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=300');
  res.status(200).json({ ok:true, country, items: dedup.slice(0, 120) });
}

export const config = { runtime: 'edge' };
