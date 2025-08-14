import { useState } from 'react';

export default function HurricaneTracker({ lat = 16.0, lon = -62.0, zoom = 5 }: { lat?: number; lon?: number; zoom?: number }) {
  const [tab, setTab] = useState<'zoom' | 'windy'>('zoom');
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
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        <button className={tab === 'zoom' ? 'tab active' : 'tab'} onClick={() => setTab('zoom')}>
          <span>Zoom Earth</span><i className="underline" />
        </button>
        <button className={tab === 'windy' ? 'tab active' : 'tab'} onClick={() => setTab('windy')}>
          <span>Windy Radar</span><i className="underline" />
        </button>
        {tab === 'zoom' && (
          <a href={zoomEarth} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto' }} className="muted small">
            Open Zoom Earth ↗
          </a>
        )}
      </div>
      <div className="hurr-embed">
        {tab === 'zoom' ? (
          <iframe className="hurr-frame" src={zoomEarth} title="Zoom Earth" loading="lazy" />
        ) : (
          <iframe className="hurr-frame" src={windy} title="Windy Radar" loading="lazy" />
        )}
      </div>
      <style jsx>{`
        .hurr-embed{ position:relative; width:100%; height:60vh; min-height:420px; border-radius:12px; overflow:hidden; }
        .hurr-frame{ position:absolute; inset:0; width:100%; height:100%; border:0; box-shadow: inset 0 0 0 1px rgba(255,255,255,.08); background:#000; }
      `}</style>
    </section>
  );
}
