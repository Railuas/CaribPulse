import Parser from 'rss-parser'
import type { NextRequest } from 'next/server'
const parser = new Parser({ customFields: { item: ['media:content','media:thumbnail','enclosure'] } as any })

async function findImage(url:string): Promise<string|undefined> {
  try {
    const r = await fetch(url, { next: { revalidate: 3600 }, headers: { 'user-agent': 'Mozilla/5.0 CaribePulse' } })
    const html = await r.text()
    const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image/i)
    if (m && m[1]) return m[1]
  } catch {}
  return undefined
}

const FEEDS: Record<string, string[]> = {
  region: [
    'https://news.google.com/rss/search?q=Caribbean&hl=en-GB&gl=GB&ceid=GB:en',
    'https://rss.nytimes.com/services/xml/rss/nyt/Caribbean.xml',
    'https://feeds.bbci.co.uk/news/world/latin_america/rss.xml'
  ],
  Barbados: ['https://barbadostoday.bb/feed/'],
  Jamaica: ['https://jamaica-gleaner.com/feed'],
  "Trinidad & Tobago": ['https://newsday.co.tt/feed/'],
  "St. Kitts & Nevis": ['https://www.thestkittsnevisobserver.com/feed/','https://zizonline.com/feed/'],
  Dominica: ['https://dominicanewsonline.com/feed/'],
  Guyana: ['https://www.stabroeknews.com/feed/'],
  Haiti: ['https://haitiantimes.com/feed/'],
  Cuba: ['https://www.plenglish.com/feed/'],
  Puerto: ['https://news.google.com/rss/search?q=Puerto+Rico&hl=en-US&gl=US&ceid=US:en']
}

export async function GET(req: NextRequest) {
  const island = decodeURIComponent((req.nextUrl.searchParams.get('island')||'').trim())
  const keys = Object.keys(FEEDS)
  const matches = keys.filter(k => island.toLowerCase().includes(k.toLowerCase()))
  const list = matches.length ? matches.flatMap(k=>FEEDS[k]) : FEEDS.region

  const items: { title: string; link: string; pubDate?: string; source?: string; image?: string }[] = []
  await Promise.all(list.map(async (url) => {
    try {
      const feed = await parser.parseURL(url)
      for (const entry of feed.items.slice(0, 8)) {
        const link = entry.link || '#'
        let image = (entry as any)?.enclosure?.url || (entry as any)?.['media:content']?.url || (entry as any)?.['media:thumbnail']?.url
        if (!image && link && link.startsWith('http')) {
          image = await findImage(link)
        }
        items.push({ title: entry.title || 'Untitled', link, pubDate: (entry as any).isoDate || (entry as any).pubDate, source: feed.title || new URL(url).hostname, image })
      }
    } catch (_) { }
  }))
  items.sort((a,b)=> new Date(b.pubDate||0).getTime() - new Date(a.pubDate||0).getTime())
  return Response.json({ island: island || 'region', items })
}
