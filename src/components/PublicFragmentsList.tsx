'use client';
import React, { useState } from 'react';
import { EditorialTime } from '@/components/ui/EditorialTime';
interface PublicEntry {
  id: string;
  createdAt: string | number | Date;
  content: string | null;
}
export function PublicFragmentsList({ entries }: { entries: PublicEntry[] }) {
  const [expanded, setExpanded] = useState(false);
  const displayedEntries = expanded ? entries : entries.slice(0, 5);
  if (entries.length === 0) {
    return (
      <article>
        <span className="ref-id">CHAPTER 1</span>
        <h3 className="mt-3 font-serif text-[2rem] leading-[1.15] tracking-tight text-[color:var(--color-ink-soft)] italic">
          Awaiting first entry.
        </h3>
      </article>
    );
  }
  return (
    <div className="flex flex-col gap-10">
      {displayedEntries.map((entry, index) => (
        <article key={entry.id}>
          <div className="flex justify-between items-baseline">
            <span className="ref-id">CHAPTER · § {entries.length - index}</span>
            <EditorialTime date={entry.createdAt} context="compact" className="ref-id opacity-60" />
          </div>
          <h3 className="mt-3 font-serif text-[1.4rem] leading-[1.3] tracking-tight break-words whitespace-pre-wrap">
            {entry.content || 'Logged a streak without notes.'}
          </h3>
        </article>
      ))}
      {entries.length > 5 && (
        <div className="mt-2 flex items-center justify-between border-t border-[color:var(--color-rule)] pt-6">
          <span className="ref-id">showing {displayedEntries.length} of {entries.length}</span>
          {!expanded && (
            <button type="button" onClick={() => setExpanded(true)} className="ink-link text-[13px]">
              Walk the full archive →
            </button>
          )}
          {expanded && (
            <button type="button" onClick={() => setExpanded(false)} className="ink-link text-[13px]">
              Collapse archive ↑
            </button>
          )}
        </div>
      )}
    </div>
  );
}
