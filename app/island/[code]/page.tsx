import { ISLANDS } from '@/lib/islands'
interface Props{ params:{ code:string } }
export const dynamic = 'force-dynamic'
export default async function IslandPage({params}:Props){
  const island = ISLANDS.find(i=>i.code.toLowerCase()===params.code.toLowerCase())
  if(!island) return <div className="container" style={{padding:'2rem 0'}}>Unknown island.</div>
  const dailyUrl = new URL('https://api.open-meteo.com/v1/forecast')
  dailyUrl.searchParams.set('latitude', String(island.lat)); dailyUrl.searchParams.set('longitude', String(island.lon))
  dailyUrl.searchParams.set('daily','temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max'); dailyUrl.searchParams.set('timezone','auto')
  const daily = await fetch(dailyUrl.toString(), { next: { revalidate: 1800 }}).then(r=>r.json())
  return (<main className="container" style={{padding:'2rem 0', display:'grid', gap:24}}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}><h1 style={{fontSize:'1.75rem',fontWeight:700}}>{island.name}</h1><a className="btn" href="/schedules">View schedules</a></div>
    <section className="card" style={{padding:16}}>
      <h2 style={{fontSize:'1.25rem',fontWeight:700, marginBottom:12}}>5‑day forecast</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12}}>
        {daily?.daily?.time?.slice(0,5).map((t:string,idx:number)=> (<div key={t} style={{border:'1px solid #262626', borderRadius:12, padding:12}}>
          <div style={{fontSize:14,color:'#a3a3a3'}}>{new Date(t).toLocaleDateString()}</div>
          <div style={{marginTop:8, fontSize:'1.5rem', fontWeight:700}}>{Math.round(daily.daily.temperature_2m_max[idx])}°C</div>
          <div style={{fontSize:12,color:'#a3a3a3'}}>min {Math.round(daily.daily.temperature_2m_min[idx])}°C</div>
          <div style={{fontSize:12,color:'#a3a3a3',marginTop:4}}>rain {daily.daily.precipitation_sum[idx].toFixed(1)} mm</div>
          <div style={{fontSize:12,color:'#a3a3a3'}}>wind {Math.round(daily.daily.wind_speed_10m_max[idx])} km/h</div>
        </div>))}
      </div>
    </section>
    <section className="card" style={{padding:16}}>
      <h2 style={{fontSize:'1.25rem',fontWeight:700, marginBottom:12}}>Interactive radar & storms</h2>
      <div style={{aspectRatio:'16/9', width:'100%', borderRadius:12, overflow:'hidden', border:'1px solid #262626'}}>
        <iframe title="Interactive radar" style={{width:'100%',height:'100%'}}
          src={`https://embed.windy.com/embed2.html?lat=${island.lat}&lon=${island.lon}&zoom=6&level=surface&overlay=radar&menu=&message=&marker=&calendar=&pressure=&type=map&location=coordinates&detail=&detailLat=${island.lat}&detailLon=${island.lon}`}></iframe>
      </div>
      <div style={{fontSize:12,color:'#737373',marginTop:6}}>Map by windy.com</div>
    </section>
    <section className="card" style={{padding:16}}>
      <h2 style={{fontSize:'1.25rem',fontWeight:700, marginBottom:8}}>Alerts & Hurricanes</h2>
      <ul style={{paddingLeft:18}}>
        <li><a className="underline" href="/hurricanes">Atlantic Tracker (interactive)</a></li>
        <li><a className="underline" target="_blank" href="https://www.nhc.noaa.gov/">NOAA NHC</a></li>
      </ul>
    </section>
  </main>)
}
