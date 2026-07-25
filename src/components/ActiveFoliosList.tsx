import React from 'react';
import { getRecentGoals } from '@/app/actions';
import { Label, RefId, MarginNote } from '@/components/AtelierPrimitives';
import Link from 'next/link';

export async function ActiveFoliosList() {
  const goals = await getRecentGoals(3);
  
  return (
    <div className="p-7">
      <div className="flex items-center justify-between">
        <Label>Active folios</Label>
        <RefId>DESK · I</RefId>
      </div>
      <ul className="mt-5 divide-y divide-[color:var(--color-rule)]">
        {goals.length === 0 && (
          <li className="py-3 font-serif text-[0.98rem] text-[color:var(--color-ink-soft)] italic">
            No active folios on the desk.
          </li>
        )}
        {goals.map((g) => (
          <li key={g.id} className="group flex items-baseline gap-3 py-3">
            <span className="ref-id w-12 transition-colors duration-200 group-hover:text-[color:var(--color-ink)]">
              {g.id.split('-')[0].substring(0, 4)}
            </span>
            <Link href={`/edit/${g.id}`} className="flex-1 font-serif text-[0.98rem] leading-tight group-hover:text-[color:var(--color-burgundy)] transition-colors">
              {g.title}
            </Link>
            <span className="ref-id whitespace-nowrap">
              {g.currentStreak} day streak
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-5"><MarginNote>
        — Marg. Active folios currently on the desk. Archival requires stillness; learning requires motion.
      </MarginNote></div>
    </div>
  );
}
