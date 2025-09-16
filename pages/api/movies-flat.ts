// pages/api/movies-flat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import live from './movies-live';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  // Reuse movies-live but flatten the payload
  const r: any = { setHeader: ()=>{}, status:(n:number)=>({ json:(x:any)=>x }) } as any;
  const data: any = await (live as any)({ query: req.query }, r);
  const arr = (data as any) || [];
  const flat = arr.flatMap((c:any)=> (c.shows||[]).map((s:any)=> ({
    country: c.island,
    cinema: c.name,
    url: c.url,
    title: s.title,
    times: s.times || [],
    poster: s.poster
  })));
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=300');
  res.status(200).json({ ok:true, items: flat });
}