import Link from 'next/link';

export default function IslandFerriesPanel(){
  const ferries = [
    { route:'St. Kitts ↔ Nevis', time:'Every 30–60 min', status:'Normal' },
    { route:'St. Lucia ↔ Martinique', time:'2x daily', status:'Normal' },
    { route:'Trinidad ↔ Tobago', time:'3x daily', status:'Check weather' },
  ];
  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Ferries</h2>
        <Link className="btn" href="/ferries">Schedules</Link>
      </div>
      <div className="grid trio">
        {ferries.map((f,i)=> (
          <div className="card" key={i}>
            <div style={{fontWeight:600}}>{f.route}</div>
            <div className="small" style={{marginTop:6}}>{f.time}</div>
            <div className="muted small" style={{marginTop:6}}>{f.status}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
