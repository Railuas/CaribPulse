export const dynamic = 'force-dynamic'
async function getData(){ const r = await fetch('/api/hurricanes',{ cache:'no-store' }); return r.json() as Promise<{items:{id:string,title:string,link:string,cone?:string|null,pubDate?:string}[]}> }
export default async function Hurricanes(){
  const { items } = await getData()
  return (<main className="container" style={{padding:'2rem 0', display:'grid', gap:24}}>
    <h1 style={{fontSize:'1.75rem',fontWeight:700}}>Atlantic Hurricane Tracker</h1>
    <section className="card" style={{padding:16}}>
      <h2 style={{fontSize:'1.25rem',fontWeight:700, marginBottom:12}}>Interactive basin map</h2>
      <div style={{aspectRatio:'16/9', width:'100%', borderRadius:12, overflow:'hidden', border:'1px solid #262626'}}>
        <iframe title="Atlantic storms" style={{width:'100%',height:'100%'}}
          src="https://embed.windy.com/embed2.html?lat=18&lon=-61&zoom=5&level=surface&overlay=wind&menu=&marker=&calendar=&pressure=&type=map&location=coordinates"></iframe>
      </div>
      <div style={{fontSize:12,color:'#737373',marginTop:6}}>Map by windy.com • For official advisories visit nhc.noaa.gov</div>
    </section>
    <section className="card" style={{padding:16}}>
      <h2 style={{fontSize:'1.25rem',fontWeight:700, marginBottom:12}}>Active systems & outlook (NHC)</h2>
      <div style={{display:'grid', gap:12}}>
        {items.length ? items.map((s,i)=>(
          <a key={i} className="card" style={{padding:12, border:'1px solid #262626'}} href={`/hurricanes/${encodeURIComponent(s.id)}`}>
            <div style={{fontWeight:600}}>{s.title || 'System'}</div>
            {s.pubDate && <div style={{fontSize:12,color:'#737373'}}>{new Date(s.pubDate).toLocaleString()}</div>}
            {s.cone && <img src={s.cone} alt="Cone" style={{marginTop:8, borderRadius:8, border:'1px solid #262626'}}/>}
          </a>
        )) : <div style={{color:'#a3a3a3'}}>No active items in the feed right now.</div>}
      </div>
    </section>
    <section className="card" style={{padding:16}}>
      <h2 style={{fontSize:'1.25rem',fontWeight:700, marginBottom:8}}>Resources</h2>
      <ul style={{paddingLeft:18}}>
        <li><a className="underline" target="_blank" href="https://www.nhc.noaa.gov/">NOAA NHC — Advisories & Discussions</a></li>
        <li><a className="underline" target="_blank" href="https://www.nhc.noaa.gov/gis/">NHC GIS products</a></li>
        <li><a className="underline" target="_blank" href="https://www.nhc.noaa.gov/gtwo.php?basin=atlc&fdays=2">Two‑day outlook</a></li>
      </ul>
    </section>
  </main>)
}
