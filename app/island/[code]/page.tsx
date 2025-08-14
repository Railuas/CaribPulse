import { ISLANDS } from '@/lib/islands'
export const dynamic = 'force-dynamic'
export default async function IslandPage({ params }: { params: { code: string } }){
  const island = ISLANDS.find(i=>i.code.toLowerCase()===params.code.toLowerCase())
  if(!island) return <main className="container py-10">Unknown island.</main>
  const dailyUrl = new URL('https://api.open-meteo.com/v1/forecast')
  dailyUrl.searchParams.set('latitude', String(island.lat))
  dailyUrl.searchParams.set('longitude', String(island.lon))
  dailyUrl.searchParams.set('daily','temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max')
  dailyUrl.searchParams.set('timezone','auto')
  const daily = await fetch(dailyUrl.toString(), { next: { revalidate: 1800 }}).then(r=>r.json())
  return (<main className="container py-8 space-y-8">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <h1 className="text-2xl md:text-3xl font-semibold">{island.name}</h1>
      <a className="btn" href="/schedules">View schedules</a>
    </div>
    <section className="card p-5">
      <h2 className="text-xl font-semibold mb-4">5‑day forecast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {daily?.daily?.time?.slice(0,5).map((t:string,idx:number)=> (
          <div key={t} className="rounded-xl border border-neutral-800 p-3">
            <div className="text-sm text-neutral-400">{new Date(t).toLocaleDateString()}</div>
            <div className="mt-2 text-2xl font-semibold">{Math.round(daily.daily.temperature_2m_max[idx])}°C</div>
            <div className="text-xs text-neutral-500">min {Math.round(daily.daily.temperature_2m_min[idx])}°C</div>
            <div className="text-xs text-neutral-500 mt-1">rain {daily.daily.precipitation_sum[idx].toFixed(1)} mm</div>
            <div className="text-xs text-neutral-500">wind {Math.round(daily.daily.wind_speed_10m_max[idx])} km/h</div>
          </div>
        ))}
      </div>
    </section>
    <section className="card p-5">
      <h2 className="text-xl font-semibold mb-4">Interactive radar & storms</h2>
      <div className="aspect-video w-full rounded-xl overflow-hidden border border-neutral-800">
        <iframe title="Zoom Earth Radar" className="w-full h-full"
          src={`https://zoom.earth/#${island.lat},${island.lon},6z/overlays=labels:off;windgusts:off;radar`}></iframe>
      </div>
      <div className="text-xs text-neutral-500 mt-2">Radar & storm tracker by zoom.earth</div>
    </section>
  </main>)
}
