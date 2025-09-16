import React from 'react';
import Link from 'next/link';

export type NewsItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  country: string;
  image?: string;
  published?: string;
};

export default function NewsCard({ item }: { item: NewsItem }){
  const href = `/read?url=${encodeURIComponent(item.link)}`;
  return (
    <article className="rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
      {item.image ? (
        <img src={item.image} alt="" className="w-full h-40 object-cover border-b border-white/10" loading="lazy" />
      ) : null}
      <div className="p-3 sm:p-4">
        <div className="text-[10px] uppercase opacity-70">{item.source} • {item.country}</div>
        <h3 className="mt-1 font-semibold leading-snug line-clamp-2">{item.title}</h3>
        <div className="mt-3">
          <Link href={href} className="text-xs underline opacity-80 hover:opacity-100">Read</Link>
        </div>
      </div>
    </article>
  );
}