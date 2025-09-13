// components/NewsCard.tsx
import Link from 'next/link';

type Props = {
  id: string;
  title: string;
  image?: string;
  source: string;
  published?: string;
};

export default function NewsCard({ id, title, image, source, published }: Props){
  return (
    <article className="card" style={{display:'flex', gap:12}}>
      {image ? (
        <img src={image} alt="" style={{width:120, height:80, objectFit:'cover', borderRadius:8}}/>
      ) : (
        <div style={{width:120, height:80, border:'1px dashed var(--border)', borderRadius:8, display:'grid', placeItems:'center'}} className="muted small">no img</div>
      )}
      <div style={{flex:1, minWidth:0}}>
        <Link href={`/news/${id}`} className="card-title" style={{display:'inline-block', marginBottom:6}}>{title}</Link>
        <div className="muted small">{source}{published ? ` • ${new Date(published).toLocaleString()}` : ''}</div>
      </div>
    </article>
  );
}
