import React from 'react';
import { getGoalById } from '@/app/actions';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { TrackerSync } from '@/components/TrackerSync';
import { EmailBackupCard } from '@/components/EmailBackupCard';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
import { ClientLogForm } from '@/components/ClientLogForm';
import { DestroyTracker } from '@/components/DestroyTracker';
import { GoalDescriptionEditor } from '@/components/GoalDescriptionEditor';
import { GoalCategoryEditor } from '@/components/GoalCategoryEditor';
import { ClientLogList } from '@/components/ClientLogList';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { Label, RefId, MarginNote, Stitch } from '@/components/AtelierPrimitives';

export default async function EditGoalPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const goal = await getGoalById(params.id);

  if (!goal) {
    notFound();
  }

  // Generate an approximate grid for the streak ribbon
  const weeks = 12;
  const days = 7;
  const pattern: number[][] = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: days }, (_, d) => {
      const idx = w * 7 + d;
      // Distribute entries visually over the grid
      return idx < goal.entries.length ? (idx % 3 === 0 ? 3 : 2) : 0;
    })
  );

  return (
    <main className="min-h-screen text-[color:var(--color-ink)]">
      <TrackerSync id={goal.id} slug={goal.publicSlug} title={goal.title} />

      {/* STREAK RIBBON HEADER */}
      <section className="border-t border-[color:var(--color-rule)] bg-[color:var(--color-paper-deep)]/40">
        <div className="mx-auto grid max-w-[1180px] grid-cols-12 gap-10 px-8 py-24">
          <div className="col-span-12 md:col-span-4">
            <Label>Fig. 02 · Binding stitch</Label>
            <h2 className="mt-6 font-serif text-[2.4rem] leading-[1.1] tracking-tight">
              <span className="italic break-words">{goal.title}</span>
            </h2>
            <GoalDescriptionEditor goalId={goal.id} initialDescription={goal.description} />
            <GoalCategoryEditor goalId={goal.id} initialCategory={goal.category} />
            <div className="mt-8 flex items-center gap-8">
              <div>
                <RefId>CURRENT</RefId>
                <div className="font-serif text-[2.6rem] leading-none mt-1">{goal.currentStreak}</div>
              </div>
              <div>
                <RefId>LONGEST</RefId>
                <div className="font-serif text-[2.6rem] leading-none mt-1 text-[color:var(--color-ink-soft)]">{goal.longestStreak || goal.currentStreak}</div>
              </div>
              <div>
                <RefId>ENTRIES</RefId>
                <div className="font-serif text-[2.6rem] leading-none mt-1 text-[color:var(--color-ink-soft)]">{goal.entries.length}</div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8">
            <div className="paper-sheet paper-lift relative overflow-hidden p-8">
              <div className="flex items-center justify-between">
                <Label>Signature</Label>
                <RefId>read left → right</RefId>
              </div>
              <div className="mt-7 flex items-end gap-[6px]">
                {pattern.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[6px]">
                    {week.map((v, di) => (
                      <Stitch key={di} intensity={v} />
                    ))}
                  </div>
                ))}
                <div className="ml-4 flex flex-col justify-between self-stretch py-1 label-caps">
                  <span>M</span>
                  <span>W</span>
                  <span>F</span>
                  <span>S</span>
                </div>
              </div>
              <svg
                className="mt-8 w-full"
                viewBox="0 0 800 24"
                preserveAspectRatio="none"
                height="24"
              >
                <path
                  d="M0 12 Q 40 0 80 12 T 160 12 T 240 12 T 320 12 T 400 12 T 480 12 T 560 12 T 640 12 T 720 12 T 800 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  className="text-[color:var(--color-burgundy)]"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* COMPOSER */}
      <section className="mx-auto max-w-[1180px] px-8 py-16 relative z-20">
        <div className="paper-sheet paper-lift p-10 md:p-14 relative max-w-2xl mx-auto md:mx-0">
          <span className="paper-clip -top-4 right-14" />
          <RefId>COMPOSER</RefId>
          <h3 className="mt-3 font-serif text-[1.8rem] leading-[1.2]">Log today&apos;s entry</h3>
          <div className="mt-6 border-t border-[color:var(--color-rule)] pt-6">
            <ClientLogForm goalId={goal.id} />
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative border-t border-[color:var(--color-rule)]">
        <div className="mx-auto max-w-[1180px] px-8 py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Label>Fig. 03 · Daily entries</Label>
              <h2 className="mt-5 font-serif text-[2.6rem] leading-[1.1] tracking-tight">
                Filed <span className="italic">chronologically</span>,
                <br /> in the order they were thought.
              </h2>
            </div>
            <div className="max-w-[32ch]"><MarginNote>
              — Marg. Every entry keeps its reference, its date, its subject,
              and — where useful — a cross-reference to a shelf item or a source.
            </MarginNote></div>
          </div>

          <ClientLogList entries={goal.entries} />
        </div>
      </section>

      {/* MANAGEMENT ZONE */}
      <section className="relative border-t border-[color:var(--color-rule)] bg-[color:var(--color-paper-deep)]/20">
        <div className="mx-auto max-w-[1180px] px-8 py-24">
          <Label>Management Zone</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
            <div className="tracing-paper p-8 paper-lift">
              <h4 className="font-serif text-lg mb-4">Secure Secret Link</h4>
              <EmailBackupCard editUrl={`/edit/${goal.id}`} />
            </div>
            <div className="tracing-paper p-8 paper-lift flex flex-col justify-between">
              <div>
                <h4 className="font-serif text-lg mb-4">Sharing & Deletion</h4>
                <CopyLinkButton 
                  url={`/${goal.publicSlug}`} 
                  defaultText="Copy Public Link" 
                  className="press w-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] font-serif py-3 mb-4" 
                />
              </div>
              <div>
                <DestroyTracker goalId={goal.id} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
