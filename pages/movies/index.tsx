import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useEffect, useMemo, useState } from 'react';

type Item = { title: string; cinema: string; times: string[]; url: string };

function TimePill({ t }: { t: string }) {
  return (
    <span
      className="time-pill"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 10px',
        border: '1px solid var(--border)',
        borderRadius: 10,
        fontSize: 12,
        lineHeight: 1,
        marginRight: 6,
        marginBottom: 6,
        whiteSpace: 'nowrap',
        background: 'rgba(255,255,255,.03)',
      }}
      title={`Showtime: ${t}`}
    >
      {t.replace(/\s+/g, ' ')}
    </span>
  );
}

export default function MoviesDetail() {
  const { query, replace } = useRouter();
  const country = typeof query.country === 'string' ? query.country : 'All Caribbean';

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/movies?country=${encodeURIComponent(country)}`);
        const json = await r.json();
        setItems(Array.isArray(json.items) ? json.items : []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [country]);

  // Group by movie title -> [{ title, entries: [{cinema, times, url}, ...] }]
  const grouped = useMemo(() => {
    const map = new Map<string, { title: string; entries: Item[] }>();
    for (const it of items) {
      const key = it.title.trim();
      if (!map.has(key)) map.set(key, { title: key, entries: [] });
      map.get(key)!.entries.push(it);
    }
    return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title));
  }, [items]);

  const title = country ? `Movies — ${country}` : 'Movies';

  // Optional: simple local country selector (uses same list you already use in your topbar)
  const countries = [
    'All Caribbean','Trinidad and Tobago','Jamaica','Barbados','Bahamas','Dominican Republic',
    'Puerto Rico','Saint Lucia','Grenada','Saint Vincent and the Grenadines','Antigua and Barbuda',
    'Sint Maarten','Saint Martin','Curaçao','Guyana'
  ];

  const onPickCountry = (c: string) => {
    const url = { pathname: '/movies', query: c === 'All Caribbean' ? {} : { country: c } };
    replace(url, undefined, { shallow: true });
  };

  return (
    <Layout>
      <Head><title>{title} | Magnetide</title></Head>

      {/* Header */}
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
      {!loading && grouped.length === 0 && (
        <div className="card"><div className="muted small">No showtimes found right now.</div></div>
      )}

      {/* Movie groups */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))',
          gap: 14,
          alignItems: 'stretch'
        }}
      >
        {grouped.map(group => (
          <article className="card" key={group.title} style={{display:'flex', flexDirection:'column'}}>
            <div>
              <h3 className="card-title" style={{fontSize:18, margin:'2px 0 8px'}}>{group.title}</h3>
              {/* Per-cinema blocks */}
              <div style={{display:'grid', gap:12}}>
                {group.entries.map((e, idx) => (
                  <div key={idx} style={{borderTop: idx ? '1px dashed var(--border)' : 'none', paddingTop: idx ? 10 : 0}}>
                    <div className="muted small" style={{marginBottom:6}}>{e.cinema}</div>
                    <div style={{display:'flex', flexWrap:'wrap'}}>
                      {e.times.slice(0, 20).map((t,i)=><TimePill key={i} t={t}/>)}{/* show up to 20 */}
                    </div>
                    <div style={{marginTop:8}}>
                      <a className="btn" href={e.url} target="_blank" rel="noreferrer">Cinema page</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Layout>
  );
}
