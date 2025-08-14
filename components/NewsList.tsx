import { useEffect, useState } from 'react';

type Item = { title: string; link: string; source: string; published: number; image?: string };

export default function NewsList({ q }: { q?: string }) {
  const [items, setItems] = useState<ReadonlyArray<Item>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await fetch(`/api/news${q ? `?q=${encodeURIComponent(q)}` : ''}`, { cache: 'no-store' });
        const j = await r.json();
        if (!j.ok) setError(j.error || 'News API returned no data');
        setItems(j.items ?? []);
      } catch (e: any) {
        setError(e?.message || 'failed to load news');
      }
      setLoading(false);
    })();
  }, [q]);

  if (loading && items.length === 0) return <div className="muted small">Fetching headlines…</div>;
  if (error && items.length === 0) return <div className="muted small">News unavailable right now.</div>;

  return (
    <div className="news-grid">
      {items.map((n, i) => (
        <a key={i} href={n.link} target="_blank" rel="noreferrer" className="news-card">
          <div className="thumb" style={{ backgroundImage: n.image ? `url(${n.image})` : undefined }} />
          <div className="body">
            <div className="title">{n.title}</div>
            <div className="meta">{n.source} · {new Date(n.published).toLocaleString()}</div>
          </div>
        </a>
      ))}
      {items.length === 0 && <div className="muted small">No headlines matched.</div>}
    </div>
  );
}
