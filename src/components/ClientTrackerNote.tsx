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
function getRomanMonth(monthIndex: number) {
  const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return numerals[monthIndex];
}
function formatAestheticDate(date: Date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = days[date.getDay()];
  const dateNum = date.getDate().toString().padStart(2, '0');
  const romanMonth = getRomanMonth(date.getMonth());
  return `${dayName} · ${dateNum}.${romanMonth}`;
}
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
  if (!isLoaded || trackers.length === 0 || !goal) {
    return (
      <div className="tracing-paper paper-lift relative p-7 flex flex-col justify-center min-h-[300px]">
        <div className="absolute top-7 left-7 right-7 flex flex-wrap items-center justify-between gap-2">
          <RefId>№ 004.128 · STATUS</RefId>
          <Label>{formatAestheticDate(new Date())}</Label>
        </div>
        <div className="text-center mt-8 mb-4">
          <h3 className="font-serif text-[1.4rem] leading-[1.35] text-[color:var(--color-ink)] mb-3">
            No folio <span className="italic">selected</span>.
          </h3>
          <p className="font-serif text-[0.95rem] leading-[1.7] text-[color:var(--color-ink-soft)] max-w-[240px] mx-auto">
            Select an active folio from your desk below, or declare a new learning goal to begin your first entry.
          </p>
        </div>
      </div>
    );
  }
  const latestEntry = goal.entries[0];
  const dateStr = latestEntry 
    ? formatAestheticDate(new Date(latestEntry.createdAt))
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
