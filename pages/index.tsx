import Head from 'next/head';
import dynamic from 'next/dynamic';
import CountrySelect from '@/components/CountrySelect';
import NewsList from '@/components/NewsList';
import Footer from '@/components/Footer';

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

      <CountrySelect />
      <div className="container">
        <NewsList island={undefined} />
        <WeatherStage />
        <SportsTicker />
        <HurricaneTracker />
        <IslandFerriesPanel />
        <IslandMoviesPanel />
      </div>
      <Footer />
    </>
  );
}
