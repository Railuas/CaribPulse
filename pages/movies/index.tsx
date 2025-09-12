import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

export default function MoviesDetail(){
  const { query } = useRouter();
  const country = typeof query.country === 'string' ? query.country : undefined;
  const title = country ? `Movies — ${country}` : 'Movies';

  const listings = [
    { title:'Dune: Part Two', cinema:'Caribbean Cinemas — Port of Spain', times:['4:30','7:45','10:50'] },
    { title:'Inside Out 2', cinema:'Caribbean Cinemas — Kingston', times:['3:10','5:40','8:15'] },
    { title:'Bad Boys: Ride or Die', cinema:'Caribbean Cinemas — Nassau', times:['4:00','6:30','9:00'] },
    { title:'Deadpool & Wolverine', cinema:'Caribbean Cinemas — Bridgetown', times:['2:45','6:00','9:20'] },
    { title:'A Quiet Place: Day One', cinema:'Caribbean Cinemas — San Juan', times:['5:20','8:00'] },
    { title:'Blue Surf', cinema:'Caribbean Cinemas — Port of Spain', times:['5:10','7:20','9:40'] },
  ];

  return (
    <Layout>
      <Head><title>{title} | Magnetide</title></Head>
      <h1>{title}</h1>
      <div className="grid">
        {listings.map((m,i)=>(
          <div className="card" key={i}>
            <div style={{fontWeight:700}}>{m.title}</div>
            <div className="small" style={{marginTop:6}}>{m.cinema}</div>
            <div className="muted small" style={{marginTop:6}}>{m.times.join(' • ')}</div>
          </div>
        ))}
      </div>
      <p className="caption">Showtimes are examples. For live schedules, integrate Caribbean Cinemas feeds per country.</p>
    </Layout>
  );
}
