'use client'
import { useEffect, useState } from 'react'
import { ISLANDS, type Island } from '@/lib/islands'
type WeatherResp = { current: { temperature_2m: number; wind_speed_10m: number; relative_humidity_2m: number }, hourly:{time:string[];temperature_2m:number[];wind_speed_10m:number[];precipitation:number[]} }
type NewsItem = { title: string; link: string; pubDate?: string; source?: string }
export default function Home(){
  const [selected,setSelected]=useState<Island>(ISLANDS.find(i=>i.code==='KN')||ISLANDS[0])
  const [wx,setWx]=useState<WeatherResp|null>(null)
  const [news,setNews]=useState<NewsItem[]>([])
  useEffect(()=>{
    const url=new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', String(selected.lat))
    url.searchParams.set('longitude', String(selected.lon))
    url.searchParams.set('hourly','temperature_2m,wind_speed_10m,precipitation')
    url.searchParams.set('current','temperature_2m,wind_speed_10m,relative_humidity_2m')
    url.searchParams.set('timezone','auto')
    fetch(url.toString()).then(r=>r.json()).then(setWx).catch(console.error)
    fetch(`/api/news?island=${encodeURIComponent(selected.name)}`).then(r=>r.json()).then(d=>setNews(d.items||[])).catch(()=>setNews([]))
  },[selected])
  return (<main>
    <section className="container py-10 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight">Caribbean News & Weather</h1>
          <p className="text-neutral-400 mt-4 text-lg">Pick an island to see hourly weather and latest headlines.</p>
          <div className="mt-4 text-sm text-neutral-400">Default: St. Kitts & Nevis</div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ISLANDS.map(i=>(
              <button key={i.code} onClick={()=>setSelected(i)} className={`rounded-xl border px-3 py-2 text-left ${selected.code===i.code?'bg-brand-600/20 border-brand-600':'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'}`}>
                <div className="font-medium">{i.name}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Now" value={wx?.current?.temperature_2m!=null?`${Math.round(wx.current.temperature_2m)}°C`:'—'}/>
            <Stat label="Wind" value={wx?.current?.wind_speed_10m!=null?`${Math.round(wx.current.wind_speed_10m)} km/h`:'—'}/>
            <Stat label="Humidity" value={wx?.current?.relative_humidity_2m!=null?`${Math.round(wx.current.relative_humidity_2m)}%`:'—'}/>
          </div>
        </div>
      </div>
    </section>
    <section id="news" className="container py-12">
      <h2 className="text-2xl font-semibold">Latest Headlines — {selected.name}</h2>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {news.length?news.map((n,i)=>(
          <a key={i} className="card p-4 hover:bg-neutral-900 transition" href={n.link} target="_blank" rel="noreferrer">
            <div className="text-sm text-neutral-400">{n.source||'Regional'}</div>
            <div className="font-medium mt-1">{n.title}</div>
            {n.pubDate && <div className="text-xs text-neutral-500 mt-2">{new Date(n.pubDate).toLocaleString()}</div>}
          </a>
        )):<div className="text-neutral-400">No items right now.</div>}
      </div>
    </section>
  </main>)}
function Stat({label,value}:{label:string;value:string}){return(<div className="card p-4 text-center"><div className="text-xs text-neutral-400">{label}</div><div className="text-2xl font-semibold mt-1">{value}</div></div>)}
