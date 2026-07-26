import React from 'react';
import { OriginForm } from '@/components/OriginForm';
import { 
  Label, 
  RefId, 
  MarginNote, 
  ReferenceSnippet, 
  ComponentAtlas
} from '@/components/AtelierPrimitives';
import { ClientTrackerNote } from '@/components/ClientTrackerNote';
import { ActiveFoliosList } from '@/components/ActiveFoliosList';
export default function Home() {
  return (
    <main className="min-h-screen text-[color:var(--color-ink)]">
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1180px] px-8 pt-20 pb-32">
          {}
          <div className="flex flex-wrap items-center justify-between gap-4 reveal">
            <Label>Working board · Fig. 01</Label>
            <RefId className="opacity-80">a quiet workspace for public learning</RefId>
          </div>
          {}
          <div className="mt-10 grid grid-cols-12 gap-8">
            {}
            <article className="paper-sheet paper-lift relative col-span-12 lg:col-span-8 p-12 md:p-14 reveal reveal-delay-1">
              <span className="paper-clip -top-4 left-14" />
              <div className="flex items-start justify-between">
                <RefId>№ 004 · OBJECTIVE</RefId>
              </div>
              <h2 className="mt-12 font-serif text-[3.8rem] md:text-[5rem] leading-[0.98] tracking-[-0.02em]">
                A place to <span className="italic">think slowly</span>,
                <br />
                in <span className="italic">public</span>, for years.
              </h2>
              <p className="mt-10 max-w-[54ch] font-serif text-[1.06rem] leading-[1.75] text-[color:var(--color-ink-soft)]">
                Sync is a Learn-in-Public workspace shaped like an atelier —
                not a dashboard. Declare a{" "}
                <a className="ink-link">Learning Goal</a>, file a{" "}
                <a className="ink-link">Daily Entry</a>, tend your{" "}
                <a className="ink-link">Streak</a>, and — when a body of work
                has settled — share a <a className="ink-link">Public Link</a>{" "}
                to your archive.
              </p>
              {}
              <div className="mt-14">
                <Label>Begin a folio</Label>
                <div className="mt-4">
                  <OriginForm />
                </div>
              </div>
            </article>
            {}
            <aside className="col-span-12 lg:col-span-4 flex flex-col gap-8 reveal reveal-delay-2">
              <ClientTrackerNote />
              <ActiveFoliosList />
            </aside>
          </div>
        </div>
      </section>
      <ComponentAtlas />
    </main>
  );
}
