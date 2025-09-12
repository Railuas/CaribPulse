
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = { api: { externalResolver: true }, runtime: 'nodejs' };

/**
 * Lightweight proxy to TheSportsDB to fetch events by country for today and next few days.
 * No key required for demo endpoints. You can swap to another free provider later.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const country = ((req.query.country as string) || 'Trinidad and Tobago').trim();
  try{
    const encoded = encodeURIComponent(country);
    // Today events
    const todayUrl = `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${new Date().toISOString().slice(0,10)}&c=${encoded}`;
    const nextUrl = `https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?c=${encoded}`; // broader
    const [a,b] = await Promise.all([fetch(todayUrl), fetch(nextUrl)]);
    const today = await a.json();
    const next = await b.json();
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=600');
    res.status(200).json({ ok:true, country, today: today?.events || [], upcoming: next?.events || [] });
  }catch(e:any){
    res.status(200).json({ ok:false, country, today:[], upcoming:[], error: e?.message || 'failed' });
  }
}
