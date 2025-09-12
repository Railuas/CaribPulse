import Link from 'next/link';

export default function SportsTicker({ country }: { country?: string }){
  const label = country ? `Sports — ${country}` : 'Sports';
  const q = country ? `?country=${encodeURIComponent(country)}` : '';
  const items = [
    { league:'CPL', text:'Guyana Amazon Warriors clinch playoff spot' },
    { league:'Football', text:'Reggae Boyz friendly announced for October' },
    { league:'Track', text:'Elaine Thompson back in training' },
  ];
  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">{label}</h2>
        <Link className="btn" href={`/sports${q}`}>View more</Link>
      </div>
      <div className="grid trio">
        {items.map((it,i)=> (
          <div className="card" key={i}>
            <div className="muted small">{it.league}</div>
            <div style={{marginTop:6, fontWeight:600}}>{it.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
