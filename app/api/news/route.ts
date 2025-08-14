import Parser from 'rss-parser'
import type { NextRequest } from 'next/server'
const parser = new Parser()
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
  const items: { title: string; link: string; pubDate?: string; source?: string }[] = []
  await Promise.all(list.map(async (url) => {
    try {
      const feed = await parser.parseURL(url)
      for (const entry of feed.items.slice(0, 10)) {
        items.push({ title: entry.title || 'Untitled', link: entry.link || '#', pubDate: (entry as any).isoDate || (entry as any).pubDate, source: feed.title || new URL(url).hostname })
      }
    } catch (_) {}
  }))
  items.sort((a,b)=> new Date(b.pubDate||0).getTime() - new Date(a.pubDate||0).getTime())
  return Response.json({ island: island || 'region', items })
}
