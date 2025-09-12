import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useState } from 'react';

export default function WeatherDetail(){
  const { query } = useRouter();
  const country = typeof query.country === 'string' ? query.country : undefined;
  const title = country ? `Weather — ${country}` : 'Weather';
  const [tab, setTab] = useState<'current'|'hourly'|'radar'>('radar');

  const hourly = Array.from({length:12}, (_,i)=> ({
    t: i === 0 ? 'Now' : `${i}h`,
    temp: 29 + Math.round((Math.random()-0.5)*4),
    wind: 8 + Math.round(Math.random()*10),
    precip: Math.max(0, +(Math.random()*4).toFixed(1))
  }));

  return (
    <Layout>
      <Head><title>{title} | Magnetide</title></Head>
      <h1>{title}</h1>
      <div style={{display:'flex', gap:10, margin:'10px 0 16px'}}>
        <button className={tab==='radar'?'btn': 'btn'} onClick={()=>setTab('radar')}>Radar / Windy</button>
        <button className={tab==='current'?'btn': 'btn'} onClick={()=>setTab('current')}>Current</button>
        <button className={tab==='hourly'?'btn': 'btn'} onClick={()=>setTab('hourly')}>Hourly</button>
      </div>

      {tab==='radar' && (
        <div className="card" style={{padding:0, overflow:'hidden'}}>
          <iframe
            title="Windy map"
            width="100%"
            height="560"
            src="https://embed.windy.com/embed2.html?lat=15.0&lon=-65.0&detailLat=15.0&detailLon=-65.0&zoom=5&level=surface&overlay=wind&product=ecmwf&menu=true&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=kt&metricTemp=%C2%B0C&radarRange=-1"
            loading="lazy"
            style={{border:0}}
          />
        </div>
      )}

      {tab==='current' && (
        <div className="grid trio">
          <div className="card"><div className="muted small">Temperature</div><div style={{fontSize:32,fontWeight:800}}>30°</div></div>
          <div className="card"><div className="muted small">Wind</div><div style={{fontSize:32,fontWeight:800}}>14 kt</div></div>
          <div className="card"><div className="muted small">Humidity</div><div style={{fontSize:32,fontWeight:800}}>72%</div></div>
        </div>
      )}

      {tab==='hourly' && (
        <div className="card">
          <table className="table">
            <thead><tr><th>Time</th><th>Temp</th><th>Wind (kt)</th><th>Precip (mm)</th></tr></thead>
            <tbody>
              {hourly.map((h,i)=>(
                <tr key={i}><td>{h.t}</td><td>{h.temp}°</td><td>{h.wind}</td><td>{h.precip}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
