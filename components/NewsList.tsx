import { useEffect, useState } from 'react';

type Item = { title: string; link: string; source: string; published: number };

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
    <div className="news-list">
      {items.length === 0 && <div className="muted">Fetching headlines…</div>}
      {items.map((n, i) => (
        <article key={i} className="news-item" style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <a href={n.link} target="_blank" rel="noreferrer">
            {n.title}
          </a>
          <div className="meta muted small">
            {n.source} · {new Date(n.published).toLocaleString()}
          </div>
        </article>
      ))}
    </div>
  );
}
