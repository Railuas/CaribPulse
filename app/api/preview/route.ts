import type { NextRequest } from 'next/server'
export const revalidate = 3600;
export async function GET(req: NextRequest){
  const url = req.nextUrl.searchParams.get('url')
  if(!url) return new Response('Missing url', { status: 400 })
  try{
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 CaribPulse' } })
    const html = await res.text()
    const find = (re:RegExp)=> (html.match(re)?.[1]) || ''
    const ogImage = find(/<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)/i) || find(/<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)/i)
    const title = find(/<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)/i) || find(/<title>([^<]+)/i)
    const desc = find(/<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)/i) || ''
    return Response.json({ url, title, desc, image: ogImage })
  }catch(e){ return new Response('Failed', { status: 500 }) }
}
