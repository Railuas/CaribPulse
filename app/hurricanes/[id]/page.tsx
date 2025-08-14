interface Props{ params:{ id:string } }
export default function Storm({params}:Props){
  const id = decodeURIComponent(params.id)
  return (<main className="container" style={{padding:'2rem 0', display:'grid', gap:24}}>
    <h1 style={{fontSize:'1.5rem',fontWeight:700}}>Storm details</h1>
    <div className="card" style={{padding:16}}>
      <div style={{fontSize:12,color:'#a3a3a3',marginBottom:8}}>Some NHC pages deny embedding; if blank, use the link below.</div>
      <div style={{aspectRatio:'16/9', width:'100%', borderRadius:12, overflow:'hidden', border:'1px solid #262626'}}>
        <iframe style={{width:'100%',height:'100%'}} src="https://www.nhc.noaa.gov/" title="NHC"></iframe>
      </div>
      <a className="underline" style={{marginTop:8, display:'inline-block'}} href="https://www.nhc.noaa.gov/" target="_blank">Open NHC site ↗</a>
    </div>
  </main>)
}
