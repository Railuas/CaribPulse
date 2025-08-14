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

// super-light RSS parsing (title/link/pubDate)
function parseItems(xml: string) {
  const items: { title: string; link: string; published: number }[] = [];
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
    if (title && link) items.push({ title: title.trim(), link: link.trim(), published });
  }
  return items;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q as string | undefined)?.toLowerCase().trim();
  try {
    const results = await Promise.allSettled(
      FEEDS.map(f =>
        fetchText(f.url).then(txt => ({ source: f.source, items: parseItems(txt) })),
      ),
    );
    let merged = results.flatMap(r =>
      r.status === 'fulfilled'
        ? r.value.items.map(it => ({ ...it, source: (r as any).value.source }))
        : [],
    );
    if (q) {
      merged = merged.filter(it => it.title.toLowerCase().includes(q));
    }
    const uniq = new Map<string, { title: string; link: string; published: number; source: string }>();
    for (const it of merged) if (!uniq.has(it.link)) uniq.set(it.link, it);
    const items = Array.from(uniq.values())
      .sort((a, b) => b.published - a.published)
      .slice(0, 20);
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');
    res.status(200).json({ items });
  } catch {
    res.status(200).json({ items: [] });
  }
}
