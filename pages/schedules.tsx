import { useEffect, useState } from 'react';
import FlightsTable from '../components/FlightsTable';

type ApiResp = { icao: string; type: 'arrivals' | 'departures'; data: any };

const AIRPORTS = [
  { code: 'TKPK', name: 'St. Kitts (Robert L. Bradshaw)' },
  { code: 'TDPD', name: 'Dominica (Douglas–Charles)' },
  { code: 'TJSJ', name: 'San Juan (Luis Muñoz Marín)' },
  { code: 'TBPB', name: 'Barbados (Grantley Adams)' },
  { code: 'TTPP', name: 'Trinidad (Piarco)' },
  { code: 'MKJP', name: 'Jamaica (Norman Manley)' },
];

function mapRows(type: 'arrivals' | 'departures', data: any) {
  const arr = (data?.arrivals || data?.departures || []) as any[];
  return arr.slice(0, 50).map((x: any) => {
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

export default function Schedules() {
  const [icao, setIcao] = useState('TKPK');
  const [tab, setTab] = useState<'arrivals' | 'departures'>('arrivals');
  const [rows, setRows] = useState<ReadonlyArray<any>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/flights?icao=${icao}&type=${tab}`);
        const j: ApiResp = await r.json();
        const mapped = mapRows(tab, j.data);
        setRows(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [icao, tab]);

  return (
    <div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <strong>Airport:</strong>
          <select
            value={icao}
            onChange={(e) => setIcao(e.target.value)}
            style={{
              background: 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,.2)',
              padding: '8px',
              borderRadius: 8,
            }}
          >
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.name} ({a.code})
              </option>
            ))}
          </select>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className={tab === 'arrivals' ? 'tab active' : 'tab'} onClick={() => setTab('arrivals')}>
              <span>Arrivals</span>
              <i className="underline" />
            </button>
            <button className={tab === 'departures' ? 'tab active' : 'tab'} onClick={() => setTab('departures')}>
              <span>Departures</span>
              <i className="underline" />
            </button>
          </div>
        </div>
      </div>
      <FlightsTable rows={rows} title={`${tab[0].toUpperCase() + tab.slice(1)} for ${icao}`} />
      {loading && <div className="muted small" style={{ marginTop: 8 }}>Loading…</div>}
      {!loading && rows.length === 0 && <div className="muted small" style={{ marginTop: 8 }}>No data.</div>}
    </div>
  );
}
