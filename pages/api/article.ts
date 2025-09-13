// pages/api/article.ts
import type { NextRequest } from 'next/server';

function decodeHTMLEntities(s:string){
  return s
    .replace(/&amp;/g,'&')
    .replace(/&quot;/g,'"')
    .replace(/&#39;/g,"'")
    .replace(/&lt;/g,'<')
    .replace(/&gt;/g,'>');
}

function sanitize(html: string){
  // strip scripts/styles/iframes and inline events
  html = html.replace(/<script[\s\S]*?<\/script>/gi,'')
             .replace(/<style[\s\S]*?<\/style>/gi,'')
             .replace(/<iframe[\s\S]*?<\/iframe>/gi,'');
  html = html.replace(/\s+on\w+="[^"]*"/gi, '');
  return html;
}

function pickOG(html: string){
  const get = (prop:string)=>{
    const m = html.match(new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i'));
    return m ? m[1] : undefined;
  };
  const getName = (name:string)=>{
    const m = html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'));
    return m ? m[1] : undefined;
  };
  return {
    title: get('og:title') || getName('title') || undefined,
    image: get('og:image') || getName('twitter:image') || undefined,
    desc:  get('og:description') || getName('description') || undefined,
  };
}

// crude main content extraction: prefer <article>, else largest <div> by text length
function extractMain(html: string){
  const art = html.match(/<article[\s\S]*?<\/article>/i);
  if (art) return art[0];
  const divs = html.match(/<div[\s\S]*?<\/div>/gi) || [];
  let best = ''; let bestLen = 0;
  for (const d of divs){
    const t = d.replace(/<[^>]+>/g,'').trim();
    if (t.length > bestLen){ bestLen = t.length; best = d; }
  }
  return best || '';
}

export const config = { runtime: 'edge' };

export default async function handler(req: NextRequest){
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url) return new Response(JSON.stringify({ ok:false, error:'missing url' }), { status: 400 });

  try{
    const r = await fetch(url, { headers: { 'user-agent': 'MagnetideBot/1.0' } });
    const html = await r.text();
    const og = pickOG(html);
    const main = sanitize(extractMain(html)) || '';
    return new Response(JSON.stringify({ ok:true, url, og, html: main }), {
      status: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 's-maxage=300, stale-while-revalidate=300' }
    });
  }catch(e:any){
    return new Response(JSON.stringify({ ok:false, error: e?.message || 'failed' }), { status: 200 });
  }
}
