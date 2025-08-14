import { useEffect, useMemo, useState } from 'react';

type FerryRoute = {
  id: string;
  origin: string;
  destination: string;
  operator: string;
  days: string[];
  depart: string;
  arrive: string;
  link?: string;
  notes?: string;
};

export default function Ferries() {
  const [routes, setRoutes] = useState<ReadonlyArray<FerryRoute>>([]);
  const [q, setQ] = useState('');
  const [day, setDay] = useState<string>('All');

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/data/ferries.json', { cache: 'no-store' });
        const j = await r.json();
        setRoutes(j.routes || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return routes.filter(r => {
      const text = `${r.origin} ${r.destination} ${r.operator}`.toLowerCase();
      const qok = ql ? text.includes(ql) : true;
      const dok = day==='All' ? true : r.days.includes(day);
      return qok && dok;
    });
  }, [routes, q, day]);

  return (
    <div>
      <div className="card" style={{ display:'grid', gap:12 }}>
        <h3 style={{margin:0}}>Ferry Schedules</h3>
        <div className="muted small">Tip: these are example listings. Confirm times with the operator before travel.</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
          <input
            placeholder="Search island, city, operator…"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            style={{ flex:'1 1 260px', background:'transparent', color:'white', border:'1px solid rgba(255,255,255,.2)', padding:'8px 10px', borderRadius:8 }}
          />
          <select value={day} onChange={(e)=>setDay(e.target.value)} style={{ background:'transparent', color:'white', border:'1px solid rgba(255,255,255,.2)', padding:'8px 10px', borderRadius:8 }}>
            {['All','Mon','Tue','Wed','Thu','Fri','Sat','Sun','Daily'].map(d=>(<option key={d} value={d}>{d}</option>))}
          </select>
        </div>
      </div>
      <div className="card" style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>
            <th>Origin</th><th>Destination</th><th>Operator</th><th>Days</th><th>Departs</th><th>Arrives</th><th>Link</th>
          </tr></thead>
          <tbody>
            {filtered.map((r)=> (
              <tr key={r.id} style={{ borderTop:'1px solid rgba(255,255,255,.08)' }}>
                <td>{r.origin}</td>
                <td>{r.destination}</td>
                <td>{r.operator}</td>
                <td>{r.days.join(', ')}</td>
                <td>{r.depart}</td>
                <td>{r.arrive}</td>
                <td>{r.link ? <a href={r.link} target="_blank" rel="noreferrer">Site ↗</a> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && <div className="muted small" style={{paddingTop:8}}>No routes matched.</div>}
      </div>
    </div>
  );
}
