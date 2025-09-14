// pages/api/article.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = (req.query.url as string) || '';
  if (!url) return res.status(400).json({ error: 'Missing url' });
  try {
    const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await resp.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    if (!article) {
      res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=600');
      return res.status(200).json({ title: '', content: `<p>Could not extract this article. <a href="${url}" target="_blank" rel="noopener">Open original</a></p>` });
    }
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=600');
    return res.status(200).json({ title: article.title, content: article.content });
  } catch (e: any) {
    return res.status(200).json({ error: e?.message || 'failed' });
  }
}

export const config = { api: { externalResolver: true }, runtime: 'nodejs' };