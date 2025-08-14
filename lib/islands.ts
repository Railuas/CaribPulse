export type Island = {
  slug: string;
  name: string;
  country?: string;
  lat: number;
  lon: number;
  icao?: string; // default airport for schedules
};

export const ISLANDS: ReadonlyArray<Island> = [
  { slug: 'st-kitts', name: 'St. Kitts & Nevis', country: 'Saint Kitts and Nevis', lat: 17.3, lon: -62.73, icao: 'TKPK' },
  { slug: 'dominica', name: 'Dominica', country: 'Dominica', lat: 15.54, lon: -61.29, icao: 'TDPD' },
  { slug: 'barbados', name: 'Barbados', country: 'Barbados', lat: 13.10, lon: -59.62, icao: 'TBPB' },
  { slug: 'trinidad', name: 'Trinidad & Tobago', country: 'Trinidad and Tobago', lat: 10.65, lon: -61.52, icao: 'TTPP' },
  { slug: 'jamaica', name: 'Jamaica', country: 'Jamaica', lat: 18.00, lon: -77.30, icao: 'MKJP' },
  { slug: 'puerto-rico', name: 'Puerto Rico', country: 'United States', lat: 18.22, lon: -66.59, icao: 'TJSJ' },
];
