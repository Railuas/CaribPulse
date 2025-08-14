'use client';
import React, { useMemo, useState } from 'react';

type Props = { lat?: number; lon?: number; zoom?: number };

const Tab: React.FC<{active:boolean; onClick:()=>void; children:React.ReactNode}> = ({active,onClick,children}) => (
  <button className={active? "tab active" : "tab"} onClick={onClick}>
    <span>{children}</span>
    <i className="underline" />
  </button>
);

export default function HurricaneTracker({ lat=16.5, lon=-61.5, zoom=5 }: Props){
  const [tab, setTab] = useState<"zoom"|"windy">("zoom");

  // Zoom Earth – build a simple centered URL
  const zoomEarthSrc = useMemo(()=>{
    const z = Math.max(3, Math.min(10, zoom));
    // Note: Zoom Earth URL patterns vary; this generic one centers + zooms on the Caribbean.
    // If Zoom Earth blocks iframes in your environment, the Windy tab remains available.
    return `https://zoom.earth/#map=${z}z/${lat}/${lon}/satellite`;
  }, [lat, lon, zoom]);

  // Windy fallback (radar overlay)
  const windySrc = useMemo(()=>{
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      zoom: String(zoom ?? 5),
      level: "surface",
      overlay: "radar",
      marker: "true",
      pressure: "true",
      menu: "",
      message: "",
      calendar: "",
      forecast: "12"
    }).toString();
    return `https://embed.windy.com/embed2.html?${params}`;
  }, [lat, lon, zoom]);

  return (
    <section className="weather-stage">
      <div className="rings-bg" aria-hidden="true" />
      <header className="stage-head">
        <div className="title">
          <strong>Hurricane Tracker</strong>
          <span className="muted">Zoom Earth · Radar · Official advisories</span>
        </div>
        <nav className="tabs">
          <Tab active={tab==="zoom"} onClick={()=>setTab("zoom")}>Zoom Earth</Tab>
          <Tab active={tab==="windy"} onClick={()=>setTab("windy")}>Windy Radar</Tab>
        </nav>
      </header>

      <div className="stage-body">
        {tab === "zoom" && (
          <div className="panel panel-radar">
            <iframe
              className="radar-frame"
              title="Zoom Earth – Hurricanes"
              src={zoomEarthSrc}
              referrerPolicy="no-referrer"
              loading="lazy"
              allow="fullscreen"
            />
          </div>
        )}
        {tab === "windy" && (
          <div className="panel panel-radar">
            <iframe
              className="radar-frame"
              title="Windy Radar"
              src={windySrc}
              loading="lazy"
            />
          </div>
        )}
      </div>

      <footer className="panel-links">
        <a target="_blank" rel="noreferrer" href="https://www.nhc.noaa.gov/">NOAA NHC Advisory</a>
        <a target="_blank" rel="noreferrer" href="https://tropic.ssec.wisc.edu/real-time/westatlantic/westatlantic.html">CIMSS Tropical</a>
        <a target="_blank" rel="noreferrer" href="https://zoom.earth/">Open on Zoom Earth</a>
      </footer>
    </section>
  );
}
