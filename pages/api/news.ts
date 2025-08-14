import type { NextApiRequest, NextApiResponse } from 'next';

export const config = { api: { externalResolver: true } };

type Item = { title: string; link: string; published: number; image?: string; source?: string };
type Feed = { source: string; url: string; _items?: Item[] };

const FEEDS: Feed[] = [
  { source: 'Loop News Caribbean', url: 'https://www.loopnews.com/feeds/rss/caribbean' },
  { source: 'Nation News (Barbados)', url: 'https://www.nationnews.com/feed/' },
  { source: 'Jamaica Gleaner', url: 'https://jamaica-gleaner.com/rss/news' },
  { source: 'Stabroek News (Guyana)', url: 'https://www.stabroeknews.com/feed/' },
  { source: 'Antigua News', url: 'https://antigua.news/feed/' },
  { source: 'Barbados Today', url: 'https://barbadostoday.bb/feed/' },
];

async function fetchText(url: string, timeoutMs = 11000){
  const ctrl = new AbortController();
  const t = setTimeout(()=>ctrl.abort(), timeoutMs);
  try{
    const res = await fetch(url, {
      signal: ctrl.signal,
      cache: 'no-store',
      redirect: 'follow',
      headers: {
        'user-agent': 'CaribePulse/1.0 (+https://caribepulse.netlify.app)',
        'accept': 'application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, text/html;q=0.7, */*;q=0.5'
      }
    });
    if (!res.ok) throw new Error('Bad status ' + res.status);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

function pick(tag: string, xml: string){
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\s\S]*?)<\/${tag}>`, 'i'));
  return m ? m[1].trim() : '';
}
function pickCdata(tag: string, xml: string){
  const m = xml.match(new RegExp(`<${tag}[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/${tag}>`, 'i'));
  return m ? m[1].trim() : '';
}
function pickImg(xmlItem: string): string | null {
  const u =
    xmlItem.match(/<media:content[^>]*url="(.*?)"/i)?.[1] ||
    xmlItem.match(/<media:thumbnail[^>]*url="(.*?)"/i)?.[1] ||
    xmlItem.match(/<enclosure[^>]*url="(.*?)"/i)?.[1] ||
    null;
  return u ? u.replace(/&amp;/g,'&') : null;
}

async function fetchOg(link: string){
  try{
    const html = await fetchText(link, 7000);
    const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["'](.*?)["']/i)?.[1] ||
               html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["'](.*?)["']/i)?.[1] ||
               '';
    return og ? og.replace(/&amp;/g,'&') : '';
  }catch{ return ''; }
}

async function parseFeed(xml: string){
  const items: Item[] = [];
  const parts = xml.split(/<item[\s>]/i).slice(1);
  for (const part of parts){
    const title = pickCdata('title', part) || pick('title', part);
    const link  = pick('link', part) || pick('guid', part);
    const pub   = pick('pubDate', part);
    const published = pub ? Date.parse(pub) : Date.now();
    let image = pickImg(part) || '';
    if (!image && link) image = await fetchOg(link);
    if (title && link) items.push({ title, link, published, image });
  }
  return items;
}

function keywordsForIsland(slug: string){
  const table: Record<string,string[]> = {
    'saint-kitts': ['St. Kitts','Saint Kitts','Basseterre','SKN','Nevis'],
    'nevis': ['Nevis','Charlestown','St. Kitts'],
    'barbados': ['Barbados','Bridgetown','Bajan'],
    'antigua': ['Antigua','St. John’s','St Johns','Antigua & Barbuda'],
    'barbuda': ['Barbuda','Codrington','Antigua & Barbuda'],
    'dominica': ['Dominica','Roseau','Dominican (Dominica)'],
    'saint-lucia': ['Saint Lucia','St. Lucia','Castries'],
    'trinidad': ['Trinidad','Port of Spain','Trinidad & Tobago'],
    'tobago': ['Tobago','Scarborough','Trinidad & Tobago'],
    'saint-vincent': ['St. Vincent','Saint Vincent','Kingstown','SVG'],
    'bequia': ['Bequia','Port Elizabeth','SVG'],
    'grenada': ['Grenada','St. George’s'],
    'jamaica': ['Jamaica','Kingston','Montego Bay'],
    'guyana': ['Guyana','Georgetown'],
    'guadeloupe': ['Guadeloupe','Basse-Terre','Pointe-à-Pitre'],
    'martinique': ['Martinique','Fort-de-France'],
    'curacao': ['Curaçao','Curacao','Willemstad'],
    'aruba': ['Aruba','Oranjestad'],
    'bvi-tortola': ['Tortola','BVI','Road Town'],
    'usvi-st-thomas': ['St. Thomas','USVI','Charlotte Amalie'],
    'usvi-st-croix': ['St. Croix','USVI','Christiansted'],
    'usvi-st-john': ['St. John','USVI'],
    'sint-maarten': ['Sint Maarten','St. Maarten','Philipsburg'],
    'saint-martin': ['Saint Martin','St. Martin','Marigot'],
    'puerto-rico': ['Puerto Rico','San Juan'],
  };
  return table[slug] || [slug.replace(/-/g,' ')];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const qParam = (req.query.q as string | undefined)?.toLowerCase().trim();
  const island = (req.query.island as string | undefined)?.toLowerCase().trim();
  const debug = 'debug' in req.query;
  try{
    const results: Array<{ ok: boolean; source: string; count?: number; error?: string }> = [];
    for (const f of FEEDS){
      try{
        const xml = await fetchText(f.url);
        const items = await parseFeed(xml);
        const withSource = items.map(i => ({ ...i, source: f.source }));
        results.push({ ok:true, source:f.source, count: withSource.length });
        (f as any)._items = withSource;
      }catch(e:any){
        results.push({ ok:false, source:f.source, error: e?.message || 'failed' });
      }
    }
    if (debug) return res.status(200).json({ ok:true, debug: results });

    let merged: Item[] = [];
    for (const f of FEEDS){
      if ((f as any)._items) merged = merged.concat((f as any)._items);
    }

    // Apply island keyword filter if island is provided
    if (island){
      const kws = keywordsForIsland(island).map(s => s.toLowerCase());
      merged = merged.filter(it => {
        const title = (it.title || '').toLowerCase();
        return kws.some(k => title.includes(k));
      });
    }

    // Apply explicit q filter second (if provided)
    if (qParam){
      const ql = qParam.toLowerCase();
      merged = merged.filter(it => (it.title || '').toLowerCase().includes(ql));
    }

    // Dedup + sort
    const uniq = new Map<string, Item>();
    for (const it of merged) if (!uniq.has(it.link)) uniq.set(it.link, it);
    const items = Array.from(uniq.values()).sort((a,b)=> b.published - a.published).slice(0, 24);
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=600');
    return res.status(200).json({ ok:true, items });
  }catch(e:any){
    return res.status(200).json({ ok:false, items:[], error: e?.message || 'failed' });
  }
}
