import type { NextApiRequest, NextApiResponse } from 'next';

type Item = { title: string; link: string; source?: string };

// Minimal curated feeds. You can expand these later.
const REGIONAL_FEEDS: { title:string; url:string; source:string }[] = [
  { title: 'Loop Caribbean', url: 'https://www.loopnews.com/rss.xml', source:'Loop Caribbean' },
  { title: 'Caribbean National Weekly', url: 'https://www.caribbeannationalweekly.com/feed/', source:'CNW' },
];

const FEEDS_BY_COUNTRY: Record<string, { title:string; url:string; source:string }[]> = {
  'Jamaica': [
    { title: 'Gleaner', url: 'https://jamaica-gleaner.com/feed', source: 'Gleaner' },
    { title: 'Jamaica Observer', url: 'https://www.jamaicaobserver.com/feed/', source: 'Observer' }
  ],
  'Trinidad and Tobago': [
    { title: 'Guardian TT', url: 'https://www.guardian.co.tt/rss', source: 'Guardian TT' },
  ],
  'Barbados': [
    { title: 'NationNews', url: 'https://www.nationnews.com/feed/', source: 'NationNews' },
    { title: 'Barbados Today', url: 'https://barbadostoday.bb/feed/', source: 'Barbados Today' },
  ],
  'Guyana': [
    { title: 'Stabroek News', url: 'https://www.stabroeknews.com/feed/', source: 'Stabroek' },
    { title: 'Demerara Waves', url: 'https://demerarawaves.com/feed/', source: 'Demerara Waves' },
  ],
  'St. Kitts and Nevis': [
    { title: 'WINN FM', url: 'https://www.winnmediaskn.com/feed/', source: 'WINN FM' },
    { title: 'SKN News Source', url: 'https://sknnews.com/feed/', source: 'SKN News' }
  ],
  'Dominica': [
    { title: 'DA Vibes', url: 'https://www.avirtualdominica.com/feed/', source: 'A Virtual Dominica' }
  ],
  'Bahamas': [
    { title: 'The Nassau Guardian', url: 'https://thenassauguardian.com/feed/', source: 'Nassau Guardian' },
  ],
  'Haiti': [
    { title: 'HaitiLibre', url: 'https://www.haitilibre.com/en/rss.xml', source: 'HaitiLibre' }
  ],
  'Dominican Republic': [
    { title: 'Diario Libre', url: 'https://www.diariolibre.com/rss/actualidad.xml', source: 'Diario Libre' }
  ]
};

function parseRSS(xml: string): Item[] {
  const items: Item[] = [];
  const parts = xml.split(/<item[\s\S]*?>/i);
  for (let i=1;i<parts.length;i++){
    const segment = parts[i];
    const titleMatch = segment.match(/<title>([\s\S]*?)<\/title>/i);
    const linkMatch = segment.match(/<link>([\s\S]*?)<\/link>/i);
    if (titleMatch && linkMatch){
      const title = titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g,'').trim();
      const link = linkMatch[1].trim();
      items.push({ title, link });
    }
  }
  return items;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const country = (req.query.country as string) || '';
  const feeds = country && FEEDS_BY_COUNTRY[country] ? FEEDS_BY_COUNTRY[country] : REGIONAL_FEEDS;

  try{
    const results: Item[] = [];
    const resp = await Promise.allSettled(feeds.map(async f => {
      const r = await fetch(f.url, { headers: { 'user-agent':'CaribPulseBot/1.0' } });
      const xml = await r.text();
      const items = parseRSS(xml).slice(0, 12).map(i => ({ ...i, source: f.source }));
      return items;
    }));
    for (const r of resp){
      if (r.status === 'fulfilled') results.push(...r.value);
    }
    // de-dupe by title
    const seen = new Set<string>();
    const dedup = results.filter(i => (seen.has(i.title) ? false : (seen.add(i.title), true))).slice(0, 24);
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=600');
    res.status(200).json({ ok:true, country: country || 'REGION', items: dedup });
  }catch(e:any){
    res.status(200).json({ ok:false, country: country || 'REGION', items:[], error: e?.message || 'failed' });
  }
}