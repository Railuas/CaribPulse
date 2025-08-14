import Link from 'next/link';
import { ISLANDS } from '../lib/islands';

export default function IslandGrid() {
  return (
    <div className="island-grid">
      {ISLANDS.map(island => (
        <article key={island.slug} className="island-card">
          <h4>{island.name}</h4>
          <div className="island-meta">{island.country}</div>
          <div className="island-actions">
            <Link className="tab active" href={`/island/${island.slug}`}>
              <span>Open</span><i className="underline" />
            </Link>
            <a className="tab" href={`https://zoom.earth/#map=6z/${island.lat}/${island.lon}/satellite`} target="_blank" rel="noreferrer">
              <span>Zoom Earth ↗</span><i className="underline" />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
