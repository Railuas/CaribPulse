'use client'
import { useEffect, useState } from 'react'
type FlightsResp = { ok:boolean; reason?:string; airports:any[]; results:any[] }

export default function FlightsWidget(){
  const [data,setData]=useState<FlightsResp|null>(null)
  useEffect(()=>{ fetch('/api/flights?airport=ALL&dir=arrivals&windowHours=4').then(r=>r.json()).then(setData).catch(()=>setData({ok:false,reason:'fetch_error',airports:[],results:[]})) },[])
  if(!data) return <section className="card p-5"><div>Loading flights…</div></section>
  if(!data.ok) return (<section className="card p-5">
    <h2 className="text-xl font-semibold">Flight snapshots</h2>
    <div className="text-neutral-400 text-sm mt-2">Live flight data needs an API key. Add <code>AERODATABOX_RAPIDAPI_KEY</code> in Netlify → Environment. Until then, this widget stays quiet on production.</div>
  </section>)
  return (<section className="card p-4 md:p-5">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">Flight snapshots (next 4h)</h2>
    </div>
    <div className="grid gap-4 mt-4">
      {data.results.map((b:any,idx:number)=>(
        <div key={idx} className="rounded-xl border border-neutral-800 p-3 overflow-x-auto">
          <div className="font-medium">{b.airport.name} ({b.airport.iata}) — {b.airport.country}</div>
          <div className="text-xs text-neutral-500">Arrivals snapshot</div>
          <div className="mt-2 text-sm">
            {Array.isArray(b.data?.arrivals) ? b.data.arrivals.slice(0,10).map((it:any,i:number)=>(
              <div key={i} className="grid grid-cols-3 gap-2 border-t border-neutral-800/60 py-1">
                <div>{it.airline?.name || it.airline || '—'}</div>
                <div>{(it?.movement?.airport?.iata || it.departureAirport || '—')} → {b.airport.iata}</div>
                <div className="text-right">{it?.movement?.scheduledTimeLocal || it.scheduledTimeLocal || '—'}</div>
              </div>
            )) : <div className="text-neutral-500">No arrivals found.</div>}
          </div>
        </div>
      ))}
    </div>
  </section>)
}
