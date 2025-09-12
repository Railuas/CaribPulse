import Head from 'next/head';
import CountrySelect from '@/components/CountrySelect';
import NewsList from '@/components/NewsList';
import { SLUG_TO_COUNTRY } from '@/lib/countryMap';

type Item = { title:string; link:string; source?:string };

export default function CountryPage({ items, title }: { items: Item[]; title: string }){
  return (
    <>
      <Head><title>{title}</title></Head>
      <CountrySelect initialCode="REGION" />
      <main className="container">
        <NewsList title={title} items={items} />
      </main>
    </>
  );
}

export async function getServerSideProps({ params, req }:{ params:{ slug:string }, req:any }){
  const slug = params.slug;
  const country = SLUG_TO_COUNTRY[slug] || '';
  const origin = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;
  const url = country ? `${origin}/api/news?country=${encodeURIComponent(country)}` : `${origin}/api/news`;
  const r = await fetch(url);
  const json = await r.json();
  const title = country ? `Top Stories — ${country}` : 'Top Stories';
  return { props: { items: json.items || [], title } };
}