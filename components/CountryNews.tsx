
import { useEffect, useState } from 'react';
import NewsList from './NewsList';

type Feeds = Record<string, string[]>;

export default function CountryNews(){
  const [countries, setCountries] = useState<string[]>([]);
  const [country, setCountry] = useState<string>('All Caribbean');

  useEffect(()=>{
    (async ()=>{
      try{
        const res = await fetch('/feeds.json');
        const data: Feeds = await res.json();
        const keys = Object.keys(data).filter(k => k !== 'region').sort();
        setCountries(['All Caribbean', ...keys]);
      }catch{ /* noop */ }
    })();
  },[]);

  return (
    <div>
      <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:12, flexWrap:'wrap' }}>
        <label className="muted small">Filter:</label>
        <select value={country} onChange={e=>setCountry(e.target.value)} style={{ background:'transparent', color:'white', border:'1px solid rgba(255,255,255,.2)', padding:'8px 10px', borderRadius:8 }}>
          {countries.map((c)=> <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <NewsList island={country === 'All Caribbean' ? undefined : country} />
    </div>
  );
}
