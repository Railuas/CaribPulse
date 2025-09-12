import { useRouter } from 'next/router';
import { COUNTRIES, COUNTRY_TO_SLUG } from '@/lib/countryMap';
import { useMemo } from 'react';

export default function CountrySelect(){
  const router = useRouter();
  const currentSlug = (router.query.slug as string) || '';
  const current = useMemo(()=>{
    if (!currentSlug) return 'All Caribbean';
    // Map slug back to country name by scanning COUNTRY_TO_SLUG
    const found = Object.entries(COUNTRY_TO_SLUG).find(([name,slug]) => slug === currentSlug);
    return found ? found[0] : 'All Caribbean';
  }, [currentSlug]);

  function onChange(e: React.ChangeEvent<HTMLSelectElement>){
    const name = e.target.value;
    if (name === 'All Caribbean'){ router.push('/'); return; }
    const slug = COUNTRY_TO_SLUG[name] || '';
    router.push(`/country/${slug}`);
  }

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="brand">Magnetide</div>
        <div className="select-wrap">
          <span className="select-label">Country</span>
          <select className="select" value={current} onChange={onChange}>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
