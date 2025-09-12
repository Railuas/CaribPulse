import Head from 'next/head';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';
import { extractArticle } from '@/lib/htmlExtract';

type Props = {
  ok: boolean;
  title: string;
  bodyHtml: string;
  sourceUrl: string;
  leadImage?: string;
  sourceName?: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const sourceUrl = typeof ctx.query.url === 'string' ? ctx.query.url : '';
  const sourceName = typeof ctx.query.source === 'string' ? ctx.query.source : undefined;
  if (!sourceUrl) {
    return { props: { ok:false, title:'', bodyHtml:'', sourceUrl:'', sourceName } };
  }
  try{
    const r = await fetch(sourceUrl, { headers: { 'user-agent': 'MagnetideReader/1.0' } });
    const html = await r.text();
    const { title, body, leadImage } = extractArticle(html, sourceUrl);
    return { props: { ok:true, title: title || 'Article', bodyHtml: body, sourceUrl, leadImage, sourceName } };
  }catch(e){
    return { props: { ok:false, title:'', bodyHtml:'', sourceUrl, sourceName } };
  }
};

export default function ReadPage({ ok, title, bodyHtml, sourceUrl, leadImage, sourceName }: Props){
  return (
    <div className="container">
      <Head>
        <title>{title ? `${title} — Magnetide` : 'Article — Magnetide'}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div style={{display:'flex', alignItems:'center', gap:10, margin:'10px 0 16px'}}>
        <Link href="/" className="brand" style={{fontWeight:800, fontSize:18}}>Magnetide</Link>
        <div className="muted small">Reader</div>
      </div>

      {!ok ? (
        <div className="card">
          <h1 className="section-title">Couldn’t load article</h1>
          <p className="small">Open at the source instead:</p>
          <p><a href={sourceUrl} target="_blank" rel="noreferrer">Open source</a></p>
        </div>
      ) : (
        <article className="card" style={{padding:'18px 20px'}}>
          <h1 style={{margin:'0 0 10px'}}>{title}</h1>
          {sourceName && <div className="muted small" style={{marginBottom:10}}>From {sourceName}</div>}
          {leadImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={leadImage} alt="" style={{width:'100%', maxHeight:420, objectFit:'cover', borderRadius:12, margin:'4px 0 12px'}}/>
          )}
          <div className="divider" />
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          <div className="divider" />
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, marginTop:6}}>
            <div className="muted small">Article text rendered in reader mode. Rights belong to the original publisher.</div>
            <a className="btn" href={sourceUrl} target="_blank" rel="noreferrer">
              Read at {sourceName || 'Source'}
            </a>
          </div>
        </article>
      )}
    </div>
  );
}
