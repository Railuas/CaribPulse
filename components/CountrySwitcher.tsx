import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { ISLANDS } from '../lib/islands';

export default function CountrySwitcher({ value }: { value?: string }){
  const router = useRouter();
  const countries = useMemo(()=>{
    const set = new Set<string>();
    for (const i of ISLANDS) set.add(i.country || i.name);
    return Array.from(set).sort();
  }, []);

  const current = value || ((): string => {
    const slug = (router.query.slug as string) || '';
    const isl = ISLANDS.find(i => i.slug === slug);
    return isl ? (isl.country || isl.name) : 'All Caribbean';
  })();

  function onChange(v: string){
    const isl = ISLANDS.find(i => (i.country || i.name) === v) || ISLANDS.find(i => i.name === v);
    if (isl) router.push(`/island/${isl.slug}`);
  }

  return (
    <select
      aria-label="Select country"
      value={current}
      onChange={e=>onChange(e.target.value)}
      style={{ background:'transparent', color:'white', border:'1px solid rgba(255,255,255,.25)', padding:'8px 10px', borderRadius:8, minWidth:220 }}
    >
      {countries.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
  );
}
