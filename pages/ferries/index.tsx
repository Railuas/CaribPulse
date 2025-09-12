import { useRouter } from 'next/router';
import Head from 'next/head';
import CountrySelect from '@/components/CountrySelect';
import Footer from '@/components/Footer';

export default function FerriesPage(){
  const { query } = useRouter();
  const country = typeof query.country === 'string' ? query.country : undefined;
  const title = country ? `Ferries — ${country}` : 'Ferries';

  const ferries = [
    { route:'St. Kitts ↔ Nevis', operator:'Sea Bridge / MV Mark Twain', notes:'Every 30–60 min' },
    { route:'Trinidad ↔ Tobago', operator:'TTIT', notes:'Check weather advisories' },
    { route:'St. Lucia ↔ Martinique', operator:'Express des Iles', notes:'2x daily' },
  ];

  return (
    <>
      <Head><title>{title} | Magnetide</title></Head>
      <CountrySelect />
      <div className="container">
        <h1>{title}</h1>
        <div className="grid" style={{gridTemplateColumns:'1fr'}}>
          {ferries.map((f,i)=>(
            <div className="card" key={i}>
              <div style={{fontWeight:700}}>{f.route}</div>
              <div className="small" style={{marginTop:6}}>{f.operator}</div>
              <div className="muted small" style={{marginTop:6}}>{f.notes}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
