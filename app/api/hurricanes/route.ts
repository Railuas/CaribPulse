import Parser from 'rss-parser'
export const dynamic = 'force-dynamic'
const parser = new Parser()
const FEED = 'https://www.nhc.noaa.gov/gtwo.php?basin=atlc&fdays=2&format=rss'
export async function GET(){ try{ const feed=await parser.parseURL(FEED); const items=(feed.items||[]).map((it:any)=>{
  const link=it.link||''; const id=(link.match(/(AL\d{2}\d{4}|atl\d+)/i)?.[1]) || encodeURIComponent(it.title||'storm')
  const cone=(it.content||'').match(/https?:[^"]+cone[^"]+\.(png|gif)/i)?.[0] || null
  return ({ id, title: it.title, link, pubDate: (it as any).isoDate || it.pubDate, cone }) }); return Response.json({ items }) } catch(e){ return Response.json({ items: [] }) } }
