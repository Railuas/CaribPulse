import { useEffect, useState } from "react";

type Item = { title: string; link: string; source?: string; image?: string };

type Props =
  | { items: Item[]; title: string; island?: never }
  | { island?: string; title?: string; items?: never };

export default function NewsList(props: Props) {
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState<Item[] | null>(null);
  const usingIsland = typeof (props as any).island !== "undefined";

  useEffect(() => {
    if (!usingIsland) return;
    const island = (props as any).island as string | undefined;
    const run = async () => {
      setLoading(true);
      try {
        const url = island ? `/api/news?country=${encodeURIComponent(island)}` : `/api/news`;
        const r = await fetch(url);
        const json = await r.json();
        setFetched(Array.isArray(json.items) ? json.items : []);
      } catch {
        setFetched([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [usingIsland, (props as any).island]);

  const title =
    "title" in props && (props as any).title
      ? (props as any).title
      : usingIsland
      ? `Top Stories${(props as any).island ? ` — ${(props as any).island}` : " (Regional)"}`
      : "Top Stories";

  const items: Item[] =
    usingIsland ? fetched || [] : (props as { items: Item[] }).items;

  if (usingIsland && loading && (!items || items.length === 0)) {
    return (
      <section className="section">
        <h2 className="section-title">{title}</h2>
        <div className="muted small">Fetching headlines…</div>
      </section>
    );
  }

  if (!items || items.length === 0) {
    return (
      <section className="section">
        <h2 className="section-title">{title}</h2>
        <div className="muted small">No headlines available right now.</div>
      </section>
    );
  }

  return (
    <section className="section">
      <h2 className="section-title">{title}</h2>
      <div className="grid">
        {items.map((n, i) => (
          <article className="card" key={i} style={{ display:'grid', gridTemplateColumns:'120px 1fr', gap:12, alignItems:'start' }}>
            <a href={n.link} target="_blank" rel="noreferrer" style={{ display:'contents' }}>
              <div style={{ width:120, height:80, borderRadius:10, overflow:'hidden', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.08)' }}>
                {n.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={n.image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                ) : (
                  <div style={{ width:'100%', height:'100%' }} />
                )}
              </div>
              <div>
                <h3 className="card-title" style={{ margin:'0 0 6px' }}>{n.title}</h3>
                {n.source && <div className="muted small">{n.source}</div>}
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
