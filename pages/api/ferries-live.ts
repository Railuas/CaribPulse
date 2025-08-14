import type { NextApiRequest, NextApiResponse } from 'next';

/** Source options:
 * - sknvibes: https://www.sknvibes.com/travel/new_ferry.cfm (fallback/legacy)
 * - naspa:    https://www.naspakn.com/{weekdayschedule|fridayschedule|saturdayschedule|sundayschedule}
 * - taxi:     https://www.naspakn.com/watertaxischedule
 */
type Dir = 'nevis-to-st-kitts' | 'st-kitts-to-nevis';
type Row = { time: string; vessel: string };
type Payload = { day: string; source: string; type: 'ferry'|'taxi'; routes: Record<Dir, Row[]>; fetchedAt: number };

function norm(s: string){ return s.replace(/\s+/g, ' ').trim(); }
function toText(html: string){
  return norm(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '));
}
const TIME_RE = /\b(\d{1,2}:\d{2})\s?(AM|PM)\b/i;

async function fetchText(url: string, timeoutMs = 10000){
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try{
    const r = await fetch(url, { signal: ctrl.signal, cache: 'no-store' });
    if(!r.ok) throw new Error('bad status ' + r.status);
    return await r.text();
  } finally { clearTimeout(t); }
}

function sliceBetween(text: string, startKey: string, endKey?: string){
  const s = text.toLowerCase().indexOf(startKey.toLowerCase());
  if (s === -1) return '';
  const e = endKey ? text.toLowerCase().indexOf(endKey.toLowerCase(), s + startKey.length) : -1;
  return e !== -1 ? text.slice(s, e) : text.slice(s);
}

function parsePairs(text: string): Row[] {
  const tokens = text.split(/\s{2,}|\n|\r/).map(norm).filter(Boolean);
  const out: Row[] = [];
  for (let i=0; i<tokens.length; i++){
    const t = tokens[i];
    const m = t.match(TIME_RE);
    if (m){
      // the next non-time token is likely the vessel name
      let j = i+1;
      while(j < tokens.length && TIME_RE.test(tokens[j])) j++;
      const vessel = tokens[j] || '';
      if (vessel && !TIME_RE.test(vessel)){
        out.push({ time: m[0].toUpperCase(), vessel });
        i = j;
      }
    }
  }
  return out;
}

// SKNVibes fallback (single page, fewer details)
async function scrapeSknVibes(): Promise<Record<Dir, Row[]>> {
  const html = await fetchText('https://www.sknvibes.com/travel/new_ferry.cfm');
  const text = toText(html);
  const a = sliceBetween(text, 'departs st. kitts', 'departs nevis');
  const b = sliceBetween(text, 'departs nevis');
  const fromStKitts = parsePairs(a);
  const fromNevis = parsePairs(b);
  return {
    'st-kitts-to-nevis': fromStKitts,
    'nevis-to-st-kitts': fromNevis,
  };
}

// NASPA ferry schedule (weekday/fri/sat/sun)
function naspaSlugFor(day: string): string {
  const d = day.toLowerCase();
  if (d === 'fri' || d === 'friday') return 'fridayschedule';
  if (d === 'sat' || d === 'saturday') return 'saturdayschedule';
  if (d === 'sun' || d === 'sunday') return 'sundayschedule';
  return 'weekdayschedule'; // Mon-Thu
}

async function scrapeNaspa(day: string): Promise<Record<Dir, Row[]>> {
  const slug = naspaSlugFor(day);
  const html = await fetchText(`https://www.naspakn.com/${slug}`);
  const text = toText(html);
  const nevisToSt = sliceBetween(text, 'nevis to st.kitts', 'st. kitts to nevis') || sliceBetween(text, 'nevis to st. kitts', 'st. kitts to nevis');
  const stToNevis = sliceBetween(text, 'st. kitts to nevis');
  return {
    'nevis-to-st-kitts': parsePairs(nevisToSt),
    'st-kitts-to-nevis': parsePairs(stToNevis),
  };
}

// NASPA water taxi schedule
async function scrapeNaspaTaxi(): Promise<Record<Dir, Row[]>> {
  const html = await fetchText('https://www.naspakn.com/watertaxischedule');
  const text = toText(html);
  const nevisToSt = sliceBetween(text, 'nevis to st. kitts', 'st. kitts to nevis');
  const stToNevis = sliceBetween(text, 'st. kitts to nevis');
  return {
    'nevis-to-st-kitts': parsePairs(nevisToSt),
    'st-kitts-to-nevis': parsePairs(stToNevis),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Payload | { error: string }>) {
  const type = (req.query.type as string || 'ferry').toLowerCase() === 'taxi' ? 'taxi' : 'ferry';
  const day = (req.query.day as string || new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const source = (req.query.source as string || 'naspa').toLowerCase();

  try{
    let routes: Record<Dir, Row[]>;
    if (type === 'taxi'){
      routes = await scrapeNaspaTaxi();
    } else if (source === 'naspa'){
      routes = await scrapeNaspa(day);
    } else {
      routes = await scrapeSknVibes();
    }
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=300');
    res.status(200).json({ day, source, type, routes, fetchedAt: Date.now() });
  }catch(e: any){
    res.status(200).json({ error: e?.message || 'failed to load schedules' } as any);
  }
}
