import Head from 'next/head';
import dynamic from 'next/dynamic';
import CountrySwitcher from '@/components/CountrySwitcher';
import NewsList from '@/components/NewsList';

// Client-only widgets (so they render on Netlify and in browser)
const WeatherStage = dynamic(() => import('@/components/WeatherStage'), { ssr: false });
const SportsTicker = dynamic(() => import('@/components/SportsTicker'), { ssr: false });
const HurricaneTracker = dynamic(() => import('@/components/HurricaneTracker'), { ssr: false });
const IslandFerriesPanel = dynamic(() => import('@/components/IslandFerriesPanel'), { ssr: false });
const IslandMoviesPanel = dynamic(() => import('@/components/IslandMoviesPanel'), { ssr: false });

export default function Home(){
  return (
    <>
      <Head>
        <title>Magnetide — Caribbean Headlines</title>
        <meta name="description" content="Magnetide — magnetic Caribbean news, sports, business, weather, ferries, and movies." />
      </Head>

      <CountrySwitcher />

      {/* Regional news (no country param) */}
      <NewsList island={undefined} />

      {/* Widgets */}
      <section className="section"><WeatherStage /></section>
      <section className="section"><SportsTicker /></section>
      <section className="section"><HurricaneTracker /></section>
      <section className="section"><IslandFerriesPanel /></section>
      <section className="section"><IslandMoviesPanel /></section>
    </>
  );
}
