import type { NextApiRequest, NextApiResponse } from 'next';

type FerryRoute = {
  route: string;
  operator: string;
  country?: string;
  notes?: string;
  website?: string;
  typical?: string[]; // typical departure times or frequency
};

// Big curated set. Times/frequencies are indicative; verify with operator sites.
const FERRIES: FerryRoute[] = [
  // --- Bahamas ---
  { route:'Nassau ↔ Harbour Island', operator:'Bahamas Ferries', country:'Bahamas', website:'https://www.bahamasferries.com/' },
  { route:'Nassau ↔ Spanish Wells', operator:'Bahamas Ferries', country:'Bahamas', website:'https://www.bahamasferries.com/' },
  { route:'Nassau ↔ Andros (Fresh Creek / Morgans Bluff)', operator:'Bahamas Ferries', country:'Bahamas', website:'https://www.bahamasferries.com/' },
  { route:'Nassau ↔ Exuma (George Town)', operator:'Bahamas Ferries', country:'Bahamas', website:'https://www.bahamasferries.com/' },
  { route:'Fort Lauderdale (USA) ↔ Bimini / Freeport (Grand Bahama)', operator:'Baleària Caribbean', country:'Bahamas', website:'https://www.baleariacaribbean.com/' },

  // --- Jamaica (limited regular services; tours/charters) ---
  { route:'Kingston Harbour (tours)', operator:'Local Operators / JUTA', country:'Jamaica', notes:'Seasonal / tours' },

  // --- Trinidad & Tobago ---
  { route:'Port of Spain (Trinidad) ↔ Scarborough (Tobago)', operator:'TTIT (Trinidad & Tobago Inter-Island Transportation Co.)', country:'Trinidad and Tobago', website:'https://www.ttit.gov.tt/' },

  // --- Saint Kitts & Nevis ---
  { route:'Basseterre (St. Kitts) ↔ Charlestown (Nevis)', operator:'Sea Bridge / MV Mark Twain / Caribe Breeze', country:'St. Kitts and Nevis', notes:'Frequent day service' },

  // --- Antigua & Barbuda ---
  { route:'Antigua ↔ Barbuda', operator:'Barbuda Express', country:'Antigua and Barbuda', website:'https://www.barbudaexpress.com/' },

  // --- Dominica / Guadeloupe / Martinique / Saint Lucia (French Antilles network) ---
  { route:'Roseau (Dominica) ↔ Fort-de-France (Martinique) ↔ Pointe-à-Pitre (Guadeloupe)', operator:"L'Express des Îles", country:'Dominica', website:'https://www.express-des-iles.com/' },
  { route:'Castries (Saint Lucia) ↔ Fort-de-France (Martinique)', operator:"L'Express des Îles", country:'Saint Lucia', website:'https://www.express-des-iles.com/' },

  // --- Saint Vincent and the Grenadines ---
  { route:'Kingstown ↔ Bequia', operator:'Bequia Express', country:'Saint Vincent and the Grenadines' },
  { route:'Kingstown ↔ Bequia', operator:'Admiralty Transport', country:'Saint Vincent and the Grenadines' },
  { route:'Inter-island (Bequia, Canouan, Union Island)', operator:'Various (Admiralty / Bequia Express / Others)', country:'Saint Vincent and the Grenadines', notes:'Multiple daily services' },

  // --- Grenada / Carriacou ---
  { route:"St. George's (Grenada) ↔ Hillsborough (Carriacou)", operator:'Osprey Lines', country:'Grenada', website:'https://www.osprey.com.gd/' },

  // --- Dominican Republic ---
  { route:'Santo Domingo (DR) ↔ San Juan (Puerto Rico)', operator:'Ferries del Caribe', country:'Dominican Republic', website:'https://www.ferriesdelcaribe.com/' },

  // --- Puerto Rico (main island) ↔ Culebra / Vieques ---
  { route:'Ceiba ↔ Culebra', operator:'Puerto Rico Ferry (ATM/HSI)', country:'Puerto Rico', website:'https://www.puertoricoferry.com/' },
  { route:'Ceiba ↔ Vieques', operator:'Puerto Rico Ferry (ATM/HSI)', country:'Puerto Rico', website:'https://www.puertoricoferry.com/' },

  // --- USVI & BVI ---
  { route:'St. Thomas (Charlotte Amalie) ↔ Tortola (Road Town)', operator:'Road Town Fast Ferry', country:'British Virgin Islands', website:'https://www.roadtownfastferry.com/' },
  { route:'St. Thomas (Red Hook) ↔ Tortola (West End/Road Town)', operator:'Native Son / Road Town Fast Ferry', country:'British Virgin Islands', website:'https://www.nativesonferry.com/' },
  { route:'St. Thomas (Red Hook) ↔ St. John (Cruz Bay)', operator:"Varlack Ventures / Transportation Services of St. John", country:'U.S. Virgin Islands' },

  // --- St. Maarten / St. Martin region ---
  { route:'St. Maarten (Philipsburg) ↔ St. Barts (Gustavia)', operator:'Great Bay Express', country:'Sint Maarten', website:'https://www.greatbayferry.com/' },
  { route:'St. Martin (Marigot) ↔ St. Barts (Gustavia)', operator:'Voyager', country:'Saint Martin', website:'https://www.voy12.com/' },
  { route:'St. Maarten (SXM) ↔ Saba / St. Eustatius (Statia)', operator:'Makana Ferry', country:'Sint Maarten', website:'https://bluesandbluesltd.com/makana-ferry/' },

  // --- Anguilla ---
  { route:'Blowing Point (Anguilla) ↔ Marigot (St. Martin)', operator:'Public Ferry / Private Operators', country:'Anguilla' },

  // --- Aruba / Curaçao / Bonaire ---
  { route:'(Inter-island services are rare / seasonal)', operator:'—', country:'Curaçao', notes:'Check local operators' },

  // --- Haiti ---
  { route:'(Limited scheduled ferry services)', operator:'—', country:'Haiti', notes:'Check local operators' },
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
