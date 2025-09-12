import { useRouter } from "next/router";
import { useState, useMemo } from "react";

type Country = { code: string; name: string; slug: string };

const COUNTRIES: Country[] = [
  { code: "REGION", name: "All Caribbean / Region", slug: "" },
  { code: "AG", name: "Antigua & Barbuda", slug: "antigua-and-barbuda" },
  { code: "AW", name: "Aruba", slug: "aruba" },
  { code: "BS", name: "Bahamas", slug: "bahamas" },
  { code: "BB", name: "Barbados", slug: "barbados" },
  { code: "BZ", name: "Belize", slug: "belize" },
  { code: "BM", name: "Bermuda", slug: "bermuda" },
  { code: "VG", name: "British Virgin Islands", slug: "british-virgin-islands" },
  { code: "KY", name: "Cayman Islands", slug: "cayman-islands" },
  { code: "DM", name: "Dominica", slug: "dominica" },
  { code: "DO", name: "Dominican Republic", slug: "dominican-republic" },
  { code: "GD", name: "Grenada", slug: "grenada" },
  { code: "GY", name: "Guyana", slug: "guyana" },
  { code: "HT", name: "Haiti", slug: "haiti" },
  { code: "JM", name: "Jamaica", slug: "jamaica" },
  { code: "MS", name: "Montserrat", slug: "montserrat" },
  { code: "KN", name: "St. Kitts & Nevis", slug: "st-kitts-and-nevis" },
  { code: "LC", name: "Saint Lucia", slug: "saint-lucia" },
  { code: "VC", name: "St. Vincent & the Grenadines", slug: "st-vincent-and-the-grenadines" },
  { code: "TT", name: "Trinidad & Tobago", slug: "trinidad-and-tobago" },
  { code: "SX", name: "Sint Maarten", slug: "sint-maarten" },
  { code: "PR", name: "Puerto Rico", slug: "puerto-rico" },
  { code: "VI", name: "US Virgin Islands", slug: "us-virgin-islands" }
];

export default function CountrySelect({ initialCode = "REGION" }: { initialCode?: string }){
  const router = useRouter();
  const [value, setValue] = useState(initialCode);

  const options = useMemo(() => COUNTRIES, []);

  const onChange = (code: string) => {
    setValue(code);
    const c = options.find(o => o.code === code)!;
    if (c.code === "REGION") {
      router.push(`/`).catch(()=>{});
    } else {
      try { router.push(`/country/${c.slug}`); } catch { if (typeof window !== 'undefined') window.location.href = `/country/${c.slug}`; }
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="brand">CaribPulse</div>
        <label className="select-wrap">
          <span className="select-label">Country</span>
          <select className="select" value={value} onChange={e=>onChange(e.target.value)}>
            {options.map(o => <option key={o.code} value={o.code}>{o.name}</option>)}
          </select>
        </label>
      </div>
    </div>
  );
}