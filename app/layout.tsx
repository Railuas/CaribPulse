import './globals.css'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'CaribPulse — Caribbean News & Weather', description: 'Real-time weather, hurricanes, and curated news across the Caribbean.' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>
    <header className="border-b border-neutral-800 sticky top-0 z-50 backdrop-blur bg-neutral-950/70">
      <div className="container py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="h-8 w-8 rounded-xl bg-brand-600 grid place-items-center font-bold">CP</a>
          <div><div className="font-semibold">CaribPulse</div><div className="text-xs text-neutral-400">News · Weather · Hurricanes</div></div>
        </div>
        <nav className="hidden md:flex gap-6 text-sm text-neutral-300">
          <a href="/#weather" className="hover:text-white">Weather</a>
          <a href="/#news" className="hover:text-white">News</a>
          <a href="/hurricanes" className="hover:text-white">Hurricanes</a>
          <a href="/bookmarks" className="hover:text-white">Bookmarks</a>
          <a href="/admin" className="hover:text-white">Admin</a>
        </nav>
      </div>
    </header>
    {children}
    <footer className="border-t border-neutral-800 mt-16">
      <div className="container py-10 text-sm text-neutral-400 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12">
        <div className="grow"><div className="font-semibold text-neutral-200">CaribPulse</div><div>Open‑Meteo, NHC, curated RSS. Built for the Caribbean.</div></div>
        <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
          <div><div className="text-neutral-300 mb-2">Explore</div><ul className="space-y-1"><li><a href="/hurricanes" className="hover:text-white">Hurricane tracker</a></li><li><a href="/bookmarks" className="hover:text-white">Bookmarks</a></li></ul></div>
          <div><div className="text-neutral-300 mb-2">Admin</div><ul className="space-y-1"><li><a href="/admin" className="hover:text-white">Feeds JSON editor</a></li></ul></div>
        </div>
      </div>
    </footer>
  </body></html>); }
