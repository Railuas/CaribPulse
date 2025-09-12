import Head from 'next/head';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import NewsList from '@/components/NewsList';

const WeatherStage = dynamic(() => import('@/components/WeatherStage'), { ssr: false });
const SportsTicker = dynamic(() => import('@/components/SportsTicker'), { ssr: false });
const HurricaneTracker = dynamic(() => import('@/components/HurricaneTracker'), { ssr: false });
const IslandFerriesPanel = dynamic(() => import('@/components/IslandFerriesPanel'), { ssr: false });
const IslandMoviesPanel = dynamic(() => import('@/components/IslandMoviesPanel'), { ssr: false });

export default function Home(){
  return (
    <Layout>
      <Head>
        <title>Magnetide — Caribbean Headlines</title>
      </Head>
      <NewsList island={undefined} />
      <WeatherStage />
      <SportsTicker />
      <HurricaneTracker />
      <IslandFerriesPanel />
      <IslandMoviesPanel />
    </Layout>
  );
}
