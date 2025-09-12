import type { NextApiRequest, NextApiResponse } from 'next';

type Item = { title: string; link: string; source?: string; image?: string };

// Regional defaults
const REGIONAL_FEEDS: { title:string; url:string; source:string }[] = [
  { title: 'Loop Caribbean', url: 'https://www.loopnews.com/rss.xml', source:'Loop Caribbean' },
  { title: 'Caribbean National Weekly', url: 'https://www.caribbeannationalweekly.com/feed/', source:'CNW' },
];

// Curated by country
const FEEDS_BY_COUNTRY: Record<string, { title:string; url:string; source:string }[]> = {
  'Jamaica': [
    { title: 'Gleaner', url: 'https://jamaica-gleaner.com/feed', source: 'Gleaner' },
    { title: 'Observer', url: 'https://www.jamaicaobserver.com/feed/', source: 'Observer' }
  ],
  'Trinidad and Tobago': [
    { title: 'Guardian TT', url: 'https://www.guardian.co.tt/rss', source: 'Guardian TT' },
  ],
  'Barbados': [
    { title: 'NationNews', url: 'https://www.nationnews.com/feed/', source: 'NationNews' },
    { title: 'Barbados Today', url: 'https://barbadostoday.bb/feed/', source: 'Barbados Today' },
  ],
  'Guyana': [
    { title: 'Stabroek', url: 'https://www.stabroeknews.com/feed/', source: 'Stabroek' },
    { title: 'Demerara Waves', url: 'https://demerarawaves.com/feed/', source: 'Demerara Waves' },
  ],
  'St. Kitts and Nevis': [
    { title: 'WINN FM', url: 'https://www.winnmediaskn.com/feed/', source: 'WINN FM' },
    { title: 'SKN News', url: 'https://sknnews.com/feed/', source: 'SKN News' }
  ],
  'Bahamas': [
    { title: 'Nassau Guardian', url: 'https://thenassauguardian.com/feed/', source: 'Nassau Guardian' },
  ],
  'Haiti': [
    { title: 'HaitiLibre', url: 'https://www.haitilibre.com/en/rss.xml', source: 'HaitiLibre' }
  ],
  'Dominican Republic': [
    { title: 'Diario Libre', url: 'https://www.diariolibre.com/rss/actualidad.xml', source: 'Diario Libre' }
  ],
  'Saint Lucia': [
    { title: 'Loop St Lucia', url: 'https://stlucia.loopnews.com/rss', source:'Loop St Lucia' }
  ],
};

function pickImage(xmlChunk: string): string | undefined {
  const get = (re: RegExp) => {
    const m = xmlChunk.match(re);
    return m?.[1]?.trim();
  };
  // media:content url=""
  let url = get(/<media:content[^>]*url=["']([^"']+)["'][^>]*>/i);
  if (url) return url;
  // media:thumbnail
  url = get(/<media:thumbnail[^>]*url=["']([^"']+)["'][^>]*>/i);
  if (url) return url;
  // enclosure url=""
  url = get(/<enclosure[^>]*url=["']([^"']+)["'][^>]*>/i);
  if (url) return url;
  // <img src="..."> in description/content:encoded
  url = get(/<img[^>]*src=["']([^"']+)["']/i);
  return url || undefined;
}

function text(tag: string, xmlChunk: string) {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = xmlChunk.match(re);
  if (!m) return undefined;
  return m[1].replace(/<!\\[CDATA\\[|\\]\\]>/g,'').trim();
}

function parseRSS(xml: string): Item[] {
  const items: Item[] = [];
  const parts = xml.split(/<item[\\s\\S]*?>/i);
  for (let i = 1; i < parts.length; i++) {
    const seg = parts[i];
    const title = text('title', seg);
    const link = text('link', seg);
    if (!title || !link) continue;
    const image = pickImage(seg);
    items.push({ title, link, image });
  }
  return items;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const country = (req.query.country as string) || '';
  const feeds = country && FEEDS_BY_COUNTRY[country] ? FEEDS_BY_COUNTRY[country] : REGIONAL_FEEDS;

  try{
    const results: Item[] = [];
    const resp = await Promise.allSettled(feeds.map(async f => {
      const r = await fetch(f.url, { headers: { 'user-agent':'MagnetideBot/1.0' } });
      const xml = await r.text();
      const items = parseRSS(xml).slice(0, 12).map(i => ({ ...i, source: f.source }));
      return items;
    }));
    for (const r of resp){
      if (r.status === 'fulfilled') results.push(...r.value);
    }
    const seen = new Set<string>();
    const dedup = results.filter(i => (seen.has(i.title) ? false : (seen.add(i.title), true))).slice(0, 24);
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=600');
    res.status(200).json({ ok:true, country: country || 'REGION', items: dedup });
  }catch(e:any){
    res.status(200).json({ ok:false, country: country || 'REGION', items:[], error: e?.message || 'failed' });
  }
}
