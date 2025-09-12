import Link from 'next/link';
import CountrySelect from '@/components/CountrySelect';
import Footer from '@/components/Footer';

export default function Layout({ children }:{ children: React.ReactNode }){
  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="brand">Magnetide</Link>
          <div style={{marginLeft:'auto'}}>
            <CountrySelect />
          </div>
        </div>
      </div>
      <main className="container">{children}</main>
      <Footer />
    </>
  );
}
