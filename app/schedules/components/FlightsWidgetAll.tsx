'use client'
import { useEffect, useState } from 'react'

export default function FlightsWidgetAll(){
  const [data,setData]=useState<any>(null)
  const [err,setErr]=useState<string>('')

  useEffect(()=>{
    fetch('/api/flights?airport=ALL&dir=arrivals&windowHours=4').then(r=>r.json()).then(d=>{
      if(!d.ok){ setErr(d.reason||'error'); return }
      setData(d)
    }).catch(()=>setErr('network'))
  },[])

  if(err==='no_api_key') return <div className="text-neutral-400 text-sm">Add <code>AERODATABOX_RAPIDAPI_KEY</code> in Netlify to enable live flights.</div>
  if(err) return <div className="text-neutral-400 text-sm">Could not load flights right now.</div>
  if(!data) return <div className="text-neutral-500 text-sm">Loading flights…</div>

  return <div className="grid gap-4 mt-4">
    {data.results.map((b:any,idx:number)=>(
      <div key={idx} className="rounded-xl border border-neutral-800 p-3 overflow-x-auto">
        <div className="font-medium">{b.airport.name} ({b.airport.iata}) — {b.airport.country}</div>
        <div className="text-xs text-neutral-500">Arrivals snapshot</div>
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
}
