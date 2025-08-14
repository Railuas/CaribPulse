import WeatherStage from './components/WeatherStage';
import { samplePoint, sampleHourly, sampleAlerts, sampleStorms } from '../sample/fixtures';

export default function Page(){
  return (
    <div style={{display:'grid', gridTemplateColumns:'360px 1fr', gap:'20px', alignItems:'start'}}>
      <div>
        <h2 style={{marginTop:0}}>Caribbean News & Weather</h2>
        <p className="muted">Tap an island on the left list to refresh the panel.</p>
      </div>
      <div className="stage-wrap">
        <WeatherStage
          point={samplePoint}
          hourly={sampleHourly}
          alerts={sampleAlerts}
          storms={sampleStorms}
        />
      </div>
    </div>
  )
}
