import Head from 'next/head';
import CountrySelect from '@/components/CountrySelect';
import NewsList from '@/components/NewsList';

type Item = { title:string; link:string; source?:string };

export default function Home({ items }: { items: Item[] }){
  return (
    <>
      <Head><title>CaribPulse — Caribbean Headlines</title></Head>
      <CountrySelect initialCode="REGION" />
      <main className="container">
        <NewsList title="Top Stories (Regional)" items={items} />
      </main>
    </>
  );
}

export async function getServerSideProps({ req }:{ req: any }){
  const origin = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;
  const r = await fetch(`${origin}/api/news`);
  const json = await r.json();
  return { props: { items: json.items || [] } };
}