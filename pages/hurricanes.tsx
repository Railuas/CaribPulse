import Head from 'next/head'
import dynamic from 'next/dynamic'

const HurricaneTracker = dynamic(() => import('../components/HurricaneTracker'), { ssr: false });

export default function HurricanesPage(){
  return (
    <>
      <Head><title>CaribePulse · Hurricanes</title></Head>
      <main style={{padding:'18px', maxWidth:1200, margin:'0 auto'}}>
        <h1 style={{margin:'0 0 12px 0'}}>Hurricanes</h1>
        <p className="muted" style={{marginBottom:12}}>Live satellite (Zoom Earth) + radar fallback. For official warnings always consult NOAA NHC.</p>
        <div className="stage-wrap">
          <HurricaneTracker lat={16.5} lon={-61.5} zoom={5} />
        </div>
      </main>
    </>
  );
}
