export default function Hurricanes(){
  return (<main className="container py-10 space-y-6">
    <h1 className="text-3xl font-semibold">Atlantic Hurricane Tracker</h1>
    <section className="card p-5">
      <h2 className="text-xl font-semibold mb-3">Interactive cone & tracks</h2>
      <div className="aspect-video w-full rounded-xl overflow-hidden border border-neutral-800">
        <iframe title="Zoom Earth Atlantic" className="w-full h-full" src="https://zoom.earth/#19.0,-60.0,4z/overlays=labels:off;hur;radar"></iframe>
      </div>
      <div className="text-xs text-neutral-500 mt-2">Data & map by zoom.earth / NOAA.</div>
    </section>
  </main>)
}
