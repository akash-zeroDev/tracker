'use client';

import React, { useEffect, useState } from 'react';
import { useTrackers } from '@/hooks/useTrackers';
import { getGoalById } from '@/app/actions';
import { Label, RefId } from '@/components/AtelierPrimitives';
import Link from 'next/link';

type GoalData = {
  title: string;
  entries: { id: string; content: string | null; createdAt: Date }[];
};

export function ClientTrackerNote() {
  const { trackers, isLoaded } = useTrackers();
  const [goal, setGoal] = useState<GoalData | null>(null);

  useEffect(() => {
    if (isLoaded && trackers.length > 0) {
      const latest = trackers[0];
      getGoalById(latest.id).then((data) => {
        if (data) {
          setGoal({
            title: data.title,
            entries: data.entries,
          });
        }
      });
    }
  }, [isLoaded, trackers]);

  // If loading or no trackers, show the default static dummy note (as before)
  if (!isLoaded || trackers.length === 0 || !goal) {
    return (
      <div className="tracing-paper paper-lift relative p-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <RefId>№ 004.128 · TODAY</RefId>
          <Label>Tue · 03.XI</Label>
        </div>
        <h3 className="mt-5 font-serif text-[1.35rem] leading-[1.35]">
          On the quiet <span className="italic">difficulty</span> of small daily entries.
        </h3>
        <p className="mt-4 font-serif text-[0.95rem] leading-[1.7] text-[color:var(--color-ink-soft)]">
          Attempted a first sketch of a state machine for the entry composer. The hard
          part isn&apos;t the machine — it&apos;s admitting that most days the note is only two
          sentences long, and that this is enough.
        </p>
        <hr className="fold-line my-6" />
        <div className="flex items-center justify-between">
          <Label>Filed 07:38</Label>
          <span className="text-[0.9rem] font-serif italic text-[color:var(--color-ink-soft)]">
            Awaiting first folio
          </span>
        </div>
      </div>
    );
  }

  const latestEntry = goal.entries[0];
  const dateStr = latestEntry 
    ? new Date(latestEntry.createdAt).toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' }) 
    : 'No entries';
    
  const timeStr = latestEntry
    ? new Date(latestEntry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <div className="tracing-paper paper-lift relative p-7">
      <div className="flex items-center justify-between">
        <RefId className="truncate mr-4">FOLIO · {goal.title.toUpperCase()}</RefId>
        <Label className="shrink-0">{dateStr}</Label>
      </div>
      <h3 className="mt-5 font-serif text-[1.35rem] leading-[1.35] break-words line-clamp-2">
        {goal.title}
      </h3>
      <p className="mt-4 font-serif text-[0.95rem] leading-[1.7] text-[color:var(--color-ink-soft)] whitespace-pre-wrap break-words line-clamp-4">
        {latestEntry?.content || (latestEntry ? <span className="italic opacity-60">Streak logged without notes.</span> : null)}
        {!latestEntry && <span className="italic opacity-60">Awaiting first entry.</span>}
      </p>
      <hr className="fold-line my-6" />
      <div className="flex items-center justify-between">
        <Label>Filed {timeStr}</Label>
        <Link href={`/edit/${trackers[0].id}`} className="ink-link text-[0.9rem] font-serif italic">
          continue writing
        </Link>
      </div>
    </div>
  );
}
