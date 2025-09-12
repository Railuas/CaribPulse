type Item = { title: string; link: string; source?: string };

export default function NewsList({ items, title }: { items: Item[]; title: string }){
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