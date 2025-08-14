import Parser from 'rss-parser'
import feeds from '@/public/feeds.json'
import type { NextRequest } from 'next/server'
const parser = new Parser()
export async function GET(req: NextRequest) {
  const island = decodeURIComponent((req.nextUrl.searchParams.get('island')||'').trim())
  const keys = Object.keys(feeds as Record<string,string[]>)
  const matches = keys.filter(k => island.toLowerCase().includes(k.toLowerCase()))
  const list = (matches.length ? matches.flatMap(k=>(feeds as any)[k]) : (feeds as any).region) as string[]
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
