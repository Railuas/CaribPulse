
import { useEffect, useState } from 'react';

type Show = { title: string; times: string[]; rating?: string; format?: string };
type CinemaShows = { key: string; island: string; name: string; url: string; shows: Show[] };

export default function IslandMoviesPanel({ islandName }: { islandName: string }){
  const [data, setData] = useState<CinemaShows[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    (async ()=>{
      setLoading(true);
      try{
        const res = await fetch(`/api/movies-live?island=${encodeURIComponent(islandName)}`);
        const json = await res.json();
        setData(json?.results || []);
      }catch{
        setData([]);
      }finally{
        setLoading(false);
      }
    })();
  }, [islandName]);

  if (loading) return <div className="muted small">Loading movies…</div>;
  if (!data || data.length === 0) return <div className="muted small">No cinema listings found.</div>;

  return (
    <div className="news-grid">
      {data.map((c) => (
        <a key={c.key} className="news-card" href={c.url} target="_blank" rel="noreferrer">
          <div className="body">
            <div className="title">{c.name}</div>
            <div className="meta">{c.island}</div>
            <div className="small" style={{marginTop:8}}>
              {(c.shows || []).slice(0, 5).map((s, i) => (
                <div key={i} style={{marginBottom:4}}>
                  <strong>{s.title}</strong> — {s.times.join(', ')}
                </div>
              ))}
              {(c.shows || []).length === 0 && <div className="muted small">No showtimes listed.</div>}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
