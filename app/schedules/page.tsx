export const dynamic = 'force-dynamic'

type FerryRow = { route:string; operator:string; depart:string; arrive:string; days?:string; link?:string; note?:string; countryPair?:string }
type FlightsResp = { ok:boolean; reason?:string; airports:any[]; results:any[] }

async function getFerries(q:string=''){ const r=await fetch(`/api/ferries${q?`?q=${encodeURIComponent(q)}`:''}`,{cache:'no-store'}); return r.json() as Promise<{rows:FerryRow[]}> }
async function getFlights(){ const r=await fetch('/api/flights?airport=ALL&dir=arrivals&windowHours=4',{cache:'no-store'}); return r.json() as Promise<FlightsResp> }

export default async function Schedules(){
  const [{rows}, flights] = await Promise.all([getFerries(), getFlights()])
  return (<main className="container py-8 space-y-8">
    <h1 className="text-2xl md:text-3xl font-semibold">Schedules</h1>

    <section className="card p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-xl font-semibold">Ferry schedules</h2>
        <form action="/schedules" method="GET" className="w-full md:w-auto">
          <input className="input" type="text" name="q" placeholder="Search island, route, operator…" defaultValue=""/>
        </form>
      </div>
      <div className="hidden md:block overflow-x-auto mt-4">
        <table className="w-full text-sm">
          <thead className="text-neutral-400">
            <tr className="text-left">
              <th className="py-2 pr-3">Route</th><th className="py-2 pr-3">Operator</th><th className="py-2 pr-3">Depart</th><th className="py-2 pr-3">Arrive</th><th className="py-2 pr-3">Days</th><th className="py-2 pr-3">Link</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(<tr key={i} className="border-t border-neutral-800/60">
              <td className="py-2 pr-3">{r.route}</td><td className="py-2 pr-3">{r.operator}</td><td className="py-2 pr-3">{r.depart}</td><td className="py-2 pr-3">{r.arrive}</td><td className="py-2 pr-3">{r.days||'—'}</td>
              <td className="py-2 pr-3">{r.link?<a className="underline" target="_blank" href={r.link}>Open</a>:'—'}</td>
            </tr>))}
          </tbody>
        </table>
      </div>
      <div className="grid md:hidden gap-3 mt-4">
        {rows.map((r,i)=>(<div key={i} className="rounded-xl border border-neutral-800 p-3">
          <div className="font-medium">{r.route}</div>
          <div className="text-xs text-neutral-400">{r.operator}</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-neutral-400">Depart: </span>{r.depart}</div>
            <div><span className="text-neutral-400">Arrive: </span>{r.arrive}</div>
            <div className="col-span-2"><span className="text-neutral-400">Days: </span>{r.days||'—'}</div>
          </div>
          {r.link && <a className="underline text-sm mt-2 inline-block" target="_blank" href={r.link}>Open operator page</a>}
          {r.note && <div className="text-xs text-neutral-500 mt-1">{r.note}</div>}
        </div>))}
      </div>
    </section>

    <section className="card p-4 md:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Flight snapshots (next 4h)</h2>
      </div>
      {(!flights.ok) ? (
        <div className="text-neutral-400 text-sm mt-2">Live flight data requires an API key. Add <code>AERODATABOX_RAPIDAPI_KEY</code> in Netlify → Environment. Until then, this section is hidden on production.</div>
      ) : (
        <div className="grid gap-4 mt-4">
          {flights.results.map((b:any,idx:number)=>(
            <div key={idx} className="rounded-xl border border-neutral-800 p-3 overflow-x-auto">
              <div className="font-medium">{b.airport.name} ({b.airport.iata}) — {b.airport.country}</div>
              <div className="text-xs text-neutral-500">Showing arrivals snapshot</div>
              <div className="mt-2 text-sm">
                {(b.data?.arrivals || b.data || []).slice(0,10).map((it:any,i:number)=>(
                  <div key={i} className="grid grid-cols-3 gap-2 border-t border-neutral-800/60 py-1">
                    <div>{it.airline?.name || it.airline || '—'}</div>
                    <div>{(it?.movement?.airport?.iata || it.departureAirport || '—')} → {b.airport.iata}</div>
                    <div className="text-right">{it?.movement?.scheduledTimeLocal || it.scheduledTimeLocal || '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  </main>)
}
