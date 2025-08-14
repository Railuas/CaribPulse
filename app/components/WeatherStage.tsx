'use client';
import React, { useMemo, useState } from "react";

type Point = { lat: number; lon: number; name?: string };
type Hour = { t: number; temp: number; wind: number; rain: number };
type Alert = { title: string; desc?: string; severity?: "advisory"|"watch"|"warning"; source?: string };
type Storm = { name: string; category?: string; movement?: string; pressure?: number; winds?: number };

// Lightweight inline sparkline so we don't need a chart lib
function SparkInline({data, h=42, strokeWidth=2, ariaLabel}:{data:number[]; h?:number; strokeWidth?:number; ariaLabel?:string}){
  const w = Math.max(120, data.length * 16);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = (max - min) || 1;
  const pts = data.map((v,i)=>{
    const x = (i/(data.length-1||1)) * (w - 8) + 4;
    const y = h - 6 - ((v - min)/range) * (h - 12) ;
    return `${x},${y}`;
  }).join(" ");
  const last = data[data.length-1] ?? 0;
  return (
    <svg role="img" aria-label={ariaLabel} width={w} height={h} className="spark-inline">
      <polyline fill="none" stroke="currentColor" strokeWidth={strokeWidth} points={pts} />
      <circle cx={w-4} cy={h - 6 - ((last - min)/range) * (h - 12)} r={3.5} />
    </svg>
  );
}

function Kpi({label, value, sub}:{label:string; value:string; sub?:string}){
  return (
    <div className="kpi">
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

const TabButton:React.FC<{active:boolean; onClick:()=>void; children:React.ReactNode}> = ({active,onClick,children})=>{
  return (
    <button className={active? "tab active" : "tab"} onClick={onClick}>
      <span>{children}</span>
      <i className="underline" />
    </button>
  );
};

export default function WeatherStage({
  point,
  hourly,
  alerts=[],
  storms=[]
}:{ point:Point; hourly:Hour[]; alerts?:Alert[]; storms?:Storm[] }){
  const [tab, setTab] = useState<"radar"|"hourly"|"alerts"|"storms">("radar");
  const zoom = 6; // tweak if you want
  const iframeSrc = React.useMemo(()=>{
    const {lat, lon} = point || {lat:17.3, lon:-62.73};
    const params = new URLSearchParams({
      lat: String(lat ?? 17.3),
      lon: String(lon ?? -62.73),
      zoom: String(zoom),
      level: "surface",
      overlay: "radar",
      menu: "",
      message: "",
      marker: "true",
      forecast: "12",
      calendar: "",
      pressure: "true",
    }).toString();
    return `https://embed.windy.com/embed2.html?${params}`;
  }, [point?.lat, point?.lon]);

  // derive simple metrics
  const nowIdx = 0;
  const temps = hourly?.map(h=>h.temp) ?? [];
  const winds = hourly?.map(h=>h.wind) ?? [];
  const rains = hourly?.map(h=>h.rain) ?? [];
  const nowTemp = hourly?.[nowIdx]?.temp ?? 0;
  const nowWind = hourly?.[nowIdx]?.wind ?? 0;
  const nowRain = hourly?.[nowIdx]?.rain ?? 0;

  return (
    <section className="weather-stage">
      <div className="rings-bg" aria-hidden="true" />
      <header className="stage-head">
        <div className="title">
          <strong>{point?.name ?? "Weather"}</strong>
          <span className="muted">Live radar · Forecast · Alerts</span>
        </div>
        <nav className="tabs">
          <TabButton active={tab==="radar"} onClick={()=>setTab("radar")}>Radar</TabButton>
          <TabButton active={tab==="hourly"} onClick={()=>setTab("hourly")}>Hourly</TabButton>
          <TabButton active={tab==="alerts"} onClick={()=>setTab("alerts")}>Alerts</TabButton>
          <TabButton active={tab==="storms"} onClick={()=>setTab("storms")}>Storms</TabButton>
        </nav>
      </header>

      <div className="stage-body">
        {tab === "radar" && (
          <div className="panel panel-radar">
            <div className="glass kpis">
              <Kpi label="Now" value={`${Math.round(nowTemp)}°`} sub="Feels near" />
              <Kpi label="Wind" value={`${Math.round(nowWind)} km/h`} sub="10m avg" />
              <Kpi label="Rain" value={`${(nowRain).toFixed(1)} mm`} sub="next hr" />
            </div>
            <iframe className="radar-frame" src={iframeSrc} title="Live radar" loading="lazy" />
          </div>
        )}

        {tab === "hourly" && (
          <div className="panel panel-hourly">
            <div className="row">
              <div className="card">
                <h4>Temperature (12h)</h4>
                <SparkInline data={temps.slice(0,12)} ariaLabel="12 hour temperature sparkline" />
                <div className="axis">
                  <span>{Math.min(...temps)}°</span><span>{Math.max(...temps)}°</span>
                </div>
              </div>
              <div className="card">
                <h4>Wind (12h)</h4>
                <SparkInline data={winds.slice(0,12)} ariaLabel="12 hour wind sparkline" />
                <div className="axis">
                  <span>{Math.min(...winds)} km/h</span><span>{Math.max(...winds)} km/h</span>
                </div>
              </div>
              <div className="card">
                <h4>Precip (12h)</h4>
                <SparkInline data={rains.slice(0,12)} ariaLabel="12 hour precipitation sparkline" />
                <div className="axis">
                  <span>{Math.min(...rains)} mm</span><span>{Math.max(...rains)} mm</span>
                </div>
              </div>
            </div>
            <p className="muted small">Tip: click an island to recenter radar & refresh the forecast.</p>
          </div>
        )}

        {tab === "alerts" && (
          <div className="panel panel-alerts">
            {alerts.length === 0 && <div className="empty">No active advisories. 🌤️</div>}
            <ul className="alerts">
              {alerts.map((a, i)=>(
                <li key={i} className={`alert ${a.severity ?? "advisory"}`}>
                  <div className="pill">{(a.severity ?? "advisory").toUpperCase()}</div>
                  <div className="alert-body">
                    <h5>{a.title}</h5>
                    {a.desc && <p>{a.desc}</p>}
                    {a.source && <span className="src">{a.source}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "storms" && (
          <div className="panel panel-storms">
            {storms.length === 0 && <div className="empty">No active named storms in the basin.</div>}
            <div className="ticker" role="list">
              {storms.map((s, i)=>(
                <div role="listitem" key={i} className="storm-card">
                  <div className="spin-dot" aria-hidden />
                  <div className="storm-name">{s.name}</div>
                  <div className="storm-meta">
                    {s.category && <span>{s.category}</span>}
                    {typeof s.winds === "number" && <span>{s.winds} kt</span>}
                    {typeof s.pressure === "number" && <span>{s.pressure} mb</span>}
                    {s.movement && <span>{s.movement}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
