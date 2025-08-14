'use client'

import { useEffect, useMemo, useState } from 'react'
import { ISLANDS, type Island } from '@/lib/islands'

type WeatherPoint = { time: string; temperature_2m: number; wind_speed_10m: number; precipitation: number };

type WeatherResp = {
  latitude: number
  longitude: number
  timezone: string
  hourly: { time: string[]; temperature_2m: number[]; wind_speed_10m: number[]; precipitation: number[] }
  current: { temperature_2m: number; wind_speed_10m: number; relative_humidity_2m: number }
}

type NewsItem = { title: string; link: string; pubDate?: string; source?: string }

export default function Home() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Island | null>(null)
  const [wx, setWx] = useState<WeatherResp | null>(null)
  const [news, setNews] = useState<NewsItem[]>([])
  const filtered = useMemo(() => ISLANDS.filter(i => i.name.toLowerCase().includes(query.toLowerCase())), [query])

  useEffect(() => { if (!selected && ISLANDS.length) setSelected(ISLANDS.find(i=>i.code==='KN') || ISLANDS[0]) }, [])

  useEffect(() => {
    if (!selected) return
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', String(selected.lat))
    url.searchParams.set('longitude', String(selected.lon))
    url.searchParams.set('hourly', 'temperature_2m,wind_speed_10m,precipitation')
    url.searchParams.set('current', 'temperature_2m,wind_speed_10m,relative_humidity_2m')
    url.searchParams.set('timezone', 'auto')

    fetch(url.toString()).then(r=>r.json()).then(setWx).catch(console.error)

    fetch(`/api/news?island=${encodeURIComponent(selected.name)}`)
      .then(r=>r.json())
      .then(d=> setNews(d.items || []))
      .catch(()=> setNews([]))
  }, [selected])

  const currentTemp = wx?.current?.temperature_2m

  return (
    <main>
      {/* Hero */}
      <section className="container py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight">Caribbean News & Weather, in one clean dashboard.</h1>
            <p className="text-neutral-400 mt-4 text-lg">Browse any island for up‑to‑the‑hour weather and curated headlines across regional outlets.</p>
            <div className="mt-6 flex gap-3">
              <a href="#weather" className="btn">Check Weather</a>
              <a href="#news" className="btn bg-neutral-800 hover:bg-neutral-700">Read News</a>
            </div>
            <div className="mt-4 text-sm text-neutral-400">Default island: St. Kitts & Nevis</div>
          </div>
          <div className="card p-5">
            <IslandPicker query={query} setQuery={setQuery} onPick={setSelected} selected={selected}/>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Stat label="Now" value={currentTemp != null ? `${Math.round(currentTemp)}°C` : '—'} />
              <Stat label="Wind" value={wx?.current?.wind_speed_10m != null ? `${Math.round(wx.current.wind_speed_10m)} km/h` : '—'} />
              <Stat label="Humidity" value={wx?.current?.relative_humidity_2m != null ? `${Math.round(wx.current.relative_humidity_2m)}%` : '—'} />
            </div>
          </div>
        </div>
      </section>

      {/* Weather */}
      <section id="weather" className="container py-6">
        <h2 className="text-2xl font-semibold mb-4">Weather — {selected?.name}</h2>
        <div className="card p-5 overflow-x-auto">
          {wx ? <WeatherTable wx={wx}/> : <div className="text-neutral-400">Loading...</div>}
        </div>
      </section>

      {/* News */}
      <section id="news" className="container py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Latest Headlines — {selected?.name}</h2>
          <a className="badge" href={`/api/news?island=${encodeURIComponent(selected?.name || '')}`}>JSON feed</a>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {news.length ? news.map((n,i)=> (
            <a key={i} className="card p-4 hover:bg-neutral-900 transition" href={n.link} target="_blank" rel="noreferrer">
              <div className="text-sm text-neutral-400">{n.source || 'Regional'}</div>
              <div className="font-medium mt-1">{n.title}</div>
              {n.pubDate && <div className="text-xs text-neutral-500 mt-2">{new Date(n.pubDate).toLocaleString()}</div>}
            </a>
          )) : (
            <div className="text-neutral-400">No items right now.</div>
          )}
        </div>
      </section>

      {/* About */}
      <section id="about" className="container py-16">
        <div className="card p-6">
          <h3 className="text-xl font-semibold">About CaribPulse</h3>
          <p className="text-neutral-400 mt-2">Open-source starter. Weather from Open‑Meteo (no API key). News via curated RSS fetched server‑side to avoid CORS. Add or remove sources in <code>/app/api/news/route.ts</code>.</p>
        </div>
      </section>
    </main>
  )
}

function Stat({label, value}:{label:string; value:string}){
  return (
    <div className="card p-4 text-center">
      <div className="text-xs text-neutral-400">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  )
}

function IslandPicker({query,setQuery,onPick,selected}:{query:string; setQuery:(v:string)=>void; onPick:(i:Island)=>void; selected: Island | null}){
  return (
    <div>
      <label className="text-sm text-neutral-400">Choose an island</label>
      <input className="input mt-1" placeholder="Search islands…" value={query} onChange={e=>setQuery(e.target.value)} />
      <div className="mt-3 max-h-60 overflow-auto grid grid-cols-2 gap-2">
        {ISLANDS.map(i=> (
          <button key={i.code} onClick={()=>onPick(i)} className={`text-left rounded-xl border px-3 py-2 transition ${selected?.code===i.code? 'bg-brand-600/20 border-brand-600' : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'}`}>
            <div className="font-medium">{i.name}</div>
            <div className="text-xs text-neutral-400">{i.lat.toFixed(2)}, {i.lon.toFixed(2)}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function WeatherTable({wx}:{wx:WeatherResp}){
  const rows: WeatherPoint[] = (wx.hourly.time || []).slice(0, 24).map((t,idx)=> ({
    time: t,
    temperature_2m: wx.hourly.temperature_2m[idx],
    wind_speed_10m: wx.hourly.wind_speed_10m[idx],
    precipitation: wx.hourly.precipitation[idx]
  }))
  return (
    <table className="w-full text-sm">
      <thead className="text-neutral-400">
        <tr className="text-left">
          <th className="py-2 pr-2">Time</th>
          <th className="py-2 pr-2">Temp (°C)</th>
          <th className="py-2 pr-2">Wind (km/h)</th>
          <th className="py-2 pr-2">Rain (mm)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i)=> (
          <tr key={i} className="border-t border-neutral-800/60">
            <td className="py-2 pr-2">{new Date(r.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
            <td className="py-2 pr-2">{Math.round(r.temperature_2m)}</td>
            <td className="py-2 pr-2">{Math.round(r.wind_speed_10m)}</td>
            <td className="py-2 pr-2">{r.precipitation.toFixed(1)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
