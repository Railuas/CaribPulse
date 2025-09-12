import Head from 'next/head';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import NewsList from '@/components/NewsList';
import { SLUG_TO_COUNTRY } from '@/lib/countryMap';

const WeatherStage = dynamic(() => import('@/components/WeatherStage'), { ssr: false });
const SportsTicker = dynamic(() => import('@/components/SportsTicker'), { ssr: false });
const HurricaneTracker = dynamic(() => import('@/components/HurricaneTracker'), { ssr: false });
const IslandFerriesPanel = dynamic(() => import('@/components/IslandFerriesPanel'), { ssr: false });
const IslandMoviesPanel = dynamic(() => import('@/components/IslandMoviesPanel'), { ssr: false });

export default function CountryPage({ countryName }:{ countryName:string }){
  return (
    <Layout>
      <Head>
        <title>Top Stories — {countryName} | Magnetide</title>
      </Head>
      <NewsList island={countryName} />
      <WeatherStage country={countryName} />
      <SportsTicker country={countryName} />
      <HurricaneTracker country={countryName} />
      <IslandFerriesPanel country={countryName} />
      <IslandMoviesPanel country={countryName} />
    </Layout>
  );
}

export async function getServerSideProps({ params }:{ params:{ slug:string } }){
  const slug = params.slug;
  const countryName = SLUG_TO_COUNTRY[slug] || 'All Caribbean';
  return { props: { countryName } };
}
