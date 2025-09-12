import { useEffect, useMemo, useState } from 'react';

type Row = { time: string; vessel?: string; note?: string };
type Dir = 'a-to-b'|'b-to-a';
type Sched = { island: string; route: string; source: string; day?: string; routes: Record<Dir, Row[]>; fetchedAt: number };

export default function IslandFerriesPanel({ islandName }: { islandName: string }){
  const cfg = useMemo(()=>{
    const name = islandName.toLowerCase();
    if (name.includes('kitts') || name.includes('nevis')) return { code:'skn', A:'Nevis → St. Kitts', B:'St. Kitts → Nevis', skn:true };
    if (name.includes('antigua') || name.includes('barbuda')) return { code:'antigua', A:'Antigua → Barbuda', B:'Barbuda → Antigua' };
    if (name.includes('trinidad') || name.includes('tobago')) return { code:'tt', A:'Port of Spain → Scarborough', B:'Scarborough → Port of Spain' };
    return { code:'unsupported', A:'Outbound', B:'Inbound' };
  }, [islandName]);

  const [type, setType] = useState<'ferry'|'taxi'>('ferry');
  const [day, setDay] = useState<string>(new Date().toLocaleDateString('en-US',{ weekday:'long' }));
  const [source, setSource] = useState<'naspa'|'sknvibes'>('naspa');
  const [data, setData] = useState<Sched | null>(null);
  const [loading, setLoading] = useState(false);

  async function load(){
    if (cfg.code==='unsupported'){ setData(null); return; }
    setLoading(true);
    try{
      const params = new URLSearchParams({ island: cfg.code });
      if (cfg.skn){
        params.set('type', type);
        params.set('day', day);
        params.set('source', source);
      }
      const r = await fetch(`/api/ferries-live?${params.toString()}`, { cache:'no-store' });
      const j = await r.json();
      setData(j?.routes ? j as Sched : null);
    }catch(e){ console.error(e); }
    setLoading(false);
  }

  useEffect(()=>{ load(); }, [cfg.code, type, day, source]);

  if (cfg.code==='unsupported') return <div className="card muted small">No live ferry source yet for {islandName}.</div>;

  const Table = ({ dir, title }:{ dir:Dir; title:string }) => {
    const rows = data?.routes?.[dir] || [];
    return (
      <section className="card" style={{ overflowX:'auto' }}>
        <h4 style={{ marginTop:0 }}>{title}</h4>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr><th>Time</th><th>Vessel</th></tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} style={{ borderTop:'1px solid rgba(255,255,255,.08)' }}>
                <td>{r.time || '-'}</td><td>{r.vessel || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length===0 && <div className="muted small" style={{ paddingTop:8 }}>No times listed.</div>}
      </section>
    );
  };

  return (
    <div>
      <div className="card" style={{ display:'grid', gap:12 }}>
        <h3 style={{ margin:0 }}>Ferry Schedules — Live</h3>
        {cfg.skn ? (
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
            <button onClick={()=>setType('ferry')} className={type==='ferry'?'tab active':'tab'}><span>Charlestown Ferry</span><i className="underline" /></button>
            <button onClick={()=>setType('taxi')} className={type==='taxi'?'tab active':'tab'}><span>Oualie Water Taxi</span><i className="underline" /></button>
            <select value={day} onChange={(e)=>setDay(e.target.value)} style={{ marginLeft:'auto', background:'transparent', color:'white', border:'1px solid rgba(255,255,255,.2)', padding:'8px 10px', borderRadius:8 }}>
              {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(d=>(<option key={d} value={d}>{d}</option>))}
            </select>
            <select value={source} onChange={(e)=>setSource(e.target.value as any)} style={{ background:'transparent', color:'white', border:'1px solid rgba(255,255,255,.2)', padding:'8px 10px', borderRadius:8 }}>
              <option value="naspa">NASPA (Official)</option>
              <option value="sknvibes">SKNVibes (Fallback)</option>
            </select>
          </div>
        ) : (
          <div className="muted small">Times are parsed live from the operator’s site.</div>
        )}
        {loading && <div className="muted small">Loading…</div>}
      </div>
      <div style={{ display:'grid', gap:12, gridTemplateColumns:'1fr 1fr' }}>
        <Table dir="a-to-b" title={cfg.A} />
        <Table dir="b-to-a" title={cfg.B} />
      </div>
      {data && <div className="muted small" style={{ marginTop:8 }}>Source: {data.source} · {data.route} {data.day ? `· ${data.day}` : ''}</div>}
    </div>
  );
}
