export default function Footer(){
  return (
    <footer style={{marginTop:40, borderTop:'1px solid var(--border)', padding:'28px 16px', background:'rgba(255,255,255,.02)'}}>
      <div className="container" style={{padding:'0'}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:18}}>
          <div>
            <div style={{fontWeight:800, fontSize:18}}>Magnetide</div>
            <p className="small muted" style={{marginTop:8}}>
              Magnetic Caribbean updates — news, weather, sports, ferries, and movies.
            </p>
          </div>
          <div>
            <div style={{fontWeight:700}}>Sections</div>
            <ul className="small" style={{listStyle:'none', padding:0, margin:'10px 0 0'}}>
              <li><a href="/weather">Weather</a></li>
              <li><a href="/sports">Sports</a></li>
              <li><a href="/ferries">Ferries</a></li>
              <li><a href="/movies">Movies</a></li>
            </ul>
          </div>
          <div>
            <div style={{fontWeight:700}}>About</div>
            <ul className="small" style={{listStyle:'none', padding:0, margin:'10px 0 0'}}>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Advertise</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
          <div>
            <div style={{fontWeight:700}}>Follow</div>
            <ul className="small" style={{listStyle:'none', padding:0, margin:'10px 0 0'}}>
              <li><a href="#" rel="noreferrer">Instagram</a></li>
              <li><a href="#" rel="noreferrer">Twitter/X</a></li>
              <li><a href="#" rel="noreferrer">TikTok</a></li>
            </ul>
          </div>
        </div>
        <div className="small muted" style={{marginTop:18}}>
          © {new Date().getFullYear()} Magnetide. Headlines are sourced from publishers via RSS; logos and names are trademarks of their respective owners.
        </div>
      </div>
    </footer>
  );
}
