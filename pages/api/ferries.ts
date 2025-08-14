import type { NextApiRequest, NextApiResponse } from 'next';

type FerryRoute = {
  id: string;
  origin: string;
  destination: string;
  operator: string;
  days: string[];
  depart: string;
  arrive: string;
  link?: string;
  notes?: string;
};

function parseCSV(csv: string): FerryRoute[] {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const out: FerryRoute[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim());
    const map: any = {};
    headers.forEach((h, idx) => (map[h] = cols[idx] || ''));
    const days = (map['days'] || '').split(/\s*;\s*|\s*,\s*/).filter(Boolean);
    out.push({
      id: map['id'] || String(i),
      origin: map['origin'] || '',
      destination: map['destination'] || '',
      operator: map['operator'] || '',
      days,
      depart: map['depart'] || '',
      arrive: map['arrive'] || '',
      link: map['link'] || '',
      notes: map['notes'] || '',
    });
  }
  return out;
}

async function fetchCSV(url: string, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, cache: 'no-store' });
    if (!res.ok) throw new Error('bad status ' + res.status);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sheet = process.env.FERRIES_SHEET_CSV; // e.g. https://docs.google.com/spreadsheets/d/e/.../pub?output=csv
  const q = (req.query.q as string | undefined)?.toLowerCase().trim();
  try {
    let routes: FerryRoute[] = [];
    if (sheet) {
      const csv = await fetchCSV(sheet);
      routes = parseCSV(csv);
    } else {
      // fallback to local JSON (if served statically)
      const fallback = await fetch(new URL('/data/ferries.json', 'http://localhost')).catch(() => null as any);
      if (fallback && fallback.ok) {
        const j = await fallback.json();
        routes = j.routes || [];
      }
    }
    // Filter by q
    if (q) {
      routes = routes.filter(r => {
        const text = (r.origin + ' ' + r.destination + ' ' + r.operator).toLowerCase();
        return text.includes(q);
      });
    }
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=300');
    res.status(200).json({ updated: Date.now(), routes });
  } catch (e: any) {
    res.status(200).json({ routes: [], error: true, message: e?.message || 'failed' });
  }
}
