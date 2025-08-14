'use client'
import { useEffect, useMemo, useState } from 'react'
import { ISLANDS, type Island } from '@/lib/islands'
import Spark from '@/app/components/Spark'
type Hourly = { time:string[]; temperature_2m:number[]; wind_speed_10m:number[]; precipitation:number[]; cloudcover:number[]; uv_index:number[] }
type Current = { temperature_2m:number; wind_speed_10m:number; relative_humidity_2m:number }
type Daily = { time:string[]; temperature_2m_max:number[]; temperature_2m_min:number[]; sunrise:string[]; sunset:string[] }
type WeatherResp = { hourly: Hourly; current: Current; daily: Daily }
type NewsItem = { title: string; link: string; pubDate?: string; source?: string; image?: string }
export default function Home(){
  const [selected,setSelected]=useState<Island>(ISLANDS.find(i=>i.code==='KN')||ISLANDS[0])
  const [wx,setWx]=useState<WeatherResp|null>(null)
  const [news,setNews]=useState<NewsItem[]>([])
  useEffect(()=>{
    const u=new URL('https://api.open-meteo.com/v1/forecast'); u.searchParams.set('latitude', String(selected.lat)); u.searchParams.set('longitude', String(selected.lon))
    u.searchParams.set('hourly','temperature_2m,wind_speed_10m,precipitation,cloudcover,uv_index'); u.searchParams.set('current','temperature_2m,wind_speed_10m,relative_humidity_2m')
    u.searchParams.set('daily','temperature_2m_max,temperature_2m_min,sunrise,sunset'); u.searchParams.set('timezone','auto')
    fetch(u.toString()).then(r=>r.json()).then(setWx).catch(console.error)
    fetch(`/api/news?island=${encodeURIComponent(selected.name)}`).then(r=>r.json()).then(d=>setNews(d.items||[])).catch(()=>setNews([]))
  },[selected])
  const next12 = useMemo(()=>{
    if(!wx?.hourly?.time?.length) return {t:[],temp:[],wind:[],rain:[]}; const now=Date.now(); const idx=wx.hourly.time.findIndex(t=>new Date(t).getTime()>=now); const start=idx==-1?0:idx
    const take=(arr:number[])=>arr.slice(start,start+12); return { t:wx.hourly.time.slice(start,start+12), temp:take(wx.hourly.temperature_2m), wind:take(wx.hourly.wind_speed_10m), rain:take(wx.hourly.precipitation) }
  },[wx])
  return (<main>
    <section className="container" style={{padding:'2rem 0 3rem'}}>
      <div className="grid" style={{gap:'1.5rem', gridTemplateColumns:'1fr',  }}>
        <div>
          <h1 style={{fontSize:'2rem',fontWeight:700,lineHeight:1.15}}>Caribbean News & Weather</h1>
          <p style={{color:'#a3a3a3', marginTop:12}}>Tap an island to update the map and weather below. Open its detail page for radar & alerts.</p>
          <div style={{marginTop:16, display:'grid', gap:8, gridTemplateColumns:'repeat(2,1fr)'}}>
            {ISLANDS.map(i=>(
              <button key={i.code} onClick={()=>setSelected(i)} className={`rounded-xl border px-3 py-2 text-left ${selected.code===i.code?'bg-brand-600/20':''}`} style={{borderColor:'#262626', background:'#111'}}>
                <div style={{fontWeight:600}}>{i.name}</div>
              </button>
            ))}
          </div>
          <a className="underline" style={{fontSize:12,display:'inline-block',marginTop:8}} href={`/island/${selected.code}`}>Open {selected.name} page →</a>
        </div>
        <div className="card" style={{padding:16}}>
          <div className="grid" style={{gridTemplateColumns:'repeat(3,1fr)', gap:12, textAlign:'center'}}>
            <Stat label="Now" value={wx?.current?.temperature_2m!=null?`${Math.round(wx.current.temperature_2m)}°C`:'—'}/>
            <Stat label="Wind" value={wx?.current?.wind_speed_10m!=null?`${Math.round(wx.current.wind_speed_10m)} km/h`:'—'}/>
            <Stat label="Humidity" value={wx?.current?.relative_humidity_2m!=null?`${Math.round(wx.current.relative_humidity_2m)}%`:'—'}/>
          </div>
          <div className="grid" style={{marginTop:16, display:'grid', gap:16, gridTemplateColumns:'1fr'}}> 
            <div><div style={{fontSize:12,color:'#a3a3a3',marginBottom:4}}>Next 12h Temp</div><div style={{color:'#d4d4d4'}}><Spark values={next12.temp}/></div></div>
            <div><div style={{fontSize:12,color:'#a3a3a3',marginBottom:4}}>Next 12h Wind</div><div style={{color:'#d4d4d4'}}><Spark values={next12.wind}/></div></div>
            <div><div style={{fontSize:12,color:'#a3a3a3',marginBottom:4}}>Next 12h Rain</div><div style={{color:'#d4d4d4'}}><Spark values={next12.rain}/></div></div>
          </div>
          <div className="grid" style={{marginTop:12, display:'grid', gap:12, gridTemplateColumns:'1fr 1fr', fontSize:14, color:'#d4d4d4'}}>
            <div>Today max/min: <b>{wx?.daily?.temperature_2m_max?.length? Math.round(wx.daily.temperature_2m_max[0])+'°C' : '—'}</b> / <b>{wx?.daily?.temperature_2m_min?.length? Math.round(wx.daily.temperature_2m_min[0])+'°C' : '—'}</b></div>
            <div>Sunrise/Sunset: <b>{wx?.daily?.sunrise?.[0]? new Date(wx.daily.sunrise[0]).toLocaleTimeString(): '—'}</b> / <b>{wx?.daily?.sunset?.[0]? new Date(wx.daily.sunset[0]).toLocaleTimeString(): '—'}</b></div>
          </div>
        </div>
      </div>
    </section>
    <section className="container" style={{paddingBottom:16}}>
      <div className="card" style={{overflow:'hidden'}}>
        <div style={{padding:12, fontSize:14, color:'#d4d4d4', borderBottom:'1px solid #262626', display:'flex', justifyContent:'space-between'}}>
          <div>Interactive map — {selected.name}</div><div style={{fontSize:12,color:'#a3a3a3'}}>Wind + radar (windy.com)</div>
        </div>
        <div style={{aspectRatio:'4/3', width:'100%'}}>
          <iframe title="Windy map" style={{width:'100%',height:'100%'}}
            src={`https://embed.windy.com/embed2.html?lat=${selected.lat}&lon=${selected.lon}&zoom=7&level=surface&overlay=wind&menu=&marker=&calendar=&pressure=&type=map&location=coordinates`}></iframe>
        </div>
      </div>
    </section>
    <section id="news" className="container" style={{padding:'2rem 0'}}>
      <h2 style={{fontSize:'1.5rem',fontWeight:700}}>Latest Headlines — {selected.name}</h2>
      <div style={{display:'grid', gap:16, gridTemplateColumns:'1fr'}}>
        {news.length?news.map((n,i)=>(
          <a key={i} className="card" style={{padding:16, textDecoration:'none', color:'inherit'}} href={n.link} target="_blank" rel="noreferrer">
            <div style={{fontSize:14, color:'#a3a3a3'}}>{n.source||'Regional'}</div>
            <div style={{fontWeight:600, marginTop:4}}>{n.title}</div>
            {n.pubDate && <div style={{fontSize:12, color:'#737373', marginTop:8}}>{new Date(n.pubDate).toLocaleString()}</div>}
          </a>
        )):<div style={{color:'#a3a3a3'}}>No items right now.</div>}
      </div>
    </section>
  </main>)}
function Stat({label,value}:{label:string;value:string}){return(<div className="card" style={{padding:12,textAlign:'center'}}><div style={{fontSize:12,color:'#a3a3a3'}}>{label}</div><div style={{fontSize:'1.25rem',fontWeight:700,marginTop:4}}>{value}</div></div>)}
