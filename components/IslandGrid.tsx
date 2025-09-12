import Link from 'next/link';
import { ISLANDS } from '../lib/islands';

export default function IslandGrid(){
  return (
    <div className="island-grid">
      {ISLANDS.map(i => (
        <div key={i.slug} className="island-card" data-animate="fade">
          <h4>{i.name}</h4>
          <div className="island-meta">{i.country || ''}</div>
          <div className="island-actions">
            <Link href={`/island/${i.slug}`} className="tab active"><span>Open</span><i className="underline" /></Link>
          </div>
        </div>
      ))}
    </div>
  );
}
