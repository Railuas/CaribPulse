import WeatherStage from "../components/WeatherStage";
import { samplePoint, sampleHourly, sampleAlerts, sampleStorms } from "../sample/fixtures";

export default function Home(){
  return (
    <main style={{padding:16}}>
      <h1>CaribePulse</h1>
      <div className="stage-wrap">
        <WeatherStage point={samplePoint} hourly={sampleHourly} alerts={sampleAlerts} storms={sampleStorms} />
      </div>
    </main>
  );
}
