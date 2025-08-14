export const dynamic = 'force-dynamic'
async function getJson(path:string){ try { return await fetch(path, { next: { revalidate: 300 }}).then(r=>r.json()) } catch { return {} } }
export default async function Schedules(){
  const flights = await fetch('/api/flights?airport=ALL&dir=arrivals&windowHours=4', { cache: 'no-store' }).then(r=>r.json()).catch(()=>({items:[]}))
  const ferries = await fetch('/api/ferries', { cache: 'no-store' }).then(r=>r.json()).catch(()=>({items:[]}))
  const movies  = await getJson('/schedules/movies.json')
  return (<main className="container py-8 space-y-8">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
      <h1 className="text-2xl md:text-3xl font-semibold">Schedules</h1>
      <div className="text-xs text-neutral-500">Flights via AeroDataBox · Ferries via operator sources/JSON · Movies via JSON</div>
    </div>
    <Section title="Live Flights (arrivals, next ~4h)" hint="Add AERODATABOX_RAPIDAPI_KEY in Netlify env">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-neutral-400">
            <tr className="text-left">
              <th className="py-2 pr-3">Flight</th><th className="py-2 pr-3">Airline</th><th className="py-2 pr-3">From</th><th className="py-2 pr-3">To</th><th className="py-2 pr-3">Sched</th><th className="py-2 pr-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {flights.items?.slice(0,200).map((f:any,i:number)=> (
              <tr key={i} className="border-t border-neutral-800/60">
                <td className="py-2 pr-3">{f.number}</td>
                <td className="py-2 pr-3">{f.airline||'—'}</td>
                <td className="py-2 pr-3">{f.dep?.iata||f.dep?.icao||'—'}</td>
                <td className="py-2 pr-3">{f.arr?.iata||f.arr?.icao||'—'}</td>
                <td className="py-2 pr-3">{f.arr?.time? new Date(f.arr.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '—'}</td>
                <td className="py-2 pr-3">{f.status||'—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
    <Section title="Ferry Schedules" hint="Live where possible; otherwise static JSON">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-neutral-400"><tr className="text-left"><th className="py-2 pr-3">Route</th><th className="py-2 pr-3">Operator</th><th className="py-2 pr-3">Depart</th><th className="py-2 pr-3">Arrive</th><th className="py-2 pr-3">Days</th></tr></thead>
          <tbody>
            {ferries.items?.map((r:any,i:number)=> (
              <tr key={i} className="border-t border-neutral-800/60">
                <td className="py-2 pr-3">{r.route}</td>
                <td className="py-2 pr-3">{r.operator}</td>
                <td className="py-2 pr-3">{r.depart}</td>
                <td className="py-2 pr-3">{r.arrive}</td>
                <td className="py-2 pr-3">{r.days||'—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
    <Section title="Movies" hint="Edit /public/schedules/movies.json">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {movies.rows?.map((m:any,i:number)=> (
          <a key={i} className="card p-4 hover:bg-neutral-900 transition" href={m.url||'#'} target="_blank" rel="noreferrer">
            <div className="text-sm text-neutral-400">{m.cinema}</div>
            <div className="font-medium mt-1">{m.title}</div>
            <div className="text-xs text-neutral-500 mt-1">{m.time} {m.rating? `· ${m.rating}`:''}</div>
          </a>
        )) || <div className="text-neutral-400">No movie data.</div>}
      </div>
    </Section>
  </main>)
}
function Section({title, hint, children}:{title:string;hint?:string;children:any}){
  return (<section className="card p-5"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">{title}</h2>{hint && <div className="text-xs text-neutral-500">{hint}</div>}</div>{children}</section>)
}
