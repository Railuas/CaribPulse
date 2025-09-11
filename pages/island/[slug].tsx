import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { ISLANDS } from '../../lib/islands';
import NewsList from '../../components/NewsList';

const WeatherStage = dynamic(() => import('../../components/WeatherStage'), { ssr: false });
const HurricaneTracker = dynamic(() => import('../../components/HurricaneTracker'), { ssr: false });
const IslandFerriesPanel = dynamic(() => import('../../components/IslandFerriesPanel'), { ssr: false });
const IslandMoviesPanel = dynamic(() => import('../../components/IslandMoviesPanel'), { ssr: false });
const SportsTicker = dynamic(() => import('../../components/SportsTicker'), { ssr: false });

export default function IslandHub() {
  const router = useRouter();
  const slug = (router.query.slug as string) || '';
  const island = useMemo(() => ISLANDS.find(i => i.slug === slug), [slug]);
  const [tab, setTab] = useState<'weather'|'news'|'ferries'|'hurricanes'>('weather');

  if (!island) return <div className="muted">Island not found.</div>;

  return (
    <div>
      <div className="card" style={{ marginBottom: 12, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <h3 style={{ margin: 0 }}>{island.name}</h3>
        <div className="muted small">{island.country}</div>
        <div style={{ marginLeft:'auto', display:'flex', gap:8, flexWrap:'wrap' }}>
          <button className={tab==='weather'?'tab active':'tab'} onClick={()=>setTab('weather')
      <section classNameassName="card" style={{marginTop:12}}>
        <h4 style={{margin:'0 0 8px'}}>Local Services</h4>
        <div className="muted small" style={{marginBottom:8}}>Auto-detected for {island.name}</div>
        <div className="row" style={{gap:12}}>
          <div className="col">
            <h5 style={{margin:'0 0 6px'}}>Ferries</h5>
            <IslandFerriesPanel islandName={island.name} />
          </div>
          <div className="col">
            <h5 style={{margin:'0 0 6px'}}>Movies</h5>
            <IslandMoviesPanel islandName={island.country || island.name} />
          </div>
        </div>
      </section>
    
      }><span>Weather</span><i className="underline"/></button>
          <button className={tab==='news'?'tab active':'tab'} onClick={()=>setTab('news')}><span>News</span><i className="underline"/></button>
          <button className={tab==='ferries'?'tab active':'tab'} onClick={()=>setTab('ferries')}><span>Ferries</span><i className="underline"/></button>
          <button className={tab==='hurricanes'?'tab active':'tab'} onClick={()=>setTab('hurricanes')}><span>Hurricanes</span><i className="underline"/></button>
        </div>
      </div>

      {tab==='weather' && (
  <>
    <WeatherStage
          point={{ lat: island.lat, lon: island.lon, name: island.name }}
          hourly={[{ t: Date.now(), temp: 30, wind: 10, rain: 0.5 }]}
          alerts={[]}
          storms={[]}
        />

    <section className="card" style={{marginTop:12}}>
      <h4 style={{margin:'0 0 8px'}}>Local Services</h4>
      <div className="muted small" style={{marginBottom:8}}>Auto-detected for {island.name}</div>
      <div className="row" style={{gap:12}}>
        <div className="col">
          <h5 style={{margin:'0 0 6px'}}>Ferries</h5>
          <IslandFerriesPanel islandName={island.name} />
        </div>
        <div className="col">
          <h5 style={{margin:'0 0 6px'}}>Movies</h5>
          <IslandMoviesPanel islandName={island.country || island.name} />
        </div>
      </div>
    </section>

  </>
)}
      <section className="card" style={{marginTop:12}}>
        <h4 style={{margin:'0 0 8px'}}>Local Services</h4>
        <div className="muted small" style={{marginBottom:8}}>Auto-detected for {island.name}</div>
        <div className="row" style={{gap:12}}>
          <div className="col">
            <h5 style={{margin:'0 0 6px'}}>Ferries</h5>
            <IslandFerriesPanel islandName={island.name} />
          </div>
          <div className="col">
            <h5 style={{margin:'0 0 6px'}}>Movies</h5>
            <IslandMoviesPanel islandName={island.country || island.name} />
          </div>
        </div>
      </section>
    }

      {tab==='news' && (
        <section classNameassName="card">
          <h4 style={{marginTop:0}}>Latest News: {island.name}</h4>
          <NewsList island={(island.country || island.name)} />
        </section>
      )}

      {tab==='ferries' && <IslandFerriesPanel islandName={island.name} />}
      {tab==='sports' && (
        <section classNameassName="card">
          <h4 style={{marginTop:0}}>Sports in {island.country || island.name}</h4>
          <SportsTicker country={(island.country || island.name)} />
        </section>
      )}
      {tab==='hurricanes' && <HurricaneTracker lat={island.lat} lon={island.lon} zoom={6} />}
    </div>
  );
}
