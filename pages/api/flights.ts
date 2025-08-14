import type { NextApiRequest, NextApiResponse } from 'next';

const RAPID_KEY = process.env.AERODATABOX_RAPIDAPI_KEY || '';
const HOST = 'aerodatabox.p.rapidapi.com';

async function getFlights(icao: string, type: 'arrivals' | 'departures') {
  const date = new Date().toISOString().slice(0, 10);
  const url =
    `https://${HOST}/flights/airports/icao/${icao}/${type}/${date}T00:00/${date}T23:59` +
    `?withCancelled=true&withCodeshared=true&withCargo=false&withPrivate=false&withLocation=true`;
  const res = await fetch(url, {
    headers: { 'x-rapidapi-key': RAPID_KEY, 'x-rapidapi-host': HOST },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Flight API error ' + res.status);
  return await res.json();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const icao = (req.query.icao as string || 'TKPK').toUpperCase();
  const type = (req.query.type as string || 'arrivals').toLowerCase() as 'arrivals' | 'departures';
  try {
    const data = await getFlights(icao, type);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=300');
    res.status(200).json({ icao, type, data });
  } catch (e: any) {
    res.status(200).json({ icao, type, data: { error: true, message: e?.message || 'failed' } });
  }
}
