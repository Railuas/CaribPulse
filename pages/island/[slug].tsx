import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { ISLANDS } from '../../lib/islands';
import dynamic from 'next/dynamic';
import NewsList from '../../components/NewsList';

const WeatherStage = dynamic(() => import('../../components/WeatherStage'), { ssr: false });
const HurricaneTracker = dynamic(() => import('../../components/HurricaneTracker'), { ssr: false });

export default function IslandHub() {
  const router = useRouter();
  const slug = (router.query.slug as string) || '';
  const island = useMemo(() => ISLANDS.find(i => i.slug === slug), [slug]);
  const [tab, setTab] = useState<'weather'|'news'|'schedules'|'hurricanes'>('weather');

  if (!island) return <div className="muted">Island not found.</div>;

  return (
    <div>
      <div className="card" style={{ marginBottom: 12, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <h3 style={{ margin: 0 }}>{island.name}</h3>
        <div className="muted small">{island.country}</div>
        <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
          <button className={tab==='weather'?'tab active':'tab'} onClick={()=>setTab('weather')}><span>Weather</span><i className="underline"/></button>
          <button className={tab==='news'?'tab active':'tab'} onClick={()=>setTab('news')}><span>News</span><i className="underline"/></button>
          <button className={tab==='schedules'?'tab active':'tab'} onClick={()=>setTab('schedules')}><span>Schedules</span><i className="underline"/></button>
          <button className={tab==='hurricanes'?'tab active':'tab'} onClick={()=>setTab('hurricanes')}><span>Hurricanes</span><i className="underline"/></button>
        </div>
      </div>

      {tab==='weather' && (
        <WeatherStage
          point={{ lat: island.lat, lon: island.lon, name: island.name }}
          hourly={[
            { t: Date.now(), temp: 30, wind: 10, rain: 0.5 },
            { t: Date.now()+3600_000, temp: 30, wind: 12, rain: 0.1 },
            { t: Date.now()+2*3600_000, temp: 29, wind: 11, rain: 0.0 },
          ]}
          alerts={[]}
          storms={[]}
        />
      )}

      {tab==='news' && (
        <section className="card">
          <h4 style={{marginTop:0}}>Latest News</h4>
          <NewsList q={island.name} />
        </section>
      )}

      {tab==='schedules' && (
        <IslandSchedules icao={island.icao ?? 'TKPK'} />
      )}

      {tab==='hurricanes' && (
        <HurricaneTracker lat={island.lat} lon={island.lon} zoom={6} />
      )}
    </div>
  );
}

function mapRows(type: 'arrivals' | 'departures', data: any) {
  const arr = (data?.arrivals || data?.departures || []) as any[];
  return arr.slice(0, 30).map((x: any) => {
    const leg = x?.movement || {};
    const airline = x?.airline?.name || x?.airline?.iata || '';
    const flight =
      (x?.number || '') +
      (x?.codeshareStatus === 'IsCodeshare' && x?.codeshares?.[0]?.number
        ? ` (${x.codeshares[0].number})`
        : '');
    const sched = x?.scheduledTimeLocal || x?.scheduledTime;
    const est = x?.estimatedTimeLocal || x?.estimatedTime;
    const status = x?.status || '';
    const other =
      type === 'arrivals'
        ? leg?.origin?.iata || leg?.origin?.name || ''
        : leg?.destination?.iata || leg?.destination?.name || '';
    return { time: sched?.slice(11, 16), estTime: est?.slice(11, 16), flight, airline, other, status };
  });
}

function Table({ rows, title }:{ rows:ReadonlyArray<any>; title:string }){
  return (
    <section className="card" style={{ marginTop: 12 }}>
      <h4 style={{ marginTop: 0 }}>{title}</h4>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse:'collapse' }}>
          <thead><tr><th>Sched</th><th>Est</th><th>Flight</th><th>Airline</th><th>Route</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} style={{ borderTop:'1px solid rgba(255,255,255,.08)' }}>
                <td>{r.time ?? '-'}</td><td>{r.estTime ?? '-'}</td><td>{r.flight ?? '-'}</td>
                <td>{r.airline ?? '-'}</td><td>{r.other ?? '-'}</td><td>{r.status ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
function IslandSchedules({ icao }:{ icao:string }){
  const [tab, setTab] = useState<'arrivals'|'departures'>('arrivals');
  const [rows, setRows] = useState<ReadonlyArray<any>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const run = async()=>{
      setLoading(true);
      try{
        const r = await fetch(`/api/flights?icao=${icao}&type=${tab}`);
        const j = await r.json();
        setRows(mapRows(tab, j.data));
      }catch(e){ console.error(e); } finally{ setLoading(false); }
    };
    run();
  }, [icao, tab]);

  return (
    <div>
      <div className="card" style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <strong>Airport: {icao}</strong>
        <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
          <button className={tab==='arrivals'?'tab active':'tab'} onClick={()=>setTab('arrivals')}><span>Arrivals</span><i className="underline"/></button>
          <button className={tab==='departures'?'tab active':'tab'} onClick={()=>setTab('departures')}><span>Departures</span><i className="underline"/></button>
        </div>
      </div>
      <Table rows={rows} title={`${tab[0].toUpperCase()+tab.slice(1)} for ${icao}`} />
      {loading && <div className="muted small" style={{marginTop:8}}>Loading…</div>}
      {!loading && rows.length===0 && <div className="muted small" style={{marginTop:8}}>No data.</div>}
    </div>
  );
}
