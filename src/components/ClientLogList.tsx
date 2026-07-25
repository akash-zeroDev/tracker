'use client';

import React, { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { Label, RefId } from '@/components/AtelierPrimitives';

interface ClientLogListProps {
  entries: {
    id: string;
    createdAt: Date;
    content: string | null;
  }[];
}

export function ClientLogList({ entries }: ClientLogListProps) {
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 3;

  const displayedEntries = expanded ? entries : entries.slice(0, LIMIT);
  const hasMore = entries.length > LIMIT;

  if (entries.length === 0) {
    return (
      <p className="font-serif italic text-lg text-[color:var(--color-ink-soft)] mt-16">
        The archive is currently empty. Begin by filing your first entry.
      </p>
    );
  }

  return (
    <div className="mt-16">
      <div className={`relative ${expanded ? 'max-h-[600px] overflow-y-auto pr-2 custom-scrollbar border-b border-[color:var(--color-rule)]' : ''}`}>
        <ol className="">
          {displayedEntries.map((e, i) => (
            <li
              key={e.id}
              className="row-hover group relative grid grid-cols-12 gap-8 border-t border-[color:var(--color-rule)] px-4 py-10 -mx-4"
              style={{ contentVisibility: 'auto' } as React.CSSProperties}
            >
              <span className="bookmark absolute -left-1 top-8" aria-hidden />
              <div className="col-span-12 md:col-span-2">
                <RefId>{e.id.split('-')[0]}</RefId>
                <div className="mt-3 font-mono text-[0.85rem] text-[color:var(--color-ink)]">
                  {format(new Date(e.createdAt), 'dd MMM yyyy')}
                </div>
                <div className="mt-4 label-caps opacity-60">
                  {formatDistanceToNow(new Date(e.createdAt))} ago
                </div>
              </div>
              <div className="col-span-12 md:col-span-7">
                <p className="font-serif text-[1.1rem] leading-[1.75] text-[color:var(--color-ink)] whitespace-pre-wrap">
                  {e.content || 'Logged a streak without notes.'}
                </p>
              </div>
              <div className="row-margin col-span-12 md:col-span-3 pl-4 md:opacity-100 border-l border-dashed border-[color:var(--color-rule)]">
                <Label>Metadata</Label>
                <div className="mt-3 font-mono text-[0.82rem] text-[color:var(--color-ink-soft)]">
                  Chain active
                </div>
              </div>
              {i === 0 && !expanded && (
                <span className="absolute right-4 top-8 archive-stamp pinned-tilt">Most recent</span>
              )}
            </li>
          ))}
        </ol>
      </div>
      
      {!expanded && hasMore && (
        <div className="mt-8 border-t border-[color:var(--color-rule)] pt-8 text-center">
          <button 
            onClick={() => setExpanded(true)}
            className="press inline-flex items-center gap-2 bg-[color:var(--color-paper-deep)] border border-[color:var(--color-rule)] text-[color:var(--color-ink)] px-6 py-2.5 font-mono text-xs tracking-widest uppercase hover:bg-[color:var(--color-rule)] transition-colors rounded-sm"
          >
            View all {entries.length} entries
          </button>
        </div>
      )}
    </div>
  );
}
