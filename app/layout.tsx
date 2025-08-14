import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CaribePulse — Caribbean News & Weather',
  description: 'Real-time weather, hurricanes, schedules, and curated headlines across the Caribbean.',
  icons: { icon: '/favicon.svg' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>
    <header className="border-b border-neutral-800 sticky top-0 z-50 backdrop-blur bg-gradient-to-r from-brand-900/70 via-brand-700/40 to-brand-900/70">
      <div className="container py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img src="/favicon.svg" alt="CaribePulse" className="h-8 w-8 rounded-xl"/>
          <div>
            <div className="font-semibold">CaribePulse</div>
            <div className="text-xs text-neutral-300">News · Weather · Islands</div>
          </div>
        </a>
        <nav className="flex gap-4 text-sm text-neutral-200">
          <a href="/#news" className="hover:text-white hidden sm:inline">News</a>
          <a href="/schedules" className="hover:text-white">Schedules</a>
          <a href="/hurricanes" className="hover:text-white hidden sm:inline">Hurricanes</a>
        </nav>
      </div>
    </header>
    {children}
    <footer className="border-t border-neutral-800 mt-16">
      <div className="container py-10 text-sm text-neutral-400 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12">
        <div className="grow">
          <div className="font-semibold text-neutral-200">CaribePulse</div>
          <div>Open‑Meteo for weather, curated RSS for news. Ferries & flights via operator/public endpoints.</div>
        </div>
        <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
          <div>
            <div className="text-neutral-300 mb-2">Explore</div>
            <ul className="space-y-1">
              <li><a href="/#news" className="hover:text-white">News</a></li>
              <li><a href="/schedules" className="hover:text-white">Schedules</a></li>
              <li><a href="/hurricanes" className="hover:text-white">Hurricanes</a></li>
            </ul>
          </div>
          <div>
            <div className="text-neutral-300 mb-2">Legal</div>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </body></html>); }
