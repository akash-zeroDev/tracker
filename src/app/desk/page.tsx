import React from 'react';
import { getRecentGoals } from '@/app/actions';
import { ArchivalLink as Link } from '@/components/transitions/ArchivalLink';
import { Label, RefId, SectionHeading, FoldRule } from '@/components/AtelierPrimitives';
import { format } from 'date-fns';
import { InkRegion } from '@/components/transitions/InkPrimitives';
export default async function DeskPage() {
  const activeFolios = await getRecentGoals(10);
  return (
    <main className="min-h-screen text-[color:var(--color-ink)] pb-32">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-12 pt-16">
        {}
        <InkRegion priority={1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-[34ch]">
            <SectionHeading index="§ I" title="The Desk" hint="active work" />
            <p className="mt-8 font-serif text-[1.1rem] leading-[1.6] text-[color:var(--color-ink-soft)] italic">
              Your active volumes, spread out and waiting. These are the folios currently in progress before they are sealed in the vault.
            </p>
          </div>
          <div className="flex gap-12 font-mono text-[10px] tracking-[0.2em] uppercase text-[color:var(--color-ink)] border-l border-[color:var(--color-rule)] pl-8">
            <div className="flex flex-col gap-2">
              <span className="opacity-50">Active Folios</span>
              <span className="text-xl">{activeFolios.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="opacity-50">Capacity</span>
              <span className="text-xl">10 max</span>
            </div>
            </div>
          </div>
        </InkRegion>
        <InkRegion priority={3}>
          <FoldRule className="mb-16" />
        </InkRegion>
        {}
        <InkRegion priority={2}>
          {activeFolios.length === 0 ? (
          <div className="py-32 text-center">
            <h2 className="font-serif text-[2rem] italic text-[color:var(--color-ink-soft)]">
              The desk is completely clear.
            </h2>
            <p className="mt-4 font-serif">
              Begin a new folio from the landing page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 items-start">
            {activeFolios.map((goal: any, index: number) => {
              const latestEntry = goal.entries[0];
              const folioRef = goal.id.split('-')[0].substring(0, 4).toUpperCase();
              return (
                <Link key={goal.id} href={`/edit/${goal.id}`} className="group block outline-none">
                  <div className="relative pt-6 transition-transform duration-300 group-hover:-translate-y-1">
                    {}
                    <div className="absolute top-[2px] left-0 bg-[color:var(--color-paper)] border border-b-0 border-[color:var(--color-rule)] px-4 py-1.5 rounded-t-sm z-30 transition-colors group-hover:bg-[color:var(--color-ink)] group-hover:text-[color:var(--color-paper)] group-hover:border-[color:var(--color-ink)]">
                      <span className="font-mono text-[9px] tracking-[0.2em] uppercase">
                        {goal.category || 'Uncategorized'}
                      </span>
                    </div>
                    {}
                    <div className="paper-sheet p-6 h-full min-h-[320px] flex flex-col justify-between shadow-sm transition-all duration-300 group-hover:shadow-md relative z-20 bg-[color:var(--color-paper)] border-[color:var(--color-rule)] group-hover:border-[color:var(--color-ink-soft)]">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <RefId className="opacity-60 group-hover:opacity-100 transition-opacity">F-{folioRef}</RefId>
                          {goal.currentStreak > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 border border-[color:var(--color-burgundy)] text-[color:var(--color-burgundy)] rounded-none text-[10px] font-mono uppercase tracking-widest bg-[color:var(--color-burgundy)]/5">
                              {goal.currentStreak} day streak
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif text-[1.8rem] leading-[1.1] tracking-tight group-hover:text-[color:var(--color-burgundy)] transition-colors line-clamp-3">
                          {goal.title}
                        </h3>
                        <p className="mt-4 font-serif text-[0.95rem] italic text-[color:var(--color-ink-soft)] line-clamp-2">
                          {goal.description || 'No description provided.'}
                        </p>
                      </div>
                      {}
                      {latestEntry ? (
                        <div className="mt-8 border-t border-dashed border-[color:var(--color-rule)] pt-4 relative">
                          <div className="absolute -top-[1px] left-0 w-8 h-[1px] bg-[color:var(--color-ink)] opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Label className="mb-2">Latest Fragment</Label>
                          <p className="font-serif text-[0.9rem] leading-snug line-clamp-2">
                            {latestEntry.content || 'Logged a streak without notes.'}
                          </p>
                          <div className="mt-2 text-[9px] font-mono uppercase tracking-wider text-[color:var(--color-ink-soft)]">
                            {format(new Date(latestEntry.createdAt), 'dd MMM yyyy')}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-8 border-t border-dashed border-[color:var(--color-rule)] pt-4">
                          <Label className="mb-2 opacity-50">Latest Fragment</Label>
                          <p className="font-serif text-[0.9rem] leading-snug italic text-[color:var(--color-ink-soft)]">
                            Awaiting first fragment.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        </InkRegion>
      </div>
    </main>
  );
}
