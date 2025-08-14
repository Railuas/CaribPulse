'use client';
import WeatherStage from "./components/WeatherStage";
import { samplePoint, sampleHourly, sampleAlerts, sampleStorms } from "../sample/fixtures";

export default function Page(){
  return (
    <main style={{padding:16}}>
      <h1 style={{margin:'8px 0 16px 0'}}>Caribbean News & Weather</h1>
      <div className="stage-wrap">
        <WeatherStage
          point={samplePoint}
          hourly={sampleHourly}
          alerts={sampleAlerts}
          storms={sampleStorms}
        />
      </div>
    </main>
  );
}
