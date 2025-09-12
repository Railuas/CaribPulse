import { useRouter } from 'next/router';
import Head from 'next/head';
import CountrySelect from '@/components/CountrySelect';
import Footer from '@/components/Footer';

export default function SportsPage(){
  const { query } = useRouter();
  const country = typeof query.country === 'string' ? query.country : undefined;
  const title = country ? `Sports — ${country}` : 'Sports';

  const items = [
    { league:'CPL', text:'Live table and fixtures coming soon' },
    { league:'Football', text:'Concacaf Nations League fixtures' },
    { league:'Track', text:'Diamond League recap' },
  ];

  return (
    <>
      <Head><title>{title} | Magnetide</title></Head>
      <CountrySelect />
      <div className="container">
        <h1>{title}</h1>
        <div className="grid trio" style={{marginTop:12}}>
          {items.map((it,i)=>(
            <div className="card" key={i}>
              <div className="muted small">{it.league}</div>
              <div style={{marginTop:6, fontWeight:600}}>{it.text}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
