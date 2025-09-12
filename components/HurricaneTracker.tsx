import Link from 'next/link';

export default function HurricaneTracker(){
  const systems = [
    { name:'AL90', status:'Tropical Storm', loc:'15.2N, 58.6W' },
    { name:'Wave EATL', status:'Invest', loc:'Near Cape Verde' }
  ];
  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Hurricane Tracker</h2>
        <Link className="btn" href="/weather">Storm maps</Link>
      </div>
      <div className="grid trio">
        {systems.map((s,i)=> (
          <div className="card" key={i}>
            <div style={{fontWeight:700}}>{s.name}</div>
            <div className="small" style={{marginTop:4}}>{s.status}</div>
            <div className="muted small" style={{marginTop:6}}>{s.loc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
