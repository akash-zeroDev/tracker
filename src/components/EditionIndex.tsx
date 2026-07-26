'use client';
import React from 'react';
import { Label } from './AtelierPrimitives';
export interface Entry {
  createdAt: Date;
  content: string;
}
export function EditionIndex({ entries }: { entries: Entry[] }) {
  const days = Array.from({ length: 80 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (79 - i));
    const entry = entries.find(e => new Date(e.createdAt).toDateString() === d.toDateString());
    return {
      date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      hasEntry: !!entry,
      excerpt: entry?.content
    };
  });
  return (
    <div className="w-full flex flex-col pt-4">
      <div className="flex justify-between items-end mb-4">
         <Label>Volume Pagination Edge</Label>
         <span className="font-serif italic text-[0.75rem] opacity-60">Last 80 pages</span>
      </div>
      <div className="flex w-full h-[24px] gap-[1px] bg-[color:var(--color-rule)] p-[1px] rounded-sm shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]">
        {days.map((day, i) => (
          <div key={i} className="flex-1 group relative h-full bg-[color:var(--color-paper)]">
            {day.hasEntry && (
               <div className="absolute inset-0 bg-[color:var(--color-ink)] opacity-85 transition-opacity hover:opacity-100 hover:scale-x-150 z-10 origin-bottom" />
            )}
            {day.hasEntry && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-56 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none">
                 <div className="tracing-paper p-4 text-[0.8rem] font-serif shadow-md paper-lift">
                   <span className="block opacity-50 mb-2 text-[0.7rem] uppercase tracking-widest font-mono">{day.date}</span>
                   {day.excerpt && <span className="line-clamp-3 text-[color:var(--color-ink)] italic leading-snug">"{day.excerpt}"</span>}
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[0.65rem] font-mono uppercase opacity-40">
        <span>Pg. -80</span>
        <span>Current Pg.</span>
      </div>
    </div>
  );
}
