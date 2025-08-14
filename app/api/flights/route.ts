import type { NextRequest } from 'next/server'
import { CARIB_AIRPORTS } from '@/lib/airports'

const RAPID_KEY = process.env.AERODATABOX_RAPIDAPI_KEY
const HOST = 'aerodatabox.p.rapidapi.com'

async function fetchAirport(iata:string, dir:'arrivals'|'departures', fromIso:string, toIso:string, headers:Record<string,string>) {
  const url = `https://${HOST}/airports/iata/${iata}/${dir}?withLeg=true&direction=Both&withCancelled=true&withCodeshared=true&withCargo=true&withPrivate=true&withLocation=false&fromUtc=${fromIso}&toUtc=${toIso}`
  const resp = await fetch(url, { headers })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  return resp.json()
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const airport = (url.searchParams.get('airport') || 'ALL').toUpperCase()
  const dir = (url.searchParams.get('dir') || 'arrivals') as 'arrivals' | 'departures'
  const windowHours = Math.min(12, Math.max(1, Number(url.searchParams.get('windowHours') || 4)))
  const list = airport === 'ALL' ? CARIB_AIRPORTS : CARIB_AIRPORTS.filter(a => a.iata === airport)

  if (!RAPID_KEY) {
    return Response.json({ ok:false, reason:'no_api_key', airports:list, results:[] })
  }

  const headers = { 'X-RapidAPI-Key': RAPID_KEY!, 'X-RapidAPI-Host': HOST }
  const now = new Date()
  const end = new Date(now.getTime() + windowHours*3600*1000).toISOString()
  const fromIso = now.toISOString()

  // Chunk to reduce rate-limit spikes
  const BATCH = 6
  const results:any[] = []
  for (let i=0; i<list.length; i+=BATCH) {
    const slice = list.slice(i, i+BATCH)
    const chunk = await Promise.all(slice.map(async a => {
      try {
        const data = await fetchAirport(a.iata, dir, fromIso, end, headers)
        return { airport:a, data }
      } catch (e:any) {
        return { airport:a, error: e?.message || 'fetch_error' }
      }
    }))
    results.push(...chunk)
  }

  return Response.json({ ok:true, airports:list, results })
}
