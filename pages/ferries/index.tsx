import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

export default function FerriesDetail(){
  const { query } = useRouter();
  const country = typeof query.country === 'string' ? query.country : undefined;
  const title = country ? `Ferries — ${country}` : 'Ferries';

  const routes = [
    { route:'St. Kitts ↔ Nevis', operator:'Sea Bridge', times:['06:30','08:00','10:00','12:00','14:00','16:30'] },
    { route:'Trinidad ↔ Tobago', operator:'TTIT', times:['07:30','10:30','14:00','17:30'] },
    { route:'St. Lucia ↔ Martinique', operator:'Express des Iles', times:['09:15','18:00'] },
  ];

  return (
    <Layout>
      <Head><title>{title} | Magnetide</title></Head>
      <h1>{title}</h1>
      <div className="card">
        <table className="table">
          <thead><tr><th>Route</th><th>Operator</th><th>Today</th></tr></thead>
          <tbody>
            {routes.map((r,i)=>(
              <tr key={i}><td>{r.route}</td><td>{r.operator}</td><td>{r.times.join(' • ')}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="caption">Schedules vary; always confirm with operators.</p>
    </Layout>
  );
}
