import Link from 'next/link';

export default function WeatherStage(){
  // Show quick-glance tiles (stubbed) + a "View more" button
  const cities = [
    { name: 'Kingston', temp: '31°', cond:'Partly Cloudy' },
    { name: 'Port of Spain', temp: '30°', cond:'Humid' },
    { name: 'Bridgetown', temp: '29°', cond:'Showers' },
  ];
  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Weather</h2>
        <Link className="btn" href="/weather">View more</Link>
      </div>
      <div className="grid trio">
        {cities.map((c,i)=> (
          <div className="card" key={i}>
            <div className="muted small">{c.name}</div>
            <div style={{fontSize:28, fontWeight:800, marginTop:6}}>{c.temp}</div>
            <div className="small" style={{marginTop:4}}>{c.cond}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
