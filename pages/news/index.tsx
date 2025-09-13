// pages/news/index.tsx
import Head from 'next/head';
import Layout from '@/components/Layout';
import NewsCard from '@/components/NewsCard';
import { useEffect, useMemo, useState } from 'react';

type Item = {
  id: string;
  title: string;
  url: string;
  source: string;
  country: string;
  published?: string;
  image?: string;
  summary?: string;
};

const COUNTRIES = [
  'All Caribbean','Jamaica','Trinidad and Tobago','Barbados','Bahamas','Dominican Republic',
  'Puerto Rico','Saint Lucia','Grenada','Antigua and Barbuda','Guyana','St. Kitts and Nevis','U.S. Virgin Islands'
];

export default function NewsIndex(){
  const [country, setCountry] = useState<string>('All Caribbean');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      const r = await fetch(`/api/news?country=${encodeURIComponent(country)}`);
      const j = await r.json();
      setItems(Array.isArray(j.items) ? j.items : []);
      setLoading(false);
    })();
  },[country]);

  return (
    <Layout>
      <Head><title>News — {country} | Magnetide</title></Head>

      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:12,flexWrap:'wrap'}}>
        <h1 style={{margin:'10px 0'}}>Latest News — {country}</h1>
        <div className="select-wrap">
          <label className="select-label">Country</label>
          <select className="select" value={country} onChange={e=>setCountry(e.target.value)}>
            {COUNTRIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loading ? <div className="muted small">Loading…</div> : null}

      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(360px,1fr))', gap:12}}>
        {items.map(it => (
          <NewsCard key={it.id} id={it.id} title={it.title} image={it.image} source={it.source} published={it.published} />
        ))}
      </div>
    </Layout>
  );
}
