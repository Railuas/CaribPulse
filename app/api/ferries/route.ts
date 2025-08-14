import { NextRequest } from 'next/server'
import { parse } from 'node-html-parser'

type FerryRow = { route: string; operator: string; depart: string; arrive: string; days?: string; url?: string }

async function fetchICS(url:string){
  const res = await fetch(url, { cache: 'no-store' })
  if(!res.ok) return []
  const text = await res.text()
  // Minimal ICS parse: look for DTSTART/DTEND and SUMMARY lines
  const events: FerryRow[] = []
  const blocks = text.split('BEGIN:VEVENT').slice(1)
  for(const b of blocks){
    const sum = /SUMMARY:(.*)/.exec(b)?.[1]?.trim()
    const dtstart = /DTSTART(?:;VALUE=DATE-TIME)?:([0-9TZ]+)/.exec(b)?.[1]
    const dtend = /DTEND(?:;VALUE=DATE-TIME)?:([0-9TZ]+)/.exec(b)?.[1]
    if(sum && dtstart){
      events.push({ route: sum, operator: 'ICS', depart: dtstart, arrive: dtend||'', days: '' })
    }
  }
  return events
}

async function fetchHTMLTable(url:string){
  const res = await fetch(url, { cache: 'no-store' })
  if(!res.ok) return []
  const html = await res.text()
  const root = parse(html)
  const rows = root.querySelectorAll('table tr')
  const out: FerryRow[] = []
  for(const tr of rows.slice(1)){
    const tds = tr.querySelectorAll('td').map(td=>td.text.trim())
    if(tds.length>=4){
      out.push({ route: tds[0], operator: tds[1], depart: tds[2], arrive: tds[3] })
    }
  }
  return out
}

export async function GET(req: NextRequest){
  // Source config lives in /public/schedules/ferries.json (deployed with the site).
  // You can point entries at an ICS or HTML page per operator.
  try{
    const base = new URL(req.url).origin
    const configRes = await fetch(base + '/schedules/ferries.json', { cache: 'no-cache' })
    const cfg = await configRes.json()
    const items: FerryRow[] = []
    for(const src of (cfg.sources||[])){
      if(src.type==='ics'){ items.push(...await fetchICS(src.url)) }
      if(src.type==='html'){ items.push(...await fetchHTMLTable(src.url)) }
      if(src.type==='static' && src.rows){ items.push(...src.rows) }
    }
    return Response.json({ items })
  }catch(e){
    return Response.json({ items: [] })
  }
}
