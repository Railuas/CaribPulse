import type { NextApiRequest, NextApiResponse } from 'next';

const FEEDS = [
  { source: 'Loop News Caribbean', url: 'https://www.loopnews.com/feeds/rss/caribbean' },
  { source: 'Stabroek News',      url: 'https://www.stabroeknews.com/feed/' },
  { source: 'Nation News',        url: 'https://www.nationnews.com/feed/' },
  { source: 'Jamaica Gleaner',    url: 'https://jamaica-gleaner.com/rss/news' },
];

async function fetchText(url: string, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'user-agent': 'CaribePulse/1.0 (+https://caribepulse.netlify.app)' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Bad status ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

function pickImage(xmlItem: string): string | null {
  const url =
    xmlItem.match(/<media:content[^>]*url="(.*?)"/i)?.[1] ||
    xmlItem.match(/<media:thumbnail[^>]*url="(.*?)"/i)?.[1] ||
    xmlItem.match(/<enclosure[^>]*url="(.*?)"/i)?.[1] ||
    null;
  return url ? url.replace(/&amp;/g, '&') : null;
}

async function fetchOgImage(link: string, timeoutMs = 6000) {
  try {
    const html = await fetchText(link, timeoutMs);
    const og =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["'](.*?)["']/i)?.[1] ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["'](.*?)["']/i)?.[1] ||
      null;
    return og ? og.replace(/&amp;/g, '&') : null;
  } catch {
    return null;
  }
}

// super-light RSS parsing (title/link/pubDate + image)
async function parseItems(xml: string) {
  const out: { title: string; link: string; published: number; image?: string }[] = [];
  const parts = xml.split('<item>').slice(1);
  for (const p of parts) {
    const title =
      p.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/s)?.[1] ||
      p.match(/<title>(.*?)<\/title>/s)?.[1] ||
      '';
    const link =
      p.match(/<link>(.*?)<\/link>/s)?.[1] ||
      p.match(/<guid.*?>(.*?)<\/guid>/s)?.[1] ||
      '';
    const pub = p.match(/<pubDate>(.*?)<\/pubDate>/s)?.[1] || '';
    const published = pub ? Date.parse(pub) : Date.now();
    let image = pickImage(p) || undefined;
    if (!image && link) {
      image = await fetchOgImage(link) || undefined;
    }
    if (title && link) out.push({ title: title.trim(), link: link.trim(), published, image });
  }
  return out;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q as string | undefined)?.toLowerCase().trim();
  try {
    const results = await Promise.allSettled(
      FEEDS.map(async f => {
        const txt = await fetchText(f.url);
        const items = await parseItems(txt);
        return { source: f.source, items };
      }),
    );
    let merged = results.flatMap(r =>
      r.status === 'fulfilled'
        ? r.value.items.map(it => ({ ...it, source: (r as any).value.source }))
        : [],
    );
    if (q) merged = merged.filter(it => it.title.toLowerCase().includes(q));
    const uniq = new Map<string, any>();
    for (const it of merged) if (!uniq.has(it.link)) uniq.set(it.link, it);
    const items = Array.from(uniq.values())
      .sort((a, b) => b.published - a.published)
      .slice(0, 24);
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=600');
    res.status(200).json({ items });
  } catch (e) {
    res.status(200).json({ items: [] });
  }
}
