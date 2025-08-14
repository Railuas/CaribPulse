import Head from 'next/head';
import { useMemo, useState } from 'react';
import WeatherStage, { type Point, type Hour, type Alert, type Storm } from '../components/WeatherStage';
import { ISLANDS, type Island } from '../lib/islands';
import { sampleHourly, sampleAlerts, sampleStorms } from '../sample/fixtures';

async function fetchHourly(p: Point): Promise<ReadonlyArray<Hour>>{
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&hourly=temperature_2m,wind_speed_10m,precipitation`;
  try{
    const r = await fetch(url, { cache: 'no-store' });
    const j = await r.json();
    const hours: ReadonlyArray<Hour> = (j?.hourly?.time ?? []).slice(0,24).map((t:string, i:number)=> ({
      t: Date.parse(t),
      temp: Number(j.hourly.temperature_2m?.[i] ?? 0),
      wind: Number(j.hourly.wind_speed_10m?.[i] ?? 0),
      rain: Number(j.hourly.precipitation?.[i] ?? 0),
    }));
    return hours;
  }catch{
    return sampleHourly;
  }
}

export default function Home(){
  const [sel, setSel] = useState<Island>(ISLANDS.find(i=>i.name.includes('Kitts')) || ISLANDS[0]);
  const point: Point = useMemo(()=>({ lat: sel.lat, lon: sel.lon, name: sel.name }), [sel]);
  const [hourly, setHourly] = useState<ReadonlyArray<Hour>>(sampleHourly);
  const alerts: ReadonlyArray<Alert> = sampleAlerts;
  const storms: ReadonlyArray<Storm> = sampleStorms;

  return (
    <>
      <Head><title>CaribePulse · News & Weather</title></Head>
      <div className="container">
        <div className="header">
          <div className="brand"><span className="dot" /><strong>CaribePulse</strong><span className="muted">News · Weather · Islands</span></div>
          <nav className="nav">
            <a href="/">Home</a>
            <a href="/hurricanes">Hurricanes</a>
            <a href="https://zoom.earth" target="_blank" rel="noreferrer">Zoom Earth</a>
          </nav>
        </div>

        <div className="layout">
          <aside className="card">
            <h4 style={{marginTop:0}}>Caribbean</h4>
            <div className="island-grid">
              {ISLANDS.map(is=> (
                <button key={is.name} className="island" onClick={async ()=>{
                  setSel(is);
                  setHourly(await fetchHourly({ lat: is.lat, lon: is.lon, name: is.name }));
                }}>
                  <span className="name">{is.name}</span>
                  <span className="sub">open</span>
                </button>
              ))}
            </div>
          </aside>

          <main className="stage-wrap">
            <WeatherStage point={point} hourly={hourly} alerts={alerts} storms={storms} />
          </main>
        </div>
      </div>
    </>
  );
}
