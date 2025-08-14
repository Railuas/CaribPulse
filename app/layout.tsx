import './globals.css'
import type { Metadata } from 'next'
export const metadata: Metadata = { title:'CaribePulse — Caribbean News & Weather', description:'Real-time weather, hurricanes, schedules, and curated headlines across the Caribbean.', icons:{ icon:'/favicon.svg' } }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>
    <header className="border-b border-neutral-800 sticky top-0 z-50" style={{backdropFilter:'blur(8px)', background:'rgba(10,10,10,.7)'}}>
      <div className="container py-3" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <a href="/" style={{display:'flex',alignItems:'center',gap:12}}>
          <img src="/favicon.svg" alt="CaribePulse" style={{height:32,width:32,borderRadius:12}}/>
          <div><div style={{fontWeight:600}}>CaribePulse</div><div style={{fontSize:12,color:'#a3a3a3'}}>News · Weather · Islands</div></div>
        </a>
        <nav style={{display:'flex',gap:16,fontSize:14,color:'#d4d4d4'}}>
          <a href="/#news">News</a><a href="/schedules">Schedules</a><a href="/hurricanes">Hurricanes</a>
        </nav>
      </div>
    </header>{children}
    <footer className="border-t border-neutral-800 mt-16"><div className="container py-10" style={{display:'grid',gap:24,gridTemplateColumns:'1fr auto'}}>
      <div><div style={{fontWeight:600,color:'#e5e5e5'}}>CaribePulse</div><div style={{color:'#a3a3a3'}}>Open‑Meteo for weather; curated RSS for news; ferries & flights via operator/public endpoints.</div></div>
      <div style={{display:'grid',gridTemplateColumns:'auto auto',gap:32}}>
        <div><div style={{color:'#d4d4d4',marginBottom:8}}>Explore</div><ul style={{display:'grid',gap:6}}><li><a href="/#news">News</a></li><li><a href="/schedules">Schedules</a></li><li><a href="/hurricanes">Hurricanes</a></li></ul></div>
        <div><div style={{color:'#d4d4d4',marginBottom:8}}>Legal</div><ul style={{display:'grid',gap:6}}><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li></ul></div>
      </div></div></footer></body></html>)
}
