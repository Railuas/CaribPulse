import React, { useEffect, useState } from 'react';
import NewsCard, { NewsItem } from '@/components/NewsCard';

export default function NewsPage(){
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState('All Caribbean');

  useEffect(()=>{
    (async ()=>{
      setLoading(true);
      try{
        const r = await fetch(`/api/news?country=${encodeURIComponent(country)}`);
        const j = await r.json();
        setItems(Array.isArray(j.items) ? j.items : []);
      }finally{
        setLoading(false);
      }
    })();
  }, [country]);

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold">News</h1>
      <p className="opacity-80 text-sm mt-1">Regional by default. Switch to a country to see its feed.</p>

      <div className="mt-4 grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:12}}>
        {loading ? Array.from({length:6}).map((_,i)=>(
          <div key={i} className="h-40 rounded-xl border border-white/10 bg-white/5 animate-pulse" />
        )) : items.map(it => (
          <NewsCard key={it.id} item={it} />
        ))}
      </div>
    </main>
  );
}
