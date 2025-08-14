import { useEffect, useMemo, useState } from 'react';

type Row = { time: string; vessel: string };
type Dir = 'nevis-to-st-kitts' | 'st-kitts-to-nevis';

export default function Ferries(){
  const [type, setType] = useState<'ferry'|'taxi'>('ferry');
  const [day, setDay] = useState<string>(new Date().toLocaleDateString('en-US',{weekday:'long'}));
  const [data, setData] = useState<Record<Dir, ReadonlyArray<Row>>>({ 'nevis-to-st-kitts': [], 'st-kitts-to-nevis': [] });
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'naspa'|'sknvibes'>('naspa');

  async function load(){
    setLoading(true);
    try{
      const r = await fetch(`/api/ferries-live?type=${type}&day=${encodeURIComponent(day)}&source=${source}`, { cache: 'no-store' });
      const j = await r.json();
      if (j.routes) setData(j.routes);
    }catch(e){ console.error(e); }
    setLoading(false);
  }

  useEffect(()=>{ load(); }, [type, day, source]);

  function Table({ dir, title }:{ dir:Dir; title:string }){
    const rows = data[dir] || [];
    return (
      <section className="card" style={{ overflowX:'auto' }}>
        <h4 style={{ marginTop: 0 }}>{title}</h4>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr><th>Time</th><th>Vessel</th></tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} style={{ borderTop:'1px solid rgba(255,255,255,.08)' }}>
                <td>{r.time}</td><td>{r.vessel}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && rows.length===0 && <div className="muted small" style={{ paddingTop:8 }}>No times found for this day.</div>}
      </section>
    );
  }

  return (
    <div>
      <div className="card" style={{ display:'grid', gap:12 }}>
        <h3 style={{margin:0}}>St. Kitts & Nevis — Live Ferries</h3>
        <div className="muted small">Source: NASPA (official). Flip to SKNVibes as a fallback if needed.</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={()=>setType('ferry')} className={type==='ferry'?'tab active':'tab'}><span>Charlestown Ferry</span><i className="underline" /></button>
            <button onClick={()=>setType('taxi')} className={type==='taxi'?'tab active':'tab'}><span>Oualie Water Taxi</span><i className="underline" /></button>
          </div>
          <select value={day} onChange={(e)=>setDay(e.target.value)} style={{ marginLeft:'auto', background:'transparent', color:'white', border:'1px solid rgba(255,255,255,.2)', padding:'8px 10px', borderRadius:8 }}>
            {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(d=>(<option key={d} value={d}>{d}</option>))}
          </select>
          <select value={source} onChange={(e)=>setSource(e.target.value as any)} style={{ background:'transparent', color:'white', border:'1px solid rgba(255,255,255,.2)', padding:'8px 10px', borderRadius:8 }}>
            <option value="naspa">NASPA (Official)</option>
            <option value="sknvibes">SKNVibes (Fallback)</option>
          </select>
        </div>
        {loading && <div className="muted small">Loading…</div>}
      </div>

      <div style={{ display:'grid', gap:12, gridTemplateColumns:'1fr 1fr' }}>
        <Table dir="nevis-to-st-kitts" title="Nevis → St. Kitts" />
        <Table dir="st-kitts-to-nevis" title="St. Kitts → Nevis" />
      </div>
    </div>
  );
}
