import { useRouter } from 'next/router';
import Head from 'next/head';
import CountrySelect from '@/components/CountrySelect';
import Footer from '@/components/Footer';

export default function MoviesPage(){
  const { query } = useRouter();
  const country = typeof query.country === 'string' ? query.country : undefined;
  const title = country ? `Movies — ${country}` : 'Movies';

  const movies = [
    { title:'Blue Surf', cinema:'Caribbean Cinemas, POS', times:['5:00','7:10','9:20'] },
    { title:'Island Heist', cinema:'Mall at Marathon, Nassau', times:['6:30','8:45'] },
    { title:'Kingston Nights', cinema:'Sunshine Palace, Kingston', times:['4:10','6:40','9:00'] },
  ];

  return (
    <>
      <Head><title>{title} | Magnetide</title></Head>
      <CountrySelect />
      <div className="container">
        <h1>{title}</h1>
        <div className="grid">
          {movies.map((m,i)=>(
            <div className="card" key={i}>
              <div style={{fontWeight:700}}>{m.title}</div>
              <div className="small" style={{marginTop:6}}>{m.cinema}</div>
              <div className="muted small" style={{marginTop:6}}>{m.times.join(' • ')}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
