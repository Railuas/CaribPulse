import { useEffect, useState } from 'react';

type Row = { time: string; vessel?: string; note?: string };
type Dir = 'a-to-b'|'b-to-a';
type Sched = { island: string; route: string; source: string; day?: string; routes: Record<Dir, Row[]>; fetchedAt: number };

export default function Ferries(){
  const [island, setIsland] = useState<string>('skn');
  const [type, setType] = useState<'ferry'|'taxi'>('ferry');
  const [day, setDay] = useState<string>(new Date().toLocaleDateString('en-US',{ weekday:'long' }));
  const [src, setSrc] = useState<'naspa'|'sknvibes'>('naspa');
  const [data, setData] = useState<Sched | null>(null);
  const [loading, setLoading] = useState(false);

  async function load(){
    setLoading(true);
    try{
      const params = new URLSearchParams({ island, type, day });
      if (island==='skn') params.set('source', src);
      const r = await fetch(`/api/ferries-live?${params.toString()}`, { cache: 'no-store' });
      const j = await r.json();
      setData(j?.routes ? j as Sched : null);
    }catch(e){ console.error(e); }
    setLoading(false);
  }

  useEffect(()=>{ load(); }, [island, type, day, src]);

  const dirLabel = (d: Dir) => {
    if (island==='skn') return d==='a-to-b' ? 'Nevis → St. Kitts' : 'St. Kitts → Nevis';
    if (island==='antigua') return d==='a-to-b' ? 'Antigua → Barbuda' : 'Barbuda → Antigua';
    if (island==='tt') return d==='a-to-b' ? 'Port of Spain → Scarborough' : 'Scarborough → Port of Spain';
    return d;
  };

  return (
    <div>
      <div className="card" style={{ display:'grid', gap:12 }}>
        <h3 style={{margin:0}}>Live Ferries</h3>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
          <select value={island} onChange={(e)=>setIsland(e.target.value)} style={{ background:'transparent', color:'white', border:'1px solid rgba(255,255,255,.2)', padding:'8px 10px', borderRadius:8 }}>
            <option value="skn">St. Kitts & Nevis</option>
            <option value="antigua">Antigua & Barbuda</option>
            <option value="tt">Trinidad & Tobago</option>
          </select>
          {island==='skn' && (
            <>
              <button onClick={()=>setType('ferry')} className={type==='ferry'?'tab active':'tab'}><span>Charlestown Ferry</span><i className="underline" /></button>
              <button onClick={()=>setType('taxi')} className={type==='taxi'?'tab active':'tab'}><span>Oualie Water Taxi</span><i className="underline" /></button>
              <select value={src} onChange={(e)=>setSrc(e.target.value as any)} style={{ background:'transparent', color:'white', border:'1px solid rgba(255,255,255,.2)', padding:'8px 10px', borderRadius:8 }}>
                <option value="naspa">NASPA (Official)</option>
                <option value="sknvibes">SKNVibes (Fallback)</option>
              </select>
              <select value={day} onChange={(e)=>setDay(e.target.value)} style={{ background:'transparent', color:'white', border:'1px solid rgba(255,255,255,.2)', padding:'8px 10px', borderRadius:8 }}>
                {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(d=>(<option key={d} value={d}>{d}</option>))}
              </select>
            </>
          )}
          {island!=='skn' && <div className="muted small">Times shown are parsed live from the operator’s site.</div>}
        </div>
        {loading && <div className="muted small">Loading…</div>}
      </div>

      <div style={{ display:'grid', gap:12, gridTemplateColumns:'1fr 1fr' }}>
        {(['a-to-b','b-to-a'] as const).map((dir)=>(
          <section key={dir} className="card" style={{ overflowX:'auto' }}>
            <h4 style={{ marginTop: 0 }}>{dirLabel(dir)}</h4>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr><th>Time</th><th>Vessel</th></tr></thead>
              <tbody>
                {(data?.routes?.[dir]||[]).map((r,i)=>(
                  <tr key={i} style={{ borderTop:'1px solid rgba(255,255,255,.08)' }}>
                    <td>{r.time || '-'}</td><td>{r.vessel || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && (data?.routes?.[dir]?.length||0)===0 && <div className="muted small" style={{ paddingTop:8 }}>No times listed.</div>}
          </section>
        ))}
      </div>
      {data && (
        <div className="muted small" style={{ marginTop:8 }}>
          Source: {data.source} · {data.route} {data.day ? `· ${data.day}` : ''}
        </div>
      )}
    </div>
  );
}
