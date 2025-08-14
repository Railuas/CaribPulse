'use client'
import { useEffect, useState } from 'react'
export default function Admin(){
  const [txt,setTxt]=useState('')
  const [ok,setOk]=useState(true)
  useEffect(()=>{ fetch('/feeds.json').then(r=>r.text()).then(setTxt)},[])
  const onChange=(v:string)=>{ setTxt(v); try{ JSON.parse(v); setOk(true)}catch{setOk(false)} }
  const download=()=>{
    const blob = new Blob([txt], {type:'application/json'})
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='feeds.json'; a.click()
  }
  return (<main className="container py-10">
    <h1 className="text-2xl font-semibold">Feeds JSON Editor</h1>
    <p className="text-neutral-400 mt-2">Edit your feed list below and click **Download**. Replace <code>/public/feeds.json</code> in your repo with the downloaded file and push to update (no code changes).</p>
    <textarea className="w-full h-96 mt-4 p-3 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-sm"
      value={txt} onChange={e=>onChange(e.target.value)} />
    <div className="mt-3 flex gap-3">
      <button className="btn" onClick={download} disabled={!ok}>Download JSON</button>
      {!ok && <span className="text-red-400 text-sm">JSON has errors. Fix before downloading.</span>}
    </div>
  </main>)
}
