'use client'
import { useEffect, useMemo, useState } from 'react'
import { ISLANDS, type Island } from '@/lib/islands'

type WeatherResp = { current: { temperature_2m: number; wind_speed_10m: number; relative_humidity_2m: number }, hourly:{time:string[];temperature_2m:number[];wind_speed_10m:number[];precipitation:number[]} }
type NewsItem = { title: string; link: string; pubDate?: string; source?: string }
type Preview = { image?: string, title?: string, desc?: string }

export default function Home(){
  const [selected,setSelected]=useState<Island>(ISLANDS.find(i=>i.code==='KN')||ISLANDS[0])
  const [wx,setWx]=useState<WeatherResp|null>(null)
  const [news,setNews]=useState<NewsItem[]>([])
  const [previews,setPreviews]=useState<Record<string, Preview>>({})
  const [query,setQuery]=useState('')
  const filtered = useMemo(()=> ISLANDS.filter(i=>i.name.toLowerCase().includes(query.toLowerCase())),[query])

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

  useEffect(()=>{
    (async()=>{
      const first = news.slice(0,8)
      const entries = await Promise.all(first.map(async n=>{
        const p = await fetch(`/api/preview?url=${encodeURIComponent(n.link)}`).then(r=>r.ok?r.json():null).catch(()=>null)
        return [n.link, p] as const
      }))
      const map:Record<string,Preview> = {}
      for(const [k,v] of entries){ if(v) map[k]=v }
      setPreviews(map)
    })()
  },[news])

  const digest = useMemo(()=>{
    const bySource: Record<string, number> = {}
    news.forEach(n=> { if(n.source) bySource[n.source]=(bySource[n.source]||0)+1 })
    return Object.entries(bySource).sort((a,b)=>b[1]-a[1]).slice(0,5)
  },[news])

  const addBookmark = (item: NewsItem)=>{
    const raw = localStorage.getItem('bookmarks')||'[]'
    const list: NewsItem[] = JSON.parse(raw)
    if(!list.find(x=>x.link===item.link)){ list.push(item); localStorage.setItem('bookmarks', JSON.stringify(list)) }
  }

  return (<main>
    <section className="container py-10 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight">Caribbean News & Weather</h1>
          <p className="text-neutral-400 mt-4 text-lg">Pick an island to see hourly weather, 5‑day forecast, radar, and headlines.</p>
          <div className="mt-4 text-sm text-neutral-400">Default: St. Kitts & Nevis</div>
          <div className="mt-4">
            <input className="input" placeholder="Search islands…" value={query} onChange={e=>setQuery(e.target.value)}/>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-auto">
            {filtered.map(i=>(
              <a key={i.code} href={`/island/${i.code}`} onClick={()=>setSelected(i)} className={`rounded-xl border px-3 py-2 text-left ${selected.code===i.code?'bg-brand-600/20 border-brand-600':'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'}`}>
                <div className="font-medium">{i.name}</div>
              </a>
            ))}
          </div>
          <div className="mt-4"><a className="btn" href="/hurricanes">Hurricane Tracker</a></div>
        </div>
        <div className="card p-5">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Now" value={wx?.current?.temperature_2m!=null?`${Math.round(wx.current.temperature_2m)}°C`:'—'}/>
            <Stat label="Wind" value={wx?.current?.wind_speed_10m!=null?`${Math.round(wx.current.wind_speed_10m)} km/h`:'—'}/>
            <Stat label="Humidity" value={wx?.current?.relative_humidity_2m!=null?`${Math.round(wx.current.relative_humidity_2m)}%`:'—'}/>
          </div>
          <div className="text-sm text-neutral-400 mt-3">See more on the island page (5‑day forecast, radar, alerts).</div>
        </div>
      </div>
    </section>

    <section id="news" className="container py-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Top stories — {selected.name}</h2>
        <div className="text-sm text-neutral-400">Digest: {digest.map(([s,c])=>`${s} (${c})`).join(' · ')}</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {news.slice(0,12).map((n,i)=>{
          const p = previews[n.link]
          const img = p?.image || `https://www.google.com/s2/favicons?domain=${new URL(n.link).hostname}&sz=128`
          return (
            <div key={i} className="card p-0 overflow-hidden">
              <a href={n.link} target="_blank" rel="noreferrer">
                <div className="aspect-video bg-neutral-800"><img src={img} alt="" className="w-full h-full object-cover"/></div>
              </a>
              <div className="p-4">
                <div className="text-sm text-neutral-400">{n.source||'Regional'}</div>
                <a className="font-medium mt-1 block hover:underline" href={n.link} target="_blank" rel="noreferrer">{n.title}</a>
                <div className="mt-3 flex gap-2">
                  <button className="badge hover:bg-neutral-800" onClick={()=>addBookmark(n)}>🔖 Bookmark</button>
                  <a className="badge hover:bg-neutral-800" href={`/api/news?island=${encodeURIComponent(selected.name)}`}>JSON</a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-6"><a className="btn" href={`/island/${selected.code}`}>Open {selected.name} page</a></div>
    </section>
  </main>)}
function Stat({label,value}:{label:string;value:string}){return(<div className="card p-4 text-center"><div className="text-xs text-neutral-400">{label}</div><div className="text-2xl font-semibold mt-1">{value}</div></div>)}
