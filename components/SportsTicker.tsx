
import { useEffect, useState } from 'react';

type Event = { idEvent: string; strEvent: string; dateEvent: string; strTime: string; strLeague?: string };

export default function SportsTicker({ country }: { country: string }){
  const [today, setToday] = useState<Event[]>([]);
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    (async ()=>{
      setLoading(true);
      try{
        const u = new URLSearchParams({ country });
        const res = await fetch(`/api/sports?${u.toString()}`);
        const data = await res.json();
        setToday(data.today || []);
        setUpcoming((data.upcoming || []).slice(0, 10));
      }finally{
        setLoading(false);
      }
    })();
  }, [country]);

  if (loading) return <div className="muted small">Loading sports…</div>;

  const fmt = (d:string, t:string) => {
    try{
      if (!d) return '';
      const iso = `${d}T${(t||'00:00:00').slice(0,8)}`;
      return new Date(iso).toLocaleString();
    }catch{return `${d} ${t}`;}
  };

  return (
    <div>
      <div className="muted small" style={{marginBottom:8}}>Source: TheSportsDB</div>
      <div className="news-grid">
        {today.map(ev => (
          <div className="news-card" key={ev.idEvent} style={{ cursor:'default' }}>
            <div className="body">
              <div className="title">{ev.strEvent}</div>
              <div className="meta">Today · {fmt(ev.dateEvent, ev.strTime)} {ev.strLeague ? `· ${ev.strLeague}` : ''}</div>
            </div>
          </div>
        ))}
        {today.length === 0 && <div className="muted small">No events today.</div>}
      </div>
      {upcoming.length > 0 && (
        <div style={{marginTop:12}}>
          <h5 style={{margin:'12px 0 8px'}}>Upcoming</h5>
          <div className="news-grid">
            {upcoming.map(ev => (
              <div className="news-card" key={ev.idEvent} style={{ cursor:'default' }}>
                <div className="body">
                  <div className="title">{ev.strEvent}</div>
                  <div className="meta">{fmt(ev.dateEvent, ev.strTime)} {ev.strLeague ? `· ${ev.strLeague}` : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
