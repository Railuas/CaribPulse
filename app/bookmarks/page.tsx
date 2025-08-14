'use client'
import { useEffect, useState } from 'react'
type NewsItem = { title:string; link:string; pubDate?:string; source?:string }
export default function Bookmarks(){
  const [items,setItems]=useState<NewsItem[]>([])
  useEffect(()=>{ const raw=localStorage.getItem('bookmarks')||'[]'; setItems(JSON.parse(raw)) },[])
  const remove=(link:string)=>{ const list=items.filter(i=>i.link!==link); setItems(list); localStorage.setItem('bookmarks', JSON.stringify(list)) }
  return (<main className="container py-10">
    <h1 className="text-3xl font-semibold">Bookmarks</h1>
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      {items.length? items.map((n,i)=>(
        <div key={i} className="card p-4">
          <div className="text-sm text-neutral-400">{n.source||'Saved'}</div>
          <a className="font-medium mt-1 block hover:underline" href={n.link} target="_blank">{n.title}</a>
          <div className="mt-3 flex gap-2">
            <button className="badge hover:bg-neutral-800" onClick={()=>remove(n.link)}>Remove</button>
          </div>
        </div>
      )): <div className="text-neutral-400">No bookmarks yet.</div>}
    </div>
  </main>)
}
