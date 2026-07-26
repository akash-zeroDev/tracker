import React from 'react';
import { ArchiveManifest } from './ArchiveManifest';
import { getArchiveStats } from '@/app/actions';
import { InkText, InkBlock, InkRule } from './transitions/InkPrimitives';

export function RefId({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <InkText className={`ref-id ${className}`}>{children}</InkText>;
}

export function Label({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <InkText className={`label-caps ${className}`}>{children}</InkText>;
}

export function Stamp({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <InkText className={`archive-stamp ${className}`}>{children}</InkText>;
}

export function MarginNote({ children }: { children: React.ReactNode }) {
  return (
    <InkText className="block font-serif italic text-[0.82rem] leading-snug text-[color:var(--color-ink-soft)]">
      {children}
    </InkText>
  );
}

export function FoldRule({ className = "" }: { className?: string }) {
  return <InkRule className={className} />;
}

export function SectionHeading({
  index,
  title,
  hint,
}: {
  index: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <div className="flex items-baseline gap-4">
        <RefId>{index}</RefId>
        <InkText className="block font-serif text-xl leading-none tracking-tight">{title}</InkText>
      </div>
      {hint && <Label className="hidden sm:inline">{hint}</Label>}
    </div>
  );
}

export function ReferenceSnippet({
  id,
  source,
  note,
}: {
  id: string;
  source: string;
  note: string;
}) {
  return (
    <figure className="group relative pt-2">
      <RefId>{id}</RefId>
      <InkText className="block mt-4 font-serif italic text-[1.02rem] leading-[1.6] text-[color:var(--color-ink)]">
        “{note}”
      </InkText>
      <figcaption className="mt-5 flex items-center justify-between border-t border-[color:var(--color-rule)] pt-3">
        <span className="label-caps">{source}</span>
        <span className="ref-id opacity-60 transition-opacity duration-200 group-hover:opacity-100">cf. R-039</span>
      </figcaption>
    </figure>
  );
}

export async function ComponentAtlas() {
  const stats = await getArchiveStats();
  
  return (
    <section className="mx-auto max-w-[1180px] px-8 py-32">
      <div className="flex items-end justify-between mb-8">
        <div>
          <Label>Fig. 05 · The Archival Record</Label>
          <InkText className="block mt-5 font-serif text-[2.4rem] leading-[1.1] tracking-tight">
            An accumulation of <span className="italic">quiet work</span>.
          </InkText>
        </div>
        <RefId>manifest · 2026</RefId>
      </div>
      <ArchiveManifest 
        fragmentsCount={stats.fragmentsCount}
        longestChain={stats.longestChain}
        activeFoliosCount={stats.activeFoliosCount}
        subjectsCount={stats.subjectsCount}
      />
    </section>
  );
}

export function Stitch({ intensity }: { intensity: number }) {
  if (intensity === 0) {
    return (
      <span
        aria-hidden
        className="block h-[10px] w-[26px] border-t border-dashed border-[color:var(--color-rule)]"
      />
    );
  }
  const opacity = 0.35 + intensity * 0.22;
  return (
    <span
      aria-hidden
      className="block h-[10px] w-[26px] rounded-[1px]"
      style={{
        background: `repeating-linear-gradient(90deg, oklch(0.24 0.015 250 / ${opacity}) 0 4px, transparent 4px 6px)`,
      }}
    />
  );
}

export function ReadingMarkers() {
  const items = [
    { id: "B-11", title: "A Pattern Language", page: "p. 214 / 1171" },
    { id: "B-12", title: "Notes on the Synthesis of Form", page: "p. 63 / 216" },
    { id: "B-13", title: "The Craftsman — Sennett", page: "p. 148 / 326" },
  ];
  return (
    <div className="p-7">
      <div className="flex items-center justify-between">
        <Label>Reading markers</Label>
        <RefId>SHELF · III</RefId>
      </div>
      <ul className="mt-5 divide-y divide-[color:var(--color-rule)]">
        {items.map((b) => (
          <li key={b.id} className="group flex items-baseline gap-3 py-3">
            <span className="ref-id w-12 transition-colors duration-200 group-hover:text-[color:var(--color-ink)]">{b.id}</span>
            <span className="flex-1 font-serif text-[0.98rem] leading-tight">
              {b.title}
            </span>
            <span className="ref-id whitespace-nowrap">{b.page}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5"><MarginNote>
        — Marg. A bookmark is a promise to return; the archive is a promise kept.
      </MarginNote></div>
    </div>
  );
}
