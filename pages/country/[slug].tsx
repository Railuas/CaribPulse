import Head from 'next/head';
import CountrySwitcher from '@/components/CountrySwitcher';
import NewsList from '@/components/NewsList';
import WeatherStage from '@/components/WeatherStage';
import SportsTicker from '@/components/SportsTicker';
import HurricaneTracker from '@/components/HurricaneTracker';
import IslandFerriesPanel from '@/components/IslandFerriesPanel';
import IslandMoviesPanel from '@/components/IslandMoviesPanel';
import { SLUG_TO_COUNTRY } from '@/lib/countryMap';

export default function CountryPage({ countryName }:{ countryName:string }){
  return (
    <>
      <Head>
        <title>Top Stories — {countryName} | Magnetide</title>
        <meta name="description" content={`Latest headlines in ${countryName} — Magnetide.`} />
      </Head>

      <CountrySwitcher />

      {/* Country-specific news with images */}
      <NewsList island={countryName} />

      {/* If your widgets accept a country prop, pass it; otherwise just render */}
      <section className="section"><WeatherStage country={countryName} /></section>
      <section className="section"><SportsTicker country={countryName} /></section>
      <section className="section"><HurricaneTracker country={countryName} /></section>
      <section className="section"><IslandFerriesPanel country={countryName} /></section>
      <section className="section"><IslandMoviesPanel country={countryName} /></section>
    </>
  );
}

export async function getServerSideProps({ params }:{ params:{ slug:string } }){
  const slug = params.slug;
  const countryName = SLUG_TO_COUNTRY[slug] || 'All Caribbean';
  return { props: { countryName } };
}
