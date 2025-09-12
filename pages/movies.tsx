import { useEffect, useMemo, useState } from 'react';
import type { Cinema } from '../lib/cinemas';

type Show = { title: string; times: string[]; rating?: string; format?: string };
type CinemaShows = Cinema & { shows: ReadonlyArray<Show> };

export default function Movies(){
  const [island, setIsland] = useState<string>('All');
  const [q, setQ] = useState<string>('');
  const [items, setItems] = useState<ReadonlyArray<CinemaShows>>([]);
  const [loading, setLoading] = useState(false);

  async function load(){
    setLoading(true);
    try{
      const r = await fetch(`/api/movies-live${island!=='All' ? `?island=${encodeURIComponent(island)}` : ''}`, { cache: 'no-store' });
      const j = await r.json();
      setItems(Array.isArray(j) ? j : []);
    }catch(e){ console.error(e); }
    setLoading(false);
  }

  useEffect(()=>{ load(); }, [island]);

  const islands = useMemo(()=>['All', ...Array.from(new Set(items.map(i => i.island)))], [items]);
  const filtered = useMemo(()=>{
    const ql = q.trim().toLowerCase();
    const list = (items || []).map(c => ({
      ...c,
      shows: (c.shows || []).filter(s => ql ? s.title.toLowerCase().includes(ql) : true)
    }));
    return list.filter(c => c.shows.length > 0);
  }, [items, q]);

  return (
    <div>
      <div className="card" style={{ display:'grid', gap:12 }}>
        <h3 style={{ margin:0 }}>Movie Schedules — Live</h3>
        <div className="muted small">Source: Caribbean Cinemas official theater pages (updated weekly, new times on Thursdays).</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
          <select value={island} onChange={(e)=>setIsland(e.target.value)} style={{ background:'transparent', color:'white', border:'1px solid rgba(255,255,255,.2)', padding:'8px 10px', borderRadius:8 }}>
            {['All','Trinidad & Tobago','Saint Kitts & Nevis','Saint Lucia'].map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <input placeholder="Search movie title…" value={q} onChange={(e)=>setQ(e.target.value)} style={{ flex:'1 1 260px', background:'transparent', color:'white', border:'1px solid rgba(255,255,255,.2)', padding:'8px 10px', borderRadius:8 }} />
        </div>
        {loading && <div className="muted small">Loading…</div>}
      </div>

      {filtered.map((c,i)=>(
        <section key={i} className="card">
          <div style={{ display:'flex', alignItems:'baseline', gap:8, flexWrap:'wrap' }}>
            <h4 style={{ margin:0 }}>{c.name}</h4>
            <div className="muted small">{c.island}</div>
            <a className="muted small" href={c.url} target="_blank" rel="noreferrer" style={{ marginLeft:'auto' }}>Official page ↗</a>
          </div>
          <div style={{ display:'grid', gap:12, marginTop:10 }}>
            {c.shows.map((s,j)=>(
              <div key={j} className="card" style={{ background:'rgba(255,255,255,.03)' }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:8, flexWrap:'wrap' }}>
                  <strong>{s.title}</strong>
                  {s.rating && <span className="muted small">{s.rating}</span>}
                  {s.format && <span className="muted small">{s.format}</span>}
                </div>
                <div className="muted small" style={{ marginTop:6, display:'flex', gap:8, flexWrap:'wrap' }}>
                  {s.times.map((t,k)=>(<span key={k} className="tab"><span>{t}</span><i className="underline" /></span>))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
      {filtered.length===0 && <div className="card muted small">No live showtimes matched.</div>}
    </div>
  );
}
