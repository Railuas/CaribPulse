import { useEffect, useState } from 'react';

type Item = { title: string; link: string; source: string; published: number; image?: string };

export default function NewsList({ q }: { q?: string }) {
  const [items, setItems] = useState<ReadonlyArray<Item>>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/news${q ? `?q=${encodeURIComponent(q)}` : ''}`);
        if (!r.ok) throw new Error('news api error');
        const j = await r.json();
        setItems(j.items ?? []);
      } catch (e: any) {
        setError(e?.message || 'failed to load news');
      }
    })();
  }, [q]);
  if (error) return <div className="muted small">News unavailable right now.</div>;
  return (
    <div className="news-grid">
      {items.length === 0 && <div className="muted">Fetching headlines…</div>}
      {items.map((n, i) => (
        <a key={i} href={n.link} target="_blank" rel="noreferrer" className="news-card">
          <div className="thumb" style={{ backgroundImage: n.image ? `url(${n.image})` : undefined }} />
          <div className="body">
            <div className="title">{n.title}</div>
            <div className="meta">{n.source} · {new Date(n.published).toLocaleString()}</div>
          </div>
        </a>
      ))}
    </div>
  );
}
