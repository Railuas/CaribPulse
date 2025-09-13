// pages/movies/index.tsx
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useEffect, useMemo, useState } from 'react';

type Item = { cinema: string; url: string; title: string; times: string[] };
type DayFilter = 'today' | 'tomorrow' | 'all';

type Extra = { poster?: string; trailer?: string };

function TimePill({ t }: { t: string }) {
  return (
    <span
      className="time-pill"
      style={{
        display:'inline-flex',alignItems:'center',justifyContent:'center',
        padding:'6px 10px',border:'1px solid var(--border)',borderRadius:10,
        fontSize:12,marginRight:6,marginBottom:6,whiteSpace:'nowrap',
        background:'rgba(255,255,255,.04)',
        transition:'all .12s ease'
      }}
      title={`Showtime: ${t}`}
    >
      {t}
    </span>
  );
}

function SkeletonCard(){
  return (
    <article className="card" style={{minHeight:160}}>
      <div style={{height:14,width:'40%',background:'rgba(255,255,255,.06)',borderRadius:6,marginBottom:10}}/>
      <div style={{height:10,width:'70%',background:'rgba(255,255,255,.06)',borderRadius:6,marginBottom:6}}/>
      <div style={{height:10,width:'55%',background:'rgba(255,255,255,.06)',borderRadius:6,marginBottom:6}}/>
    </article>
  );
}

export default function Movies() {
  const router = useRouter();
  const country = typeof router.query.country === 'string' ? router.query.country : 'All Caribbean';

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState<DayFilter>('today');
  const [extras, setExtras] = useState<Record<string, Extra>>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      try{
        const r = await fetch(`/api/movies?country=${encodeURIComponent(country)}`);
        const j = await r.json();
        setItems(Array.isArray(j.items) ? j.items : []);
      } finally {
        setLoading(false);
      }
    })();
  }, [country]);

  useEffect(() => {
    (async () => {
      const out: Record<string, Extra> = {};
      for(const it of items){
        const q = encodeURIComponent(it.title);
        try{
          const omdb = await fetch(`https://www.omdbapi.com/?t=${q}&apikey=demo`);
          const oj = await omdb.json();
          if(oj?.Poster && oj.Poster !== 'N/A') out[it.title] = { poster: oj.Poster };
          out[it.title] = { ...out[it.title], trailer: `https://www.youtube.com/results?search_query=${q}+trailer` };
        }catch{}
      }
      setExtras(out);
    })();
  }, [items]);

  const countries = [
    'All Caribbean','Puerto Rico','Dominican Republic','Trinidad and Tobago','Jamaica',
    'Barbados','Bahamas','Antigua and Barbuda','Sint Maarten','Saint Martin',
    'Saint Lucia','Curaçao','Guyana'
  ];

  function keepByDay(times: string[], day: DayFilter): string[] {
    if (day === 'all') return times;
    const now = new Date();
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const offset = day === 'today' ? 0 : 1;
    const start = new Date(base.getTime() + offset * 86400000);
    const end = new Date(start.getTime() + 86400000);

    function asDate(t:string){
      const m = t.trim().toUpperCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/);
      if(!m) return null;
      let h = parseInt(m[1],10), min = m[2]?parseInt(m[2],10):0;
      const ampm = m[3]||null;
      if(ampm){
        const isPM = ampm==='PM';
        if(h===12) h=isPM?12:0; else if(isPM) h+=12;
      }
      const d = new Date(start); d.setHours(h,min,0,0); return d;
    }
    return times.filter(t => { const d = asDate(t); return d ? d>=start && d<end : true; });
  }

  const grouped = useMemo(() => {
    const map = new Map<string,{url:string,movies:{title:string,times:string[]}[]}>();
    for(const it of items){
      const filtered = keepByDay(it.times, day);
      if(filtered.length===0) continue;
      if(!map.has(it.cinema)) map.set(it.cinema,{url:it.url,movies:[]});
      map.get(it.cinema)!.movies.push({title:it.title,times:filtered});
    }
    return Array.from(map.entries()).map(([cinema,v])=>({cinema,url:v.url,movies:v.movies}));
  },[items,day]);

  const title = `Movies — ${country}`;
  const onPickCountry = (c:string)=> router.replace({pathname:'/movies',query:c==='All Caribbean'?{}:{country:c}},undefined,{shallow:true});

  return (
    <Layout>
      <Head><title>{title} | Magnetide</title></Head>

      <div style={{position:'sticky',top:60,zIndex:20,backdropFilter:'saturate(140%) blur(6px)',background:'rgba(10,11,16,.65)',border:'1px solid var(--border)',borderRadius:12,padding:'10px 12px',marginBottom:12}}>
        <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <h1 style={{margin:'6px 0'}}>{title}</h1>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <select className="select" value={country} onChange={e=>onPickCountry(e.target.value)}>
              {countries.map(c=><option key={c}>{c}</option>)}
            </select>
            {(['today','tomorrow','all'] as DayFilter[]).map(v=>(
              <button key={v} onClick={()=>setDay(v)} className={v===day?'tab active':'tab'}>{v}</button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid">{Array.from({length:6}).map((_,i)=><SkeletonCard key={i}/>)}</div>
      ) : grouped.length===0 ? (
        <div className="card"><div className="muted">No showtimes right now.</div></div>
      ) : (
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(380px,1fr))',gap:14}}>
          {grouped.map(({cinema,url,movies})=>(
            <article className="card" key={cinema}>
              <h3 className="card-title">{cinema}</h3>
              {movies.map(m=>(
                <section key={m.title} style={{borderTop:'1px dashed var(--border)',paddingTop:10,marginTop:10}}>
                  <div style={{display:'grid',gridTemplateColumns:'120px 1fr',gap:12,alignItems:'start'}}>
                    {extras[m.title]?.poster ? (
                      <img src={extras[m.title].poster} alt="" style={{width:120,height:'auto',borderRadius:8}}/>
                    ) : (
                      <div className="muted small" style={{width:120}}>No poster</div>
                    )}
                    <div>
                      <div style={{fontWeight:600,marginBottom:6}}>{m.title}</div>
                      <div style={{display:'flex',flexWrap:'wrap'}}>
                        {m.times.map((t,i)=><TimePill key={i} t={t}/>)}
                      </div>
                      {extras[m.title]?.trailer && (
                        <a href={extras[m.title].trailer} target="_blank" rel="noreferrer" className="btn" style={{marginTop:8}}>Trailer</a>
                      )}
                    </div>
                  </div>
                </section>
              ))}
              <div style={{marginTop:12}}><a href={url} target="_blank" rel="noreferrer" className="btn">Cinema page</a></div>
            </article>
          ))}
        </div>
      )}
    </Layout>
  );
}
