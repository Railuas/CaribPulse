export const dynamic = 'force-dynamic'
type FerryRow = { route:string; operator:string; depart:string; arrive:string; days?:string; link?:string; note?:string; countryPair?:string }
type FlightsResp = { ok:boolean; reason?:string; airports:any[]; results:any[] }
async function getFerries(){ const r=await fetch('/api/ferries',{cache:'no-store'}); return r.json() as Promise<{rows:FerryRow[]}> }
async function getFlights(){ const r=await fetch('/api/flights?airport=ALL&dir=arrivals&windowHours=4',{cache:'no-store'}); return r.json() as Promise<FlightsResp> }
export default async function Schedules(){
  const [{rows}, flights] = await Promise.all([getFerries(), getFlights()])
  return (<main className="container" style={{padding:'2rem 0', display:'grid', gap:24}}>
    <h1 style={{fontSize:'1.75rem',fontWeight:700}}>Schedules</h1>
    <section className="card" style={{padding:16}}>
      <h2 style={{fontSize:'1.25rem',fontWeight:700}}>Ferry schedules</h2>
      <div style={{marginTop:12}}>{rows.map((r,i)=>(<div key={i} style={{borderTop:'1px solid #262626', padding:'6px 0', display:'grid', gridTemplateColumns:'1.2fr .8fr .6fr .6fr .8fr', gap:8}}>
        <div>{r.route}</div><div>{r.operator}</div><div>{r.depart}</div><div>{r.arrive}</div><div>{r.days||'—'}</div></div>))}</div>
    </section>
    <section className="card" style={{padding:16}}>
      <h2 style={{fontSize:'1.25rem',fontWeight:700}}>Flight snapshots (next 4h)</h2>
      {!flights.ok ? (<div style={{color:'#a3a3a3',fontSize:14,marginTop:8}}>Add <code>AERODATABOX_RAPIDAPI_KEY</code> in Netlify to enable this.</div>) : (
        <div style={{display:'grid', gap:12, marginTop:12}}>{flights.results.map((b:any,idx:number)=>(
          <div key={idx} style={{border:'1px solid #262626', borderRadius:12, padding:12, overflow:'auto'}}>
            <div style={{fontWeight:600}}>{b.airport.name} ({b.airport.iata}) — {b.airport.country}</div>
            <div style={{fontSize:12,color:'#737373'}}>Arrivals snapshot</div>
          </div>))}</div>
      )}
    </section>
  </main>)}
