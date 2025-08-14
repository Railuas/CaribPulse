import { NextRequest } from 'next/server'
import { CARIBBEAN_AIRPORTS } from '@/lib/airports'

// Uses AeroDataBox via RapidAPI. Set env var AERODATABOX_RAPIDAPI_KEY on Netlify.
const HOST = 'https://aerodatabox.p.rapidapi.com'

type Flight = {
  number: string
  airline?: string
  status?: string
  dep?: { iata?: string; icao?: string; time?: string; terminal?: string; gate?: string }
  arr?: { iata?: string; icao?: string; time?: string; terminal?: string; gate?: string }
}

function headers(){
  const key = process.env.AERODATABOX_RAPIDAPI_KEY
  if(!key) throw new Error('Missing AERODATABOX_RAPIDAPI_KEY env var')
  return {
    'X-RapidAPI-Key': key as string,
    'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
  }
}

export async function GET(req: NextRequest){
  const { searchParams } = new URL(req.url)
  const iata = (searchParams.get('airport')||'').toUpperCase()
  const dir = (searchParams.get('dir')||'arrivals').toLowerCase() // arrivals | departures
  const windowHours = Math.min(12, parseInt(searchParams.get('windowHours')||'6'))
  const now = new Date()
  const start = new Date(now.getTime() - (dir==='arrivals'? windowHours: 0)*3600_000)
  const end   = new Date(now.getTime() + (dir==='departures'? windowHours: 0)*3600_000)
  const fmt = (d:Date)=> d.toISOString().slice(0,16) // YYYY-MM-DDTHH:MM

  const list = (iata==='ALL' || !iata)
    ? CARIBBEAN_AIRPORTS.map(a=>a)
    : CARIBBEAN_AIRPORTS.filter(a=>a.iata===iata)

  const results: Flight[] = []

  await Promise.all(list.map(async (ap) => {
    try {
      const url = `${HOST}/flights/airports/icao/${ap.icao}/${fmt(start)}/${fmt(end)}`
        + `?withAircraftImage=false&withLocation=true`
      const r = await fetch(url, { headers: headers(), cache: 'no-store' })
      if(!r.ok) return
      const data = await r.json() as any
      const items = (dir==='arrivals' ? data.arrivals : data.departures) || []
      for(const f of items){
        results.push({
          number: f.number,
          airline: f.airline?.name,
          status: f.status,
          dep: { iata: f.departure?.airport?.iata, icao: f.departure?.airport?.icao, time: f.departure?.scheduledTimeLocal, terminal: f.departure?.terminal, gate: f.departure?.gate },
          arr: { iata: f.arrival?.airport?.iata, icao: f.arrival?.airport?.icao, time: f.arrival?.scheduledTimeLocal, terminal: f.arrival?.terminal, gate: f.arrival?.gate }
        })
      }
    } catch(e) {
      // ignore per-airport failures to keep others loading
    }
  }))

  // sort by time
  results.sort((a,b)=> new Date((dir==='arrivals'?a.arr?.time:a.dep?.time)||0).getTime()
                    - new Date((dir==='arrivals'?b.arr?.time:b.dep?.time)||0).getTime())

  return Response.json({ dir, count: results.length, items: results })
}
