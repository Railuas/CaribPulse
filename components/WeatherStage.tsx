export type Point = { lat: number; lon: number; name?: string };

export type Alert = {
  title: string;
  severity?: string;
  startsAt?: number;
  endsAt?: number;
  description?: string;
};

export type Hour = {
  time: number;
  temp: number;
  precip?: number;
  wind?: number;
  icon?: string;
};

export type Storm = {
  name: string;
  category?: string;
  lat: number;
  lon: number;
  cone?: Array<[number, number]>;
};

export default function WeatherStage(){
  return (
    <div className="card">
      <h3 className="card-title">Weather</h3>
      <div className="muted small">Weather widget placeholder</div>
    </div>
  );
}
