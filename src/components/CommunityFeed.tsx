import React from 'react';
import { getCommunityFeed } from '@/app/actions';
import { RefId, Label } from '@/components/AtelierPrimitives';
import Link from 'next/link';

export async function CommunityFeed() {
  const feed = await getCommunityFeed(3);

  if (feed.length === 0) {
    return null;
  }

  return (
    <section className="mt-24 pt-12 border-t border-[color:var(--color-rule)] reveal reveal-delay-3">
      <div className="flex items-center justify-between mb-10">
        <Label>Community Desk</Label>
        <RefId>PULSE · RECENT</RefId>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {feed.map((goal, idx) => {
          const entry = goal.entries[0];
          const snippet = entry?.content 
            ? `“${entry.content.trim()}”`
            : "“Awaiting first fragment.”";
          
          return (
            <Link 
              href={`/${goal.publicSlug}`} 
              key={goal.id} 
              className="group flex flex-col justify-between paper-sheet paper-lift p-8 relative transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Subtle physical detail: A paperclip on the middle card */}
              {idx === 1 && <span className="paper-clip -top-4 right-10" />}
              
              <div>
                <div className="flex items-start justify-between mb-5">
                  <span className="archive-stamp !text-[0.6rem] !px-1.5 opacity-60 group-hover:opacity-100 group-hover:border-[color:var(--color-ink)] transition-all">
                    {goal.currentStreak} DAY STREAK
                  </span>
                  <RefId>#{goal.id.split('-')[0].substring(0,4)}</RefId>
                </div>
                
                <h3 className="font-serif text-[1.4rem] leading-tight text-[color:var(--color-ink)] group-hover:text-[color:var(--color-burgundy)] transition-colors line-clamp-2">
                  {goal.title}
                </h3>
                
                <div className="mt-6 relative">
                  <p className="font-serif italic text-[0.95rem] leading-[1.65] text-[color:var(--color-ink-soft)] line-clamp-4">
                    {snippet}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-dashed border-[color:var(--color-rule)] flex items-center justify-between">
                <span className="label-caps opacity-50 group-hover:opacity-100 transition-opacity">View Folio</span>
                <span className="font-serif text-lg leading-none opacity-50 group-hover:opacity-100 group-hover:text-[color:var(--color-burgundy)] transition-colors">
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
