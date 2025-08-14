import { useEffect, useMemo, useState } from 'react';

type Show = { title: string; rating?: string; times: string[] };
type Cinema = { island: string; name: string; link?: string; shows: Show[] };

export default function Movies(){
  const [cinemas, setCinemas] = useState<ReadonlyArray<Cinema>>([]);
  const [island, setIsland] = useState<string>('All');
  const [q, setQ] = useState<string>('');

  useEffect(()=>{
    (async()=>{
      try{
        const r = await fetch('/data/movies.json', { cache: 'no-store' });
        const j = await r.json();
        setCinemas(j.cinemas || []);
      }catch(e){ console.error(e); }
    })();
  }, []);

  const islands = useMemo(()=>['All', ...Array.from(new Set(cinemas.map(c=>c.island)))], [cinemas]);
  const filtered = useMemo(()=>{
    const ql = q.trim().toLowerCase();
    return cinemas
      .filter(c => island==='All' ? true : c.island===island)
      .map(c => ({
        ...c,
        shows: c.shows.filter(s => ql ? (s.title.toLowerCase().includes(ql)) : true)
      }))
      .filter(c => c.shows.length>0);
  }, [cinemas, island, q]);

  return (
    <div>
      <div className="card" style={{ display:'grid', gap:12 }}>
        <h3 style={{margin:0}}>Movie Schedules</h3>
        <div className="muted small">Example listings. Always check the cinema website for up-to-date times.</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
          <select value={island} onChange={(e)=>setIsland(e.target.value)} style={{ background:'transparent', color:'white', border:'1px solid rgba(255,255,255,.2)', padding:'8px 10px', borderRadius:8 }}>
            {islands.map(i=> <option key={i} value={i}>{i}</option>)}
          </select>
          <input placeholder="Search movie title…" value={q} onChange={(e)=>setQ(e.target.value)} style={{ flex:'1 1 260px', background:'transparent', color:'white', border:'1px solid rgba(255,255,255,.2)', padding:'8px 10px', borderRadius:8 }} />
        </div>
      </div>
      {filtered.map((c,i)=>(
        <section key={i} className="card">
          <div style={{ display:'flex', alignItems:'baseline', gap:8, flexWrap:'wrap' }}>
            <h4 style={{margin:0}}>{c.name}</h4>
            <div className="muted small">{c.island}</div>
            {c.link && <a className="muted small" style={{ marginLeft:'auto' }} href={c.link} target="_blank" rel="noreferrer">Website ↗</a>}
          </div>
          <div style={{ display:'grid', gap:12, marginTop:10 }}>
            {c.shows.map((s,j)=>(
              <div key={j} className="card" style={{ background:'rgba(255,255,255,.03)' }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:8, flexWrap:'wrap' }}>
                  <strong>{s.title}</strong>
                  {s.rating && <span className="muted small">{s.rating}</span>}
                </div>
                <div className="muted small" style={{ marginTop:6, display:'flex', gap:8, flexWrap:'wrap' }}>
                  {s.times.map((t,k)=>(<span key={k} className="tab"><span>{t}</span><i className="underline" /></span>))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
      {filtered.length===0 && <div className="card muted small">No showtimes matched.</div>}
    </div>
  );
}
