import Head from 'next/head';
import Link from 'next/link';

export default function Page(){
  return (
    <div className="container">
      <Head><title>Magnetide — Placeholder</title></Head>
      <h1>Coming soon</h1>
      <p className="lead">This section will have richer data and filters. For now, go back to the <Link href="/">home page</Link>.</p>
    </div>
  );
}
