import type { NextApiRequest, NextApiResponse } from 'next';

export const config = { api: { externalResolver: true }, runtime: 'nodejs' };

type Row = { time: string; vessel?: string; note?: string };
type Dir = 'a-to-b' | 'b-to-a';
type Sched = { island: string; route: string; source: string; day?: string; routes: Record<Dir, Row[]>; fetchedAt: number };

function norm(s: string){ return s.replace(/\s+/g, ' ').trim(); }
function toText(html: string){
  return norm(html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' '));
}
const TIME_RE = /\b(\d{1,2}:\d{2})\s?(AM|PM)\b/gi;

async function fetchText(url: string, timeoutMs = 12000){
  const ctrl = new AbortController();
  const t = setTimeout(()=>ctrl.abort(), timeoutMs);
  try{
    const r = await fetch(url, {
      signal: ctrl.signal,
      cache: 'no-store',
      redirect: 'follow',
      headers: { 'user-agent': 'CaribePulseBot/1.0 (+https://caribepulse.netlify.app)' }
    });
    if (!r.ok) throw new Error('bad status ' + r.status);
    return await r.text();
  } finally { clearTimeout(t); }
}

function sliceBetween(text: string, startKey: string, endKey?: string){
  const S = text.toLowerCase();
  const s = S.indexOf(startKey.toLowerCase());
  if (s === -1) return '';
  const e = endKey ? S.indexOf(endKey.toLowerCase(), s + startKey.length) : -1;
  return e !== -1 ? text.slice(s, e) : text.slice(s);
}
function parsePairs(text: string): Row[] {
  const tokens = text.split(/\s{2,}|\n|\r/).map(norm).filter(Boolean);
  const out: Row[] = [];
  for (let i=0; i<tokens.length; i++){
    const t = tokens[i];
    const m = t.match(/\b\d{1,2}:\d{2}\s?(AM|PM)\b/i);
    if (m){
      let j = i+1;
      while(j < tokens.length && /\b\d{1,2}:\d{2}\s?(AM|PM)\b/i.test(tokens[j])) j++;
      const vessel = tokens[j] || '';
      if (vessel && !/\b\d{1,2}:\d{2}\s?(AM|PM)\b/i.test(vessel)){
        out.push({ time: m[0].toUpperCase(), vessel });
        i = j;
      }
    }
  }
  return out;
}

// SKN: NASPA + Water Taxi + SKNVibes fallback
function naspaSlugFor(day: string){
  const d = day.toLowerCase();
  if (d.startsWith('fri')) return 'fridayschedule';
  if (d.startsWith('sat')) return 'saturdayschedule';
  if (d.startsWith('sun')) return 'sundayschedule';
  return 'weekdayschedule';
}
async function sknNaspa(day: string, taxi=false){
  const url = taxi ? 'https://www.naspakn.com/watertaxischedule' : `https://www.naspakn.com/${naspaSlugFor(day)}`;
  const text = toText(await fetchText(url));
  const a = sliceBetween(text, 'nevis to st. kitts', 'st. kitts to nevis') || sliceBetween(text, 'nevis to st. kitts');
  const b = sliceBetween(text, 'st. kitts to nevis');
  return {
    island: 'Saint Kitts & Nevis', route: taxi ? 'Oualie Water Taxi' : 'Charlestown Ferry', source: 'naspa',
    day, routes: { 'a-to-b': parsePairs(a), 'b-to-a': parsePairs(b) }, fetchedAt: Date.now(),
  } as Sched;
}
async function sknVibes(){
  const text = toText(await fetchText('https://www.sknvibes.com/travel/new_ferry.cfm'));
  const a = sliceBetween(text, 'departs st. kitts', 'departs nevis');
  const b = sliceBetween(text, 'departs nevis');
  return {
    island: 'Saint Kitts & Nevis', route: 'Charlestown Ferry', source: 'sknvibes',
    routes: { 'a-to-b': parsePairs(a), 'b-to-a': parsePairs(b) }, fetchedAt: Date.now(),
  } as Sched;
}

// Antigua & Barbuda: Barbuda Express
async function barbudaExpress(){
  const text = toText(await fetchText('https://www.barbudaexpress.com/schedule.html'));
  // Rough parse: find two columns of times in lines
  const lines = text.split(/\n|\r|\s{2,}/).map(norm).filter(Boolean);
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const a: Row[] = [], b: Row[] = [];
  for (let i=0;i<lines.length;i++){
    const L = lines[i];
    const d = days.find(dd => L.toLowerCase().startsWith(dd.toLowerCase()));
    if (d){
      const times: string[] = [];
      for (let j=i+1;j<Math.min(i+8, lines.length);j++){
        const m = lines[j].match(/\b\d{1,2}:\d{2}\s?(AM|PM)\b/i);
        if (m){ times.push(m[0].toUpperCase()); if (times.length>=2) break; }
      }
      if (times[0]) a.push({ time: times[0] });
      if (times[1]) b.push({ time: times[1] });
    }
  }
  return {
    island: 'Antigua & Barbuda', route: 'St. John’s ↔ Codrington', source: 'barbudaexpress',
    routes: { 'a-to-b': a, 'b-to-a': b }, fetchedAt: Date.now(),
  } as Sched;
}

// Trinidad & Tobago: TTIT
async function ttit(){
  const text = toText(await fetchText('https://www.ttitferry.com/schedule/'));
  function timesOnly(chunk: string){ return Array.from(chunk.matchAll(TIME_RE)).map(m => ({ time: m[0].toUpperCase() })); }
  const posToScar = sliceBetween(text, 'port of spain to scarborough', 'scarborough to port of spain') || sliceBetween(text, 'port of spain → scarborough', 'scarborough → port of spain');
  const scarToPos = sliceBetween(text, 'scarborough to port of spain') || sliceBetween(text, 'scarborough → port of spain');
  return {
    island: 'Trinidad & Tobago', route: 'Port of Spain ↔ Scarborough', source: 'ttit',
    routes: { 'a-to-b': timesOnly(posToScar), 'b-to-a': timesOnly(scarToPos) }, fetchedAt: Date.now(),
  } as Sched;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Sched | { error: string }>) {
  const island = (req.query.island as string || 'skn').toLowerCase();
  const type = (req.query.type as string || 'ferry').toLowerCase();
  const day = (req.query.day as string || new Date().toLocaleDateString('en-US',{ weekday:'long' }));

  try{
    if (island === 'skn'){
      if (req.query.source === 'sknvibes') return res.status(200).json(await sknVibes());
      const taxi = type === 'taxi';
      return res.status(200).json(await sknNaspa(day, taxi));
    }
    if (island === 'antigua'){ return res.status(200).json(await barbudaExpress()); }
    if (island === 'tt' || island === 'trinidad' || island === 'tto'){ return res.status(200).json(await ttit()); }
    return res.status(200).json({ error: 'unsupported island. Try island=skn|antigua|tt' });
  }catch(e: any){
    return res.status(200).json({ error: e?.message || 'failed' });
  }
}
