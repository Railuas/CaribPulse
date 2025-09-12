import Head from 'next/head';
import dynamic from 'next/dynamic';
import CountrySwitcher from '@/components/CountrySwitcher';
import NewsList from '@/components/NewsList';

// Client-only widgets so they render on Netlify
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

      {/* Top bar country selector (yours) */}
      <CountrySwitcher />

      {/* Regional news with images */}
      <NewsList island={undefined} />

      {/* Your widgets (now client-only so they actually appear) */}
      <section className="section"><WeatherStage /></section>
      <section className="section"><SportsTicker /></section>
      <section className="section"><HurricaneTracker /></section>
      <section className="section"><IslandFerriesPanel /></section>
      <section className="section"><IslandMoviesPanel /></section>
    </>
  );
}

