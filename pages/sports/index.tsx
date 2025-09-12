import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

export default function SportsDetail(){
  const { query } = useRouter();
  const country = typeof query.country === 'string' ? query.country : undefined;
  const title = country ? `Sports — ${country}` : 'Sports';

  const cpl = [
    { team: 'Guyana Amazon Warriors', pts: 14, form: 'W W L W W' },
    { team: 'Trinbago Knight Riders', pts: 12, form: 'W D W W L' },
    { team: 'Jamaica Tallawahs', pts: 10, form: 'L W W D L' },
  ];

  const football = [
    { fixture:'JAM vs TRI', comp:'Concacaf NL', time:'Sat 7:00 PM' },
    { fixture:'BRB vs LCA', comp:'Friendly', time:'Sun 4:30 PM' },
    { fixture:'GUY vs SKN', comp:'Concacaf NL', time:'Tue 8:00 PM' },
  ];

  const track = [
    { event:'100m Women', meet:'Diamond League Final', note:'Elaine T. season wrap' },
    { event:'200m Men', meet:'Commonwealth Prep', note:'Rising prospects' }
  ];

  return (
    <Layout>
      <Head><title>{title} | Magnetide</title></Head>
      <h1>{title}</h1>

      <h2 className="section-title" style={{marginTop:16}}>CPL Table</h2>
      <div className="card">
        <table className="table">
          <thead><tr><th>Team</th><th>Pts</th><th>Form</th></tr></thead>
          <tbody>
            {cpl.map((r,i)=>(<tr key={i}><td>{r.team}</td><td>{r.pts}</td><td>{r.form}</td></tr>))}
          </tbody>
        </table>
      </div>

      <div className="divider" />

      <h2 className="section-title">Football — Fixtures</h2>
      <div className="card">
        <table className="table">
          <thead><tr><th>Fixture</th><th>Competition</th><th>Time</th></tr></thead>
          <tbody>
            {football.map((m,i)=>(<tr key={i}><td>{m.fixture}</td><td>{m.comp}</td><td>{m.time}</td></tr>))}
          </tbody>
        </table>
      </div>

      <div className="divider" />

      <h2 className="section-title">Track & Field — Highlights</h2>
      <div className="grid trio" style={{marginTop:12}}>
        {track.map((t,i)=>(
          <div className="card" key={i}>
            <div style={{fontWeight:700}}>{t.event}</div>
            <div className="small" style={{marginTop:6}}>{t.meet}</div>
            <div className="muted small" style={{marginTop:6}}>{t.note}</div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
