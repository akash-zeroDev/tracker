import React from 'react';
import { getGoalBySlug } from '@/app/actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

import { Label, RefId } from '@/components/AtelierPrimitives';
import { PublicFragmentsList } from '@/components/PublicFragmentsList';

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const goal = await getGoalBySlug(params.slug);
  
  if (!goal) return { title: 'Not Found' };
  
  return {
    title: goal.title,
    description: `Track ${goal.title} on Sync.`,
    openGraph: {
      title: `${goal.title} | Sync`,
      description: `Track ${goal.title} on Sync.`,
    },
  };
}

export default async function PublicGoalPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const goal = await getGoalBySlug(params.slug);

  if (!goal) {
    notFound();
  }

  if (!goal.isPublic) {
    return (
      <main className="min-h-screen text-[color:var(--color-ink)] flex items-center justify-center p-8 bg-[color:var(--color-surface)]">
        <div className="paper-sheet paper-lift p-10 max-w-lg w-full text-center">
          <Label>Archive Sealed</Label>
          <h2 className="mt-4 font-serif text-[1.8rem] leading-[1.2] italic text-[color:var(--color-ink-soft)]">
            This volume is currently kept in the private vault.
          </h2>
          <p className="mt-6 font-serif text-[0.9rem] opacity-60">
            The curator has withdrawn this edition from the public shelf.
          </p>
        </div>
      </main>
    );
  }

  // Removed old lattice logic variables that are no longer used by Atelier design

  return (
    <main className="min-h-screen text-[color:var(--color-ink)]">
      <section className="bg-[color:var(--color-paper-deep)]/30 min-h-[80vh]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-12 gap-10 px-8 py-24 md:py-32">
          
          {/* Left Description Column */}
          <div className="col-span-12 md:col-span-4">
            <Label>Fig. 04 · Public link</Label>
            <h2 className="mt-5 font-serif text-[2.4rem] leading-[1.1] tracking-tight">
              An archive <span className="italic">others</span>
              <br /> can quietly read.
            </h2>
            <p className="mt-6 max-w-[36ch] font-serif text-[0.98rem] leading-[1.75] text-[color:var(--color-ink-soft)] whitespace-pre-wrap">
              {goal.description || "The Public Link opens the archive as a bound volume — no editing chrome, no analytics theatre. Beautiful typography, wide margins, a table of contents. Everything permanent."}
            </p>
            <div className="mt-8 inline-flex items-center gap-2 border-b border-[color:var(--color-ink)] pb-1 font-mono text-[0.85rem]">
              <span className="text-[color:var(--color-ink-soft)]">
                sync /
              </span>
              <span>{goal.publicSlug}</span>
            </div>
          </div>

          {/* Right Bound Volume Column */}
          <div className="col-span-12 md:col-span-8">
            <div className="paper-sheet paper-lift relative p-8 md:p-12">
              <span className="paper-clip -top-4 left-16" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <RefId className="break-words">VOLUME · {goal.title.toUpperCase()}</RefId>
                <RefId>{goal.entries.length} ENTRIES · {goal.currentStreak} DAY STREAK</RefId>
              </div>
              <hr className="fold-line my-8" />
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12">
                <div>
                  <Label>Contents</Label>
                  <ul className="mt-5 space-y-2.5 font-serif text-[0.98rem]">
                    {goal.entries.slice(0, 8).map((e, i) => (
                      <li key={e.id} className="truncate">
                        {i + 1}. {e.content ? e.content.slice(0, 24) + '...' : 'Entry'}
                      </li>
                    ))}
                    {goal.entries.length > 8 && (
                      <li className="text-[color:var(--color-ink-soft)] italic">
                        ... and {goal.entries.length - 8} more
                      </li>
                    )}
                    {goal.entries.length === 0 && (
                      <li className="text-[color:var(--color-ink-soft)] italic">
                        (Archive empty)
                      </li>
                    )}
                  </ul>
                </div>
                
                <div className="flex flex-col gap-10">
                  <PublicFragmentsList entries={goal.entries} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Viral CTA - Styled as an Atelier Slip */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 flex justify-center bg-gradient-to-t from-[color:var(--color-paper)] via-[color:var(--color-paper)] to-transparent pointer-events-none pb-8">
        <Link href="/" className="pointer-events-auto">
          <button className="press group inline-flex items-center gap-3 border border-[color:var(--color-ink)] bg-[color:var(--color-ink)] px-6 py-3.5 text-[color:var(--color-paper)] hover:bg-[color:var(--color-burgundy)] hover:border-[color:var(--color-burgundy)]">
            <span className="label-caps text-[color:var(--color-paper)]/80">
              New
            </span>
            <span className="font-serif text-[1rem]">
              Begin your own folio
              <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </span>
          </button>
        </Link>
      </div>
    </main>
  );
}
