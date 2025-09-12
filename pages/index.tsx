import Head from 'next/head';
import dynamic from 'next/dynamic';
import NewsList from '@/components/NewsList';
import CountrySwitcher from '@/components/CountrySwitcher';
import WeatherStage from '@/components/WeatherStage';
import SportsTicker from '@/components/SportsTicker';
import HurricaneTracker from '@/components/HurricaneTracker';
import IslandFerriesPanel from '@/components/IslandFerriesPanel';
import IslandMoviesPanel from '@/components/IslandMoviesPanel';

export default function Home(){
  return (
    <>
      <Head>
        <title>Magnetide — Caribbean Headlines</title>
        <meta name="description" content="Magnetide — magnetic Caribbean news, sports, and business. Stay pulled into the flow." />
      </Head>

      {/* Top bar country switcher (or keep your existing) */}
      <CountrySwitcher />

      {/* Regional news with images */}
      <NewsList island={undefined} />

      {/* Your widgets */}
      <section className="section"><WeatherStage /></section>
      <section className="section"><SportsTicker /></section>
      <section className="section"><HurricaneTracker /></section>
      <section className="section"><IslandFerriesPanel /></section>
      <section className="section"><IslandMoviesPanel /></section>
    </>
  );
}
