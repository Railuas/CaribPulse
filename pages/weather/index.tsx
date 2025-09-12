import { useRouter } from 'next/router';
import Head from 'next/head';
import CountrySelect from '@/components/CountrySelect';
import Footer from '@/components/Footer';

export default function WeatherPage(){
  const { query } = useRouter();
  const country = typeof query.country === 'string' ? query.country : undefined;
  const title = country ? `Weather — ${country}` : 'Weather';

  return (
    <>
      <Head><title>{title} | Magnetide</title></Head>
      <CountrySelect />
      <div className="container">
        <h1>{title}</h1>
        <p className="muted small">Powered by public sources. Map via Windy.</p>
        <div className="card" style={{padding:0, overflow:'hidden'}}>
          {/* Windy embed centered on the Caribbean */}
          <iframe
            title="Windy map"
            width="100%"
            height="520"
            src="https://embed.windy.com/embed2.html?lat=15.0&lon=-65.0&detailLat=15.0&detailLon=-65.0&zoom=5&level=surface&overlay=wind&product=ecmwf&menu=true&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=kt&metricTemp=%C2%B0C&radarRange=-1"
            loading="lazy"
            style={{border:0}}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
