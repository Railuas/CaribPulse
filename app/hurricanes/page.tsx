import Parser from 'rss-parser'
export const dynamic = 'force-dynamic'
async function getAdvisories(){
  const parser = new Parser()
  try{
    const feed = await parser.parseURL('https://www.nhc.noaa.gov/gtwo.xml')
    return feed.items?.slice(0,10) || []
  }catch{ return [] }
}
export default async function Hurricanes(){
  const items = await getAdvisories()
  return (<main className="container py-10">
    <h1 className="text-3xl font-semibold">Atlantic Hurricane Tracker</h1>
    <p className="text-neutral-400 mt-2">Live basin map from the U.S. National Hurricane Center plus latest outlooks.</p>
    <div className="card p-4 mt-4">
      <img src="https://www.nhc.noaa.gov/xgtwo/two_atl_2d0.png" alt="Atlantic Tropical Weather Outlook" className="w-full rounded-xl"/>
    </div>
    <section className="mt-8">
      <h2 className="text-xl font-semibold">Latest advisories</h2>
      <div className="grid md:grid-cols-2 gap-4 mt-3">
        {items.map((it,idx)=> (<a key={idx} href={it.link||'#'} target="_blank" className="card p-4 hover:bg-neutral-900 transition"><div className="text-sm text-neutral-400">{it.creator||'NHC'}</div><div className="font-medium mt-1">{it.title}</div><div className="text-xs text-neutral-500 mt-2">{it.pubDate}</div></a>))}
      </div>
    </section>
  </main>)
}
