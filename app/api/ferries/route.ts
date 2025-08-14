import type { NextRequest } from 'next/server'
type FerryRow = { route:string; operator:string; depart:string; arrive:string; days?:string; link?:string; note?:string; countryPair?:string }
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const q = (url.searchParams.get('q') || '').toLowerCase()
    const res = await fetch(new URL('/schedules/ferries.json', url.origin), { cache: 'no-cache' })
    const data = await res.json() as { rows: FerryRow[] }
    let rows = (data.rows||[])
    if(q){
      rows = rows.filter(r => r.route.toLowerCase().includes(q) || r.operator.toLowerCase().includes(q) || (r.countryPair||'').toLowerCase().includes(q))
    }
    rows.sort((a,b)=> a.route.localeCompare(b.route))
    return Response.json({ rows })
  } catch(e) {
    return Response.json({ rows: [] })
  }
}
