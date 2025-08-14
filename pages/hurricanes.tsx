import Head from 'next/head';
import HurricaneTracker from '../components/HurricaneTracker';

export default function Hurricanes(){
  return (
    <>
      <Head><title>CaribePulse · Hurricanes</title></Head>
      <div className="container">
        <div className="header">
          <div className="brand"><span className="dot" /><strong>CaribePulse</strong><span className="muted">Hurricane tracker</span></div>
          <nav className="nav">
            <a href="/">Home</a>
            <a href="/hurricanes">Hurricanes</a>
          </nav>
        </div>
        <div className="stage-wrap">
          <HurricaneTracker lat={15.3} lon={-61.4} zoom={5} />
        </div>
      </div>
    </>
  );
}
