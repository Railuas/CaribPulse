
import { useEffect, useMemo, useState } from 'react';
import WeatherStage from '../components/WeatherStage';
import { ISLANDS, type Island } from '../lib/islands';
import type { Hour, Alert, Storm } from '../sample/fixtures';
import { sampleHourly, sampleAlerts, sampleStorms } from '../sample/fixtures';

type WeatherResp = {
  current: { temperature_2m:number; wind_speed_10m:number; relative_humidity_2m:number };
  hourly: { time:string[]; temperature_2m:number[]; wind_speed_10m:number[]; precipitation:number[] };
};

export default function Home(){
  const [selected, setSelected] = useState<Island>(ISLANDS.find(i=>i.code==='KN') || ISLANDS[0]);
  const [wx, setWx] = useState<WeatherResp|null>(null);

  useEffect(()=>{
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(selected.lat));
    url.searchParams.set('longitude', String(selected.lon));
    url.searchParams.set('hourly','temperature_2m,wind_speed_10m,precipitation');
    url.searchParams.set('current','temperature_2m,wind_speed_10m,relative_humidity_2m');
    url.searchParams.set('timezone','auto');
    fetch(String(url))
      .then(r=>r.json())
      .then(setWx)
      .catch(()=>setWx(null));
  }, [selected.lat, selected.lon]);

  const hourly: ReadonlyArray<Hour> = useMemo(()=>{
    if(!wx) return sampleHourly;
    const h: Hour[] = [];
    for(let i=0; i<Math.min(24, wx.hourly.time.length); i++){
      h.push({ t: Date.parse(wx.hourly.time[i]), temp: wx.hourly.temperature_2m[i], wind: wx.hourly.wind_speed_10m[i], rain: wx.hourly.precipitation[i] });
    }
    return h;
  }, [wx]);

  const kNow = {
    temp: wx?.current.temperature_2m ?? hourly[0]?.temp ?? 0,
    wind: wx?.current.wind_speed_10m ?? hourly[0]?.wind ?? 0,
    hum: wx?.current.relative_humidity_2m ?? 0,
  };

  return (
    <div>
      <header className="site-header">
        <div className="brand">🌊 CaribePulse</div>
        <nav className="nav">
          <a href="/">News</a>
          <a href="/schedules">Schedules</a>
          <a href="/hurricanes">Hurricanes</a>
        </nav>
      </header>

      <main className="container">
        <div className="grid-home">
          <aside>
            <h2 className="muted">Tap an island</h2>
            <div className="island-grid">
              {ISLANDS.map((i)=>(
                <button key={i.code} className={'island-btn ' + (selected.code===i.code?'active':'')} onClick={()=>setSelected(i)}>
                  <div className="font-semibold">{i.name}</div>
                </button>
              ))}
            </div>

            <div className="kpi-row">
              <div className="kpi-tile"><div className="label">Now</div><div className="value">{Math.round(kNow.temp)}°</div></div>
              <div className="kpi-tile"><div className="label">Wind</div><div className="value">{Math.round(kNow.wind)} km/h</div></div>
              <div className="kpi-tile"><div className="label">Humidity</div><div className="value">{Math.round(kNow.hum)}%</div></div>
            </div>
          </aside>

          <section>
            <WeatherStage
              point={{ lat:selected.lat, lon: selected.lon, name: selected.name }}
              hourly={hourly}
              alerts={sampleAlerts}
              storms={sampleStorms}
            />
          </section>
        </div>

        <section style={{marginTop:20}}>
          <h3 className="muted">Latest Headlines — {selected.name}</h3>
          <ul className="list" style={{marginTop:10}}>
            <li className="card">News feed coming next — hook your RSS or API here.</li>
          </ul>
        </section>

        <div className="footer">© {new Date().getFullYear()} CaribePulse</div>
      </main>
    </div>
  );
}
