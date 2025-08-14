import type { NextRequest } from 'next/server'
import { CARIB_AIRPORTS } from '@/lib/airports'

const RAPID_KEY = process.env.AERODATABOX_RAPIDAPI_KEY
const HOST = 'aerodatabox.p.rapidapi.com'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const airport = (url.searchParams.get('airport') || 'ALL').toUpperCase()
  const dir = (url.searchParams.get('dir') || 'arrivals') as 'arrivals' | 'departures'
  const windowHours = Math.min(12, Math.max(1, Number(url.searchParams.get('windowHours') || 4)))

  const list = airport === 'ALL' ? CARIB_AIRPORTS : CARIB_AIRPORTS.filter(a => a.iata === airport)
  if (!RAPID_KEY) { return Response.json({ ok:false, reason:'no_api_key', airports:list, results:[] }) }

  const headers = { 'X-RapidAPI-Key': RAPID_KEY!, 'X-RapidAPI-Host': HOST }
  const now = new Date()
  const end = new Date(now.getTime() + windowHours*3600*1000).toISOString()

  const results:any[] = []
  await Promise.all(list.map(async a => {
    try {
      const r = await fetch(`https://${HOST}/airports/iata/${a.iata}/${dir}?withLeg=true&direction=Both&withCancelled=true&withCodeshared=true&withCargo=true&withPrivate=true&withLocation=false&fromUtc=${now.toISOString()}&toUtc=${end}`, { headers })
      const data = await r.json()
      results.push({ airport:a, data })
    } catch {}
  }))
  return Response.json({ ok:true, airports:list, results })
}
