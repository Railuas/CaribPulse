'use client'
import { byCode } from '@/lib/islands'
import { useEffect, useState } from 'react'
type Daily = { time:string[]; temperature_2m_max:number[]; temperature_2m_min:number[]; precipitation_sum:number[] }
type Weather = { timezone:string; daily: Daily }
export default function IslandPage({ params }:{ params:{ code: string }}){
  const island = byCode(params.code) || byCode('KN')!
  const [data,setData]=useState<Weather|null>(null)
  useEffect(()=>{
    const url=new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', String(island.lat))
    url.searchParams.set('longitude', String(island.lon))
    url.searchParams.set('daily','temperature_2m_max,temperature_2m_min,precipitation_sum')
    url.searchParams.set('timezone','auto')
    fetch(url.toString()).then(r=>r.json()).then(setData)
  },[params.code])
  return (<main className="container py-10">
    <h1 className="text-3xl font-semibold">{island?.name}</h1>
    <div className="mt-6 grid lg:grid-cols-2 gap-6">
      <div className="card p-5">
        <h2 className="text-xl font-semibold">5‑day forecast</h2>
        {data? <table className="w-full text-sm mt-3"><thead className="text-neutral-400"><tr><th className="text-left py-2">Day</th><th className="text-left">High</th><th className="text-left">Low</th><th className="text-left">Rain (mm)</th></tr></thead><tbody>{data.daily.time.slice(0,5).map((t,i)=> (<tr key={i} className="border-t border-neutral-800"><td className="py-2">{new Date(t).toLocaleDateString()}</td><td>{Math.round(data.daily.temperature_2m_max[i])}°C</td><td>{Math.round(data.daily.temperature_2m_min[i])}°C</td><td>{data.daily.precipitation_sum[i].toFixed(1)}</td></tr>))}</tbody></table> : <div className="text-neutral-400">Loading…</div>}
      </div>
      <div className="card p-5">
        <h2 className="text-xl font-semibold">Live radar</h2>
        <div className="mt-3 aspect-video rounded-xl overflow-hidden">
          <iframe title="Windy radar" width="100%" height="100%" src={`https://embed.windy.com/embed2.html?lat=${island.lat}&lon=${island.lon}&zoom=6&level=surface&overlay=radar&menu=&message=&marker=true&calendar=&pressure=&type=map&location=coordinates&detail=&detailLat=${island.lat}&detailLon=${island.lon}&metricWind=km/h&metricTemp=%C2%B0C`} frameBorder="0"></iframe>
        </div>
      </div>
    </div>
    <div className="card p-5 mt-6">
      <h2 className="text-xl font-semibold">Alerts & resources</h2>
      <ul className="list-disc pl-5 text-sm text-neutral-300 mt-2 space-y-1">
        <li><a className="hover:underline" href="/hurricanes" target="_blank">Hurricane center & advisories</a></li>
        <li><a className="hover:underline" href={`https://www.google.com/search?q=weather+alerts+${encodeURIComponent(island.name)}`} target="_blank" rel="noreferrer">Search local alerts</a></li>
      </ul>
    </div>
  </main>)}
