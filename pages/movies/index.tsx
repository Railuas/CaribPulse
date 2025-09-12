import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';

type Item = { title: string; cinema: string; times: string[]; url: string };

export default function MoviesDetail(){
  const { query } = useRouter();
  const country = typeof query.country === 'string' ? query.country : 'All Caribbean';
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const run = async () => {
      setLoading(true);
      try{
        const r = await fetch(`/api/movies?country=${encodeURIComponent(country)}`);
        const json = await r.json();
        setItems(json.items || []);
      } finally { setLoading(false); }
    };
    run();
  }, [country]);

  const title = country ? `Movies — ${country}` : 'Movies';

  return (
    <Layout>
      <Head><title>{title} | Magnetide</title></Head>
      <h1>{title}</h1>
      {loading && <div className="muted small">Loading showtimes…</div>}
      {!loading && items.length === 0 && (
        <div className="card"><div className="muted small">No showtimes found right now.</div></div>
      )}
      <div className="grid">
        {items.map((m,i)=>(
          <div className="card" key={i}>
            <div style={{fontWeight:700}}>{m.title}</div>
            <div className="small" style={{marginTop:6}}>{m.cinema}</div>
            <div className="muted small" style={{marginTop:6}}>{m.times.join(' • ')}</div>
            <div style={{marginTop:10}}><a className="btn" href={m.url} target="_blank" rel="noreferrer">Cinema page</a></div>
          </div>
        ))}
      </div>
      <p className="caption" style={{marginTop:10}}>Feeds parsed from Caribbean Cinemas public pages. Add or adjust locations in <code>/lib/moviesMap.ts</code>.</p>
    </Layout>
  );
}
