// pages/news/[id].tsx
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type Data = { ok: boolean; url?: string; og?: { title?: string; image?: string; desc?: string }; html?: string; error?: string };

function decodeId(id: string){ try { return Buffer.from(id, 'base64').toString('utf-8'); } catch { return ''; } }

export default function NewsDetail(){
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '';
  const url = id ? decodeId(id) : '';

  const [data, setData] = useState<Data | null>(null);

  useEffect(()=>{
    if (!url) return;
    (async()=>{
      try{
        const r = await fetch(`/api/article?url=${encodeURIComponent(url)}`);
        const j = await r.json();
        setData(j);
      }catch(e){
        setData({ ok:false, error: 'failed to load' });
      }
    })();
  },[url]);

  const title = data?.og?.title || 'Article';

  return (
    <Layout>
      <Head><title>{title} | Magnetide</title></Head>

      {!data && <div className="muted small">Loading article…</div>}

      {data && (
        <article className="card">
          <h1 className="card-title" style={{fontSize:22, marginBottom:8}}>{data.og?.title || 'Article'}</h1>
          {data.og?.image && <img src={data.og.image} alt="" style={{maxWidth:'100%',borderRadius:10,margin:'8px 0'}}/>}
          {data.og?.desc && <div className="muted" style={{marginBottom:10}}>{data.og.desc}</div>}

          {/* Render sanitized main content */}
          {data.html ? (
            <div dangerouslySetInnerHTML={{ __html: data.html }} />
          ) : (
            <div className="muted small">Couldn’t extract the full content. <a href={data.url} target="_blank" rel="noreferrer">Read original</a>.</div>
          )}

          <div style={{marginTop:14}}>
            <a className="btn" href={data.url} target="_blank" rel="noreferrer">Read on source site</a>
          </div>
        </article>
      )}
    </Layout>
  );
}
