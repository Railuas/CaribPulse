import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import MovieCard from '@/components/MovieCard';

type Item = {
  cinema: string;
  url?: string;
  title: string;
  times?: string[];
  poster?: string;
  country?: string;
};

function normalizeLive(c: any): Item[] {
  const country = c.island || c.country;
  const out: Item[] = [];
  for (const s of (c.shows || [])) {
    out.push({ cinema: c.name, url: c.url, title: s.title, times: s.times || [], poster: s.poster, country });
  }
  return out;
}
function normalizeLegacy(items: any[]): Item[] {
  return (items || []).map((x: any) => ({
    cinema: x.cinema || x.theater || '',
    url: x.url,
    title: x.title,
    times: x.times || x.showtimes || [],
    poster: x.poster,
    country: x.country || x.island
  }));
}

export default function MoviesPage(){
  const router = useRouter();
  const country = String(router.query.country || 'All Caribbean');

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let flat: Item[] = [];
      try {
        const rLive = await fetch(`/api/movies-live?island=${encodeURIComponent(country)}`);
        const jLive = await rLive.json();
        if (Array.isArray(jLive)) {
          const rows = country && country !== 'All Caribbean'
            ? jLive.filter((c:any)=> (c.island||'').toLowerCase() === country.toLowerCase())
            : jLive;
          flat = rows.flatMap(normalizeLive);
        }
      } catch {}

      if (flat.length === 0) {
        try {
          const r = await fetch(`/api/movies?country=${encodeURIComponent(country)}`);
          const j = await r.json();
          flat = Array.isArray(j.items) ? normalizeLegacy(j.items) : [];
        } catch {}
      }
      setItems(flat);
      setLoading(false);
    })();
  }, [country]);

  const content = useMemo(() => {
    if (loading) {
      return <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl border border-white/10 bg-white/5 animate-pulse" />
        ))}
      </div>;
    }
    if (!items.length) {
      return <div className="opacity-70">No showtimes found for <b>{country}</b> right now.</div>;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {items.map((m, idx) => (
          <MovieCard key={idx} item={m} />
        ))}
      </div>
    );
  }, [items, loading, country]);

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold">Movies</h1>
      <p className="opacity-80 text-sm sm:text-[13px] mt-1">Showing live schedules from Caribbean Cinemas. Use the country filter in the navbar to switch islands.</p>
      <div className="mt-4">
        {content}
      </div>
    </main>
  );
}