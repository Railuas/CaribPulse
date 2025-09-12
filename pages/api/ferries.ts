import type { NextApiRequest, NextApiResponse } from 'next';

type FerryRoute = {
  route: string;
  operator: string;
  country?: string;
  notes?: string;
  website?: string;
  typical?: string[]; // typical departure times or frequency
};

const FERRIES: FerryRoute[] = [
  // Jamaica
  { route:'Kingston ↔ Port Royal (harbour tours)', operator:'JUTA / Local Operators', country:'Jamaica', notes:'Limited / seasonal' },
  // Trinidad & Tobago
  { route:'Port of Spain ↔ Scarborough', operator:'TTIT', country:'Trinidad and Tobago', website:'https://www.ttit.gov.tt/', typical:['07:30','10:30','14:00','17:30'] },
  // St. Kitts & Nevis
  { route:'Basseterre ↔ Charlestown', operator:'Sea Bridge / MV Mark Twain', country:'St. Kitts and Nevis', typical:['Every 30–60 min'] },
  // Saint Lucia
  { route:'Castries ↔ Fort-de-France (Martinique)', operator:'Express des Îles', country:'Saint Lucia', website:'https://www.express-des-iles.com/', typical:['09:15','18:00'] },
  // Dominica
  { route:'Roseau ↔ Martinique / Guadeloupe', operator:'Express des Îles', country:'Dominica', website:'https://www.express-des-iles.com/' },
  // Barbados (regional links occasionally)
  { route:'Bridgetown ↔ Saint Vincent (seasonal/charter)', operator:'Various', country:'Barbados', notes:'Check operators' },
  // Bahamas
  { route:'Nassau ↔ Harbour Island / Spanish Wells', operator:'Bahamas Ferries', country:'Bahamas', website:'https://www.bahamasferries.com/' },
  { route:'Nassau ↔ Andros / Exuma / Abaco (select days)', operator:'Bahamas Ferries', country:'Bahamas', website:'https://www.bahamasferries.com/' },
  // Grenada
  { route:'St. George’s ↔ Carriacou', operator:'Osprey Lines', country:'Grenada', website:'https://www.osprey.com.gd/' },
  // Antigua & Barbuda
  { route:'Antigua ↔ Barbuda', operator:'Barbuda Express', country:'Antigua and Barbuda', website:'https://www.barbudaexpress.com/' },
  // Saint Vincent & the Grenadines
  { route:'Kingstown ↔ Bequia / Canouan / Union Island', operator:'Various', country:'Saint Vincent and the Grenadines', notes:'Multiple daily services' },
  // Guyana (river)
  { route:'Georgetown ↔ Parika', operator:'River taxis / ferries', country:'Guyana', notes:'Frequent day service' },
];

function byCountry(country?: string){
  if (!country || country === 'All Caribbean') return FERRIES;
  return FERRIES.filter(f => f.country === country);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const country = (req.query.country as string) || 'All Caribbean';
  const items = byCountry(country);
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=3600');
  res.status(200).json({ ok:true, country, items });
}
