import dynamic from 'next/dynamic';
import IslandGrid from '../components/IslandGrid';
import CountryNews from '../components/CountryNews';

const WeatherStage = dynamic(() => import('../components/WeatherStage'), { ssr: false });

export default function Home(){
  return (
    <div className="row">
      <section className="card">
        <h3 style={{marginTop:0}}>Islands</h3>
        <IslandGrid />
      </section>
      <section className="card">
        <h3 style={{marginTop:0}}>Weather</h3>
        <WeatherStage
          point={{ lat:16.25, lon:-61.55, name:'Guadeloupe' }}
          hourly={[{t:Date.now(), temp:30, wind:12, rain:0.1}]}
          alerts={[]}
          storms={[]}
        />
      </section>
      <section className="card">
        <h3 style={{marginTop:0}}>Latest Caribbean News</h3>
        <CountryNews />
      </section>
    </div>
  );
}
