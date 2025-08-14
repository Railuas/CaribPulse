import React, { useState, useMemo } from 'react';

export default function HurricaneTracker({ lat=15.3, lon=-61.4, zoom=5 }:{ lat?:number; lon?:number; zoom?:number }){
  const [tab, setTab] = useState<'zoom'|'windy'>('zoom');
  const zoomEarthUrl = useMemo(()=>{
    return `https://zoom.earth/#map=${zoom}z/${lat}/${lon}/satellite`;
  }, [lat, lon, zoom]);
  const windyUrl = useMemo(()=>{
    const p = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      zoom: String(zoom+1),
      overlay: 'satellite',
      level:'surface',
      marker:'true',
    }).toString();
    return `https://embed.windy.com/embed2.html?${p}`;
  }, [lat, lon, zoom]);

  return (
    <section className="weather-stage">
      <div className="stage-head">
        <div className="title"><strong>Hurricane tracker</strong><span className="muted">Zoom Earth · Windy</span></div>
        <nav className="tabs">
          <button className={tab==='zoom'?'tab active':'tab'} onClick={()=>setTab('zoom')}><span>Zoom Earth</span><i className="underline"/></button>
          <button className={tab==='windy'?'tab active':'tab'} onClick={()=>setTab('windy')}><span>Windy</span><i className="underline"/></button>
        </nav>
      </div>
      <div className="stage-body">
        {tab === 'zoom' && (
          <div className="panel panel-radar">
            <iframe className="radar-frame" src={zoomEarthUrl} title="Zoom Earth" loading="lazy" />
            <p className="muted small">If the embed is blocked, <a href={zoomEarthUrl} target="_blank" rel="noreferrer">open Zoom Earth in a new tab</a>.</p>
          </div>
        )}
        {tab === 'windy' && (
          <div className="panel panel-radar">
            <iframe className="radar-frame" src={windyUrl} title="Windy" loading="lazy" />
          </div>
        )}
      </div>
    </section>
  );
}
