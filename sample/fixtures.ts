
export type Hour = { t:number; temp:number; wind:number; rain:number };
export type Alert = { title:string; desc?:string; severity?: 'advisory'|'watch'|'warning'|string; source?:string };
export type Storm = { name:string; category?:string; movement?:string; pressure?:number; winds?:number };

export const samplePoint = { lat: 17.3, lon: -62.73, name: "St. Kitts & Nevis" } as const;
const now = Date.now();
function rnd(n:number, spread:number){ return +(n + (Math.random()-0.5)*spread).toFixed(1); }

export const sampleHourly: ReadonlyArray<Hour> = Array.from({length:24}, (_,i)=>({ 
  t: now + i*3600_000, temp: rnd(29,3), wind: Math.max(3, rnd(12,6)), rain: Math.max(0, +(Math.random()*2).toFixed(1))
}));

export const sampleAlerts: ReadonlyArray<Alert> = [
  { title: "Heat Advisory", desc: "High temperatures and humidity could cause heat stress during the afternoon hours.", severity: "advisory", source: "Met Service" },
  { title: "Strong winds near squalls", desc: "Gusts 35–45 km/h possible in showers; small craft should exercise caution.", severity: "watch", source: "Marine Advisory" },
] as const;

export const sampleStorms: ReadonlyArray<Storm> = [
  { name: "Invest 92L", category: "Low chance", movement: "W at 10 kt", winds: 25, pressure: 1009 },
  { name: "Disturbance East of Barbados", category: "Watching", movement: "WNW at 12 kt", winds: 20, pressure: 1010 },
] as const;
