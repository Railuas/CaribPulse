import type { NextApiRequest, NextApiResponse } from 'next';

const BASE = 'https://www.thesportsdb.com/api/v1/json/3'; // free key v3

function todayUTC(){
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth()+1).padStart(2,'0');
  const dd = String(d.getUTCDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  try{
    const d = todayUTC();
    const sports = (req.query.sports as string)?.split(',').map(s=>s.trim()).filter(Boolean) || ['Soccer','Basketball','Cricket'];
    const urls = sports.map(s => `${BASE}/eventsday.php?d=${d}&s=${encodeURIComponent(s)}`);
    const results = await Promise.all(urls.map(u => fetch(u).then(r=>r.json()).catch(()=>null)));

    const events = results.flatMap((r:any) => r?.events || []).map((e:any) => ({
      id: e.idEvent,
      sport: e.strSport,
      league: e.strLeague,
      home: e.strHomeTeam,
      away: e.strAwayTeam,
      date: `${e.dateEvent} ${e.strTime || ''}`.trim(),
      status: e.strStatus || e.strResult || '',
      venue: e.strVenue || ''
    }));

    const seen = new Set<string>();
    const dedup = events.filter(x => {
      if (!x.id) return false;
      if (seen.has(x.id)) return false;
      seen.add(x.id); return true;
    });

    dedup.sort((a,b)=> a.league.localeCompare(b.league) || a.date.localeCompare(b.date));
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=120');
    res.status(200).json({ ok:true, date: d, events: dedup });
  }catch(e:any){
    res.status(200).json({ ok:false, events:[], error: e?.message || 'failed' });
  }
}

export const config = { api: { externalResolver: true }, runtime: 'nodejs' };