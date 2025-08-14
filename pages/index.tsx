import Head from 'next/head';
import { useState } from 'react';
import WeatherStage from '../components/WeatherStage';
import { samplePoint, sampleHourly, sampleAlerts, sampleStorms } from '../sample/fixtures';

type Island = { name:string, lat:number, lon:number };

const ISLANDS: Island[] = [
  { name:'Anguilla', lat:18.22, lon:-63.06 },
  { name:'Antigua & Barbuda', lat:17.08, lon:-61.82 },
  { name:'Aruba', lat:12.52, lon:-69.98 },
  { name:'Bahamas', lat:25.03, lon:-77.40 },
  { name:'Barbados', lat:13.10, lon:-59.62 },
  { name:'Belize', lat:17.50, lon:-88.20 },
  { name:'Cayman Islands', lat:19.31, lon:-81.25 },
  { name:'Cuba', lat:21.52, lon:-77.78 },
  { name:'Dominica', lat:15.30, lon:-61.39 },
  { name:'Dominican Republic', lat:18.74, lon:-70.16 },
  { name:'Grenada', lat:12.05, lon:-61.75 },
  { name:'Guadeloupe', lat:16.23, lon:-61.56 },
  { name:'Guyana (Caribbean)', lat:6.80, lon:-58.16 },
  { name:'Haiti', lat:18.97, lon:-72.29 },
  { name:'Jamaica', lat:18.11, lon:-77.30 },
  { name:'Martinique', lat:14.67, lon:-61.02 },
  { name:'Montserrat', lat:16.72, lon:-62.19 },
  { name:'Puerto Rico', lat:18.22, lon:-66.59 },
  { name:'St. Kitts & Nevis', lat:17.30, lon:-62.73 },
  { name:'St. Lucia', lat:13.91, lon:-60.97 },
  { name:'Sint Maarten (Dutch)', lat:18.04, lon:-63.06 },
  { name:'Turks & Caicos', lat:21.80, lon:-71.80 },
];

export default function Home(){
  const [selected, setSelected] = useState<ISLANDS[number]>(ISLANDS.find(x=>x.name==='St. Kitts & Nevis') || ISLANDS[0]);
  return (
    <>
      <Head>
        <title>CaribePulse · News & Weather</title>
      </Head>
      <header className="header">
        <div className="brand">
          <strong>CaribePulse</strong>
          <span className="muted">News · Weather · Islands</span>
        </div>
        <nav className="nav">
          <a className="btn" href="/schedules">Schedules</a>
          <a className="btn" href="/hurricanes">Hurricanes</a>
        </nav>
      </header>

      <main className="container">
        <section className="section">
          <h1>Caribbean News & Weather</h1>
          <h2>Tap an island to load weather and headlines. Open its page for radar & alerts.</h2>
        </section>

        <section className="section">
          <div className="grid">
            {ISLANDS.map((i)=>(
              <button key={i.name} className={selected.name===i.name? 'tile active':'tile'} onClick={()=>setSelected(i)}>{i.name}</button>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="stage-wrap">
            <WeatherStage
              point={{ lat:selected.lat, lon:selected.lon, name:selected.name }}
              hourly={sampleHourly}
              alerts={sampleAlerts}
              storms={sampleStorms}
            />
          </div>
        </section>
      </main>
    </>
  );
}
