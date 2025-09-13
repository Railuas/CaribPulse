// Lightweight HTML "reader" extractor without external deps.
// Heuristics: prefer <article>, then <main>, then <div id=content>, then largest <div> with many <p> tags.
// Removes scripts/styles/iframes. Absolutizes image/src/href attributes relative to the page URL.

export function absolutize(url: string, base: string){
  try{
    if (!url) return url;
    const u = new URL(url, base);
    return u.toString();
  }catch{ return url; }
}

export function stripDangerous(html: string){
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
}

export function pickBetween(tag: string, html: string): string | undefined {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i');
  const m = html.match(re);
  return m ? m[1] : undefined;
}

export function pickById(id: string, html: string): string | undefined {
  // Use \\1 to produce a literal backreference \1 inside the RegExp string
  const re = new RegExp(`<([a-z0-9]+)[^>]*id=["']${id}["'][^>]*>([\\s\\S]*?)<\/\\1>`, 'i');
  const m = html.match(re);
  return m ? m[2] : undefined;
}

export function extractTitle(html: string): string | undefined {
  const og = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (og) return og[1];
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return t ? t[1].replace(/\s+\|\s+.*$/, '').trim() : undefined;
}

export function extractLeadImage(html: string): string | undefined {
  const og = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  return og ? og[1] : undefined;
}

export function rewriteRelative(html: string, base: string){
  return html
    // imgs
    .replace(/(<img[^>]*\ssrc=["'])([^"']+)(["'][^>]*>)/gi, (_,a,b,c)=> a + absolutize(b, base) + c)
    // links
    .replace(/(<a[^>]*\shref=["'])([^"']+)(["'][^>]*>)/gi, (_,a,b,c)=> a + absolutize(b, base) + c);
}

export function extractArticle(raw: string, baseUrl: string){
  let html = stripDangerous(raw);

  let body = pickBetween('article', html)
          || pickBetween('main', html)
          || pickById('content', html)
          || undefined;

  if (!body){
    // fallback: choose the largest <div> containing multiple <p> tags
    const divs = Array.from(html.matchAll(/<div[^>]*>([\s\S]*?)<\/div>/gi));
    let best: string | undefined;
    let score = 0;
    for (const m of divs){
      const seg = m[1];
      const pCount = (seg.match(/<p[\s>]/gi) || []).length;
      const len = seg.length;
      const s = pCount * 50 + len * 0.01;
      if (pCount >= 3 && s > score){
        score = s;
        best = seg;
      }
    }
    body = best || '';
  }

  body = rewriteRelative(body, baseUrl);

  const title = extractTitle(html) || '';
  const leadImage = extractLeadImage(html);

  return { title, body, leadImage };
}
