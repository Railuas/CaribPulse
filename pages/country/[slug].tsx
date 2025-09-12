import Head from 'next/head';
import dynamic from 'next/dynamic';
import CountrySwitcher from '@/components/CountrySwitcher';
import NewsList from '@/components/NewsList';
import { SLUG_TO_COUNTRY } from '@/lib/countryMap';

const WeatherStage = dynamic(() => import('@/components/WeatherStage'), { ssr: false });
const SportsTicker = dynamic(() => import('@/components/SportsTicker'), { ssr: false });
const HurricaneTracker = dynamic(() => import('@/components/HurricaneTracker'), { ssr: false });
const IslandFerriesPanel = dynamic(() => import('@/components/IslandFerriesPanel'), { ssr: false });
const IslandMoviesPanel = dynamic(() => import('@/components/IslandMoviesPanel'), { ssr: false });

export default function CountryPage({ countryName }:{ countryName:string }){
  return (
    <>
      <Head>
        <title>Top Stories — {countryName} | Magnetide</title>
        <meta name="description" content={`Latest headlines in ${countryName} — news, sports, weather, ferries, and movies on Magnetide.`} />
      </Head>
      <CountrySwitcher />
      <NewsList island={countryName} />
      <section className="section"><WeatherStage /></section>
      <section className="section"><SportsTicker /></section>
      <section className="section"><HurricaneTracker /></section>
      <section className="section"><IslandFerriesPanel /></section>
      <section className="section"><IslandMoviesPanel /></section>
    </>
  );
}

export async function getServerSideProps({ params }:{ params:{ slug:string } }){
  const slug = params.slug;
  const countryName = SLUG_TO_COUNTRY[slug] || 'All Caribbean';
  return { props: { countryName } };
}
