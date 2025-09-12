
import { useEffect, useMemo, useState } from 'react';
import NewsList from './NewsList';
import { ISLANDS } from '../lib/islands';
import { useRouter } from 'next/router';

type Feeds = Record<string, string[]>;

// Haversine distance (km)
function distanceKm(a:{lat:number,lon:number}, b:{lat:number,lon:number}){
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI/180;
  const dLon = (b.lon - a.lon) * Math.PI/180;
  const la1 = a.lat * Math.PI/180;
  const la2 = b.lat * Math.PI/180;
  const x = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(x));
}

function guessCountryByTZ(): string | null{
  try{
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    // quick mappings for Caribbean timezones
    const map: Record<string,string> = {
      'America/St_Kitts': 'St. Kitts & Nevis',
      'America/Port_of_Spain': 'Trinidad & Tobago',
      'America/Jamaica': 'Jamaica',
      'America/Barbados': 'Barbados',
      'America/Antigua': 'Antigua & Barbuda',
      'America/Grenada': 'Grenada',
      'America/Guadeloupe': 'Guadeloupe',
      'America/Dominica': 'Dominica',
      'America/Marigot': 'Saint Martin (FR)',
      'America/Port-au-Prince': 'Haiti',
      'America/Santo_Domingo': 'Dominican Republic',
      'America/Nassau': 'Bahamas',
      'America/Tortola': 'British Virgin Islands',
      'America/St_Thomas': 'USVI — St. Thomas',
      'America/St_Croix': 'USVI — St. Croix',
      'America/Curacao': 'Curaçao',
      'America/Puerto_Rico': 'Puerto Rico',
      'America/Martinique': 'Martinique',
      'America/St_Lucia': 'Saint Lucia',
      'America/St_Vincent': 'Saint Vincent & the Grenadines',
      'America/Aruba': 'Aruba',
    };
    return map[tz] || null;
  }catch{ return null; }
}

export default function CountryNews(){
  const router = useRouter();
  const [countries, setCountries] = useState<string[]>(['All Caribbean']);
  const [country, setCountry] = useState<string>('All Caribbean');

  // Load list from feeds.json
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

  // Auto-detect country on first load
  useEffect(()=>{
    (async ()=>{
      // Try geolocation first (user consent)
      try{
        await new Promise<void>((resolve)=>{
          if (!('geolocation' in navigator)) return resolve();
          let done = false;
          navigator.geolocation.getCurrentPosition((pos)=>{
            done = true;
            const { latitude, longitude } = pos.coords;
            // pick nearest island
            let best = ISLANDS[0];
            let bestD = Infinity;
            for (const isl of ISLANDS){
              const d = distanceKm({lat:latitude, lon:longitude}, {lat:isl.lat, lon:isl.lon});
              if (d < bestD){ bestD = d; best = isl; }
            }
            const ctry = best.country || best.name;
            setCountry(ctry);
            resolve();
          }, ()=> resolve(), { enableHighAccuracy:true, timeout:3000, maximumAge:60000 });
          setTimeout(()=> !done && resolve(), 3200);
        });
        return;
      }catch{ /* continue */ }
      // Fallback: timezone mapping
      const tzGuess = guessCountryByTZ();
      if (tzGuess) setCountry(tzGuess);
    })();
  }, []);

  // When user selects a country, also provide a one-tap navigation into that country's island hub
  const firstIslandSlug = useMemo(()=>{
    if (country === 'All Caribbean') return null;
    const match = ISLANDS.find(i => (i.country || i.name) === country);
    return match?.slug || null;
  }, [country]);

  function onChangeCountry(value: string){
    setCountry(value);
    // Navigate to island hub when a concrete country is chosen
    if (value !== 'All Caribbean'){
      const match = ISLANDS.find(i => (i.country || i.name) === value);
      if (match) router.push(`/island/${match.slug}`);
    }
  }

  return (
    <div>
      <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:12, flexWrap:'wrap' }}>
        <label className="muted small">Country:</label>
        <select
          value={country}
          onChange={e=>onChangeCountry(e.target.value)}
          style={{ background:'transparent', color:'white', border:'1px solid rgba(255,255,255,.2)', padding:'8px 10px', borderRadius:8, minWidth:240 }}
        >
          {countries.map((c)=> <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <NewsList island={country === 'All Caribbean' ? undefined : country} />
    </div>
  );
}
