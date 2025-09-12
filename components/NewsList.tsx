import { useEffect, useState } from "react";

type Item = { title: string; link: string; source?: string };

// Supports EITHER:
//  A) <NewsList items={...} title="..."/>
//  B) <NewsList island="Jamaica" />  // will fetch /api/news?country=Jamaica
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
        const url = island
          ? `/api/news?country=${encodeURIComponent(island)}`
          : `/api/news`;
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
    "title" in props && props.title
      ? props.title
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

  if (items.length === 0) {
    return (
      <section className="section">
        <h2 className="section-title">{title}</h2>
        <div className="muted small">
          No headlines available right now.
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <h2 className="section-title">{title}</h2>
      <div className="grid">
        {items.map((n, i) => (
          <article className="card" key={i}>
            <a href={n.link} target="_blank" rel="noreferrer">
              <h3 className="card-title">{n.title}</h3>
              {n.source && <div className="muted small">{n.source}</div>}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
