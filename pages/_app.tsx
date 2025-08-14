import type { AppProps } from 'next/app';
import Link from 'next/link';
import '../styles/global.css';
import '../styles/addons.css';
import '../styles/news.css';
import '../styles/layout-hotfix.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link href="/" className="brand">CaribePulse</Link>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/hurricanes">Hurricanes</Link>
            <Link href="/ferries">Ferries</Link>
            <Link href="/movies">Movies</Link>
            <a href="https://zoom.earth" rel="noreferrer" target="_blank">Zoom Earth ↗</a>
          </nav>
        </div>
      </header>
      <main className="site-main container">
        <Component {...pageProps} />
      </main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="brand">CaribePulse</div>
            <div className="muted small">Live weather, news & travel across the Caribbean.</div>
          </div>
          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href="/hurricanes">Hurricanes</Link>
            <Link href="/ferries">Ferries</Link>
            <Link href="/movies">Movies</Link>
          </div>
          <div className="muted small">© {new Date().getFullYear()} CaribePulse</div>
        </div>
      </footer>
    </>
  );
}
