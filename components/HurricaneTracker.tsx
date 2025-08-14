import { useState } from 'react';
import Link from 'next/link';

export default function HurricaneTracker({ lat = 16.0, lon = -62.0, zoom = 5 }: { lat?: number; lon?: number; zoom?: number }) {
  const [tab, setTab] = useState<'windy' | 'zoom'>('windy');
  const zoomEarth = `https://zoom.earth/#map=${zoom}z/${lat}/${lon}/satellite`;
  const windy = (() => {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      zoom: String(zoom + 1),
      overlay: 'radar',
      level: 'surface',
      marker: 'true',
      pressure: 'true',
    }).toString();
    return `https://embed.windy.com/embed2.html?${params}`;
  })();
  return (
    <section className="card">
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap:'wrap' }}>
        <button className={tab === 'windy' ? 'tab active' : 'tab'} onClick={() => setTab('windy')}>
          <span>Windy Radar</span><i className="underline" />
        </button>
        <button className={tab === 'zoom' ? 'tab active' : 'tab'} onClick={() => setTab('zoom')}>
          <span>Zoom Earth</span><i className="underline" />
        </button>
        <Link href="/" className="muted small" style={{ marginLeft: 'auto' }}>← Back to Home</Link>
        {tab==='zoom' && <a className="muted small" href={zoomEarth} target="_blank" rel="noreferrer">Open Zoom Earth ↗</a>}
      </div>
      <div className="hurr-embed">
        {tab === 'windy' ? (
          <iframe className="hurr-frame" src={windy} title="Windy Radar" loading="lazy" />
        ) : (
          <div style={{display:'grid', placeItems:'center', height:'100%', gap:12, textAlign:'center'}}>
            <div className="muted">Zoom Earth usually blocks embedding.</div>
            <a className="tab active" href={zoomEarth} target="_blank" rel="noreferrer">
              <span>Open Zoom Earth ↗</span><i className="underline" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
