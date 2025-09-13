import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useEffect, useMemo, useState } from 'react';

type Item = { cinema: string; url: string; title: string; times: string[] };

function TimePill({ t }: { t: string }) {
  return (
    <span
      style={{
        display:'inline-flex',alignItems:'center',justifyContent:'center',
        padding:'6px 10px',border:'1px solid var(--border)',borderRadius:10,
        fontSize:12,lineHeight:1,marginRight:6,marginBottom:6,whiteSpace:'nowrap',
        background:'rgba(255,255,255,.03)'
      }}
      title={`Showtime: ${t}`}
    >{t}</span>
  );
}

export default function Movies() {
  const { query, replace } = useRouter();
  const country = typeof query.country === 'string' ? query.country : 'All Caribbean';

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/movies?country=${encodeURIComponent(country)}`);
        const json = await r.json();
        setItems(Array.isArray(json.items) ? json.items : []);
      } finally { setLoading(false); }
    })();
  }, [country]);

  // Group by cinema
  const byCinema = useMemo(() => {
    const map = new Map<string, { url: string; movies: { title: string; times: string[] }[] }>();
    for (const it of items) {
      if (!map.has(it.cinema)) map.set(it.cinema, { url: it.url, movies: [] });
      map.get(it.cinema)!.movies.push({ title: it.title, times: it.times });
    }
    return Array.from(map.entries()).map(([cinema, v]) => ({ cinema, url: v.url, movies: v.movies }));
  }, [items]);

  const title = `Movies — ${country || 'All Caribbean'}`;
  const countries = [
    'All Caribbean','Trinidad and Tobago','Jamaica','Barbados','Bahamas','Dominican Republic',
    'Puerto Rico','Saint Lucia','Grenada','Saint Vincent and the Grenadines',
    'Antigua and Barbuda','Sint Maarten','Saint Martin','Curaçao','Guyana'
  ];

  const onPickCountry = (c: string) => {
    const url = { pathname: '/movies', query: c === 'All Caribbean' ? {} : { country: c } };
    replace(url, undefined, { shallow: true });
  };

  return (
    <Layout>
      <Head><title>{title} | Magnetide</title></Head>

      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, marginBottom:10}}>
        <h1 style={{margin:'10px 0'}}>{title}</h1>
        <div className="select-wrap">
          <label className="select-label">Country</label>
          <select className="select" value={country} onChange={e=>onPickCountry(e.target.value)}>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loading && <div className="muted small">Loading showtimes…</div>}
      {!loading && byCinema.length === 0 && (
        <div className="card"><div className="muted small">No showtimes found right now.</div></div>
      )}

      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(380px,1fr))', gap:14}}>
        {byCinema.map(({ cinema, url, movies }) => (
          <article className="card" key={cinema}>
            <h3 className="card-title" style={{fontSize:18, margin:'2px 0 8px'}}>{cinema}</h3>

            <div style={{display:'grid', gap:12}}>
              {movies.map((m, idx) => (
                <div key={idx} style={{borderTop: idx ? '1px dashed var(--border)' : 'none', paddingTop: idx ? 10 : 0}}>
                  <div style={{fontWeight:600, marginBottom:6}}>{m.title}</div>
                  <div style={{display:'flex', flexWrap:'wrap'}}>
                    {m.times.map((t,i)=><TimePill key={i} t={t}/>)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{marginTop:12}}>
              <a className="btn" href={url} target="_blank" rel="noreferrer">Cinema page</a>
            </div>
          </article>
        ))}
      </div>
    </Layout>
  );
}
