import React from 'react';
import Link from 'next/link';

export type MovieItem = {
  cinema: string;
  url?: string;
  title: string;
  times?: string[];
  poster?: string;
  country?: string; // island/country badge
};

export default function MovieCard({ item }: { item: MovieItem }) {
  const times = (item.times || []).slice(0, 10);
  const poster = item.poster && item.poster.startsWith('//') ? `https:${item.poster}` : item.poster;

  return (
    <article className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 hover:bg-white/10 transition-colors">
      <div className="flex gap-3">
        <div className="shrink-0">
          {poster ? (
            <img
              src={poster}
              alt={item.title}
              className="w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-md border border-white/10"
              loading="lazy"
            />
          ) : (
            <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-md bg-neutral-800/70 border border-white/10 flex items-center justify-center text-[10px] uppercase tracking-wide opacity-70">
              No poster
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight line-clamp-2">{item.title}</h3>
          </div>

          <div className="mt-1 text-xs sm:text-[13px] opacity-80">
            {item.cinema}
            {item.country ? (
              <span className="ml-2 px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase opacity-80">
                {item.country}
              </span>
            ) : null}
          </div>

          <div className="mt-2 flex flex-wrap gap-1">
            {times.length ? (
              times.map((t, i) => (
                <span key={i} className="px-2 py-1 rounded-md border border-white/10 bg-white/5 text-xs">
                  {t}
                </span>
              ))
            ) : (
              <span className="text-xs opacity-70">Times TBA</span>
            )}
          </div>

          {item.url ? (
            <div className="mt-3">
              <Link
                href={item.url}
                target="_blank"
                className="text-xs underline opacity-80 hover:opacity-100"
              >
                Cinema page
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}