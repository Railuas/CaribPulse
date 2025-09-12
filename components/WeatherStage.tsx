export type Point = { lat: number; lon: number; name?: string };

export type Alert = {
  title: string;
  severity?: string;          // e.g. "advisory", "watch", "warning"
  startsAt?: number;          // epoch ms
  endsAt?: number;            // epoch ms
  description?: string;
};

export type Hour = {
  time: number;               // epoch ms
  temp: number;               // °C or °F depending on your app
  precip?: number;            // mm or in
  wind?: number;              // kph or mph
  icon?: string;              // optional icon key
};

export type Storm = {
  name: string;
  category?: string;          // e.g. "TS", "Cat 1", etc.
  lat: number;
  lon: number;
  cone?: Array<[number, number]>; // optional forecast cone as [lat, lon] pairs
};

// Minimal placeholder component so the site builds and renders.
// Your real WeatherStage can import and re-export these same types later.
export default function WeatherStage() {
  return (
    <div className="card">
      <h3 className="card-title">Weather</h3>
      <div className="muted small">Live weather widget loading…</div>
    </div>
  );
}
