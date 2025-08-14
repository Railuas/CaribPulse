import dynamic from 'next/dynamic';
import IslandGrid from '../components/IslandGrid';
import NewsList from '../components/NewsList';

const WeatherStage = dynamic(() => import('../components/WeatherStage'), { ssr: false });

export default function Home() {
  return (
    <div className="grid" style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:16 }}>
      <aside className="card" style={{ height:'fit-content' }}>
        <h4 style={{ marginTop:0 }}>Islands</h4>
        <IslandGrid />
      </aside>
      <section>
        <WeatherStage
          point={{ lat: 17.3, lon: -62.73, name: 'St. Kitts & Nevis' }}
          hourly={[
            { t: Date.now(), temp: 30, wind: 10, rain: 0.5 },
            { t: Date.now()+3600_000, temp: 30, wind: 12, rain: 0.1 },
            { t: Date.now()+2*3600_000, temp: 29, wind: 11, rain: 0.0 },
          ]}
          alerts={[]}
          storms={[]}
        />
        <div className="card" style={{ marginTop: 16 }}>
          <h4 style={{ marginTop: 0 }}>Latest News</h4>
          <NewsList />
        </div>
      </section>
    </div>
  );
}
