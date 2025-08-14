export default function Hurricanes(){
  return (<main className="container py-10 space-y-6">
    <h1 className="text-3xl font-semibold">Atlantic Hurricane Tracker</h1>
    <section className="card p-5">
      <h2 className="text-xl font-semibold mb-3">Interactive basin map</h2>
      <div className="aspect-video w-full rounded-xl overflow-hidden border border-neutral-800">
        <iframe title="Atlantic storms" className="w-full h-full"
          src="https://embed.windy.com/embed2.html?lat=18&lon=-61&zoom=5&level=surface&overlay=wind&menu=&marker=&calendar=&pressure=&type=map&location=coordinates"></iframe>
      </div>
      <div className="text-xs text-neutral-500 mt-2">Interactive map by windy.com. For official advisories see <a className="underline" target="_blank" href="https://www.nhc.noaa.gov/">nhc.noaa.gov</a>.</div>
    </section>
  </main>)
}
