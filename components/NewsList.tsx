import { useEffect, useState } from "react";

type Item = { title: string; link: string; source?: string; image?: string };

type Props =
  | { items: Item[]; title: string; island?: never }
  | { island?: string; title?: string; items?: never };

function decodeEntities(s: string){
  if (!s) return s;
  // browser-safe decode using textarea
  if (typeof window !== 'undefined'){
    const el = document.createElement('textarea');
    el.innerHTML = s;
    return el.value;
  }
  // fallback (node) – strip common patterns
  return s.replace(/&#(\d+);/g, (_,n)=> String.fromCharCode(parseInt(n,10)))
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
}

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
      <div className="grid news-grid">
        {items.map((n, i) => (
          <article className="card news-card" key={i}>
            <a href={n.link} target="_blank" rel="noreferrer">
              <div className="thumb">
                {n.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={n.image} alt="" />
                ) : (
                  <div className="fallback" />
                )}
              </div>
              <h3 className="card-title" style={{ margin:'10px 0 6px' }}>{decodeEntities(n.title)}</h3>
              {n.source && <div className="muted small">{n.source}</div>}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
