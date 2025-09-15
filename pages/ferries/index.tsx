import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';

type Ferry = {
  route: string;
  operator: string;
  website?: string;
  notes?: string;
  typical?: string[];
};

export default function FerriesDetail(){
  const { query } = useRouter();
  const country = typeof query.country === 'string' ? query.country : 'All Caribbean';
  const [items, setItems] = useState<Ferry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const run = async ()=>{
      setLoading(true);
      try{
        let items: Ferry[] = [];
try{
  const rLive = await fetch(`/api/ferries-live?country=${encodeURIComponent(country)}`);
  const jLive = await rLive.json();
  if (Array.isArray(jLive.items)) items = jLive.items;
  else if (Array.isArray(jLive)) items = jLive; // some versions return raw array
}catch{}
if (items.length === 0){
  const r = await fetch(`/api/ferries?country=${encodeURIComponent(country)}`);
  const json = await r.json();
  items = json.items || [];
}
setItems(items);

      } finally { setLoading(false); }
    };
    run();
  }, [country]);

  const title = country ? `Ferries — ${country}` : 'Ferries';

  return (
    <Layout>
      <Head><title>{title} | Magnetide</title></Head>
      <h1>{title}</h1>
      {loading && <div className="muted small">Loading ferry info…</div>}
      {!loading && items.length === 0 && <div className="card"><div className="muted small">No ferry data for this country yet.</div></div>}
      <div className="card">
        <table className="table">
          <thead><tr><th>Route</th><th>Operator</th><th>Typical</th><th>More</th></tr></thead>
          <tbody>
            {items.map((f,i)=>(
              <tr key={i}>
                <td>{f.route}</td>
                <td>{f.operator}</td>
                <td>{f.typical ? f.typical.join(' • ') : (f.notes || '')}</td>
                <td>{f.website ? <a href={f.website} target="_blank" rel="noreferrer">Website</a> : <span className="muted small">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="caption" style={{marginTop:10}}>Add more routes or operators in <code>/pages/api/ferries.ts</code>.</p>
    </Layout>
  );
}
