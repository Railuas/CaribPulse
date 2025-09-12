import Link from 'next/link';

export default function IslandMoviesPanel(){
  const movies = [
    { title:'Blue Surf', cinema:'Caribbean Cinemas, POS', time:'7:10 PM' },
    { title:'Island Heist', cinema:'Mall at Marathon, Nassau', time:'8:00 PM' },
    { title:'Kingston Nights', cinema:'Sunshine Palace, Kingston', time:'6:40 PM' },
  ];
  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">Movies</h2>
        <Link className="btn" href="/movies">All showtimes</Link>
      </div>
      <div className="grid trio">
        {movies.map((m,i)=> (
          <div className="card" key={i}>
            <div style={{fontWeight:600}}>{m.title}</div>
            <div className="small" style={{marginTop:6}}>{m.cinema}</div>
            <div className="muted small" style={{marginTop:6}}>{m.time}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
