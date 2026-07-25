'use client';

import React, { useState, useEffect } from 'react';
import { getRecentGoals, archiveGoal } from '@/app/actions';
import { Label, RefId, MarginNote } from '@/components/AtelierPrimitives';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function ActiveFoliosList() {
  const [goals, setGoals] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    getRecentGoals(3).then(setGoals);
  }, []);

  const handleArchive = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (confirm("Archive this folio?")) {
      await archiveGoal(id);
      setGoals(goals.filter(g => g.id !== id));
      router.refresh();
    }
  };

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
          <li key={g.id} className="group flex items-baseline gap-3 py-3 relative pr-8">
            <span className="ref-id w-12 transition-colors duration-200 group-hover:text-[color:var(--color-ink)]">
              {g.id.split('-')[0].substring(0, 4)}
            </span>
            <Link href={`/edit/${g.id}`} className="flex-1 font-serif text-[0.98rem] leading-tight group-hover:text-[color:var(--color-burgundy)] transition-colors">
              {g.title}
            </Link>
            <span className="ref-id whitespace-nowrap">
              {g.currentStreak} day streak
            </span>
            
            <button 
              onClick={(e) => handleArchive(e, g.id)}
              className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-burgundy)]"
              title="Archive Folio"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="5" />
                <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
                <path d="M10 13h4" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-5"><MarginNote>
        — Marg. Active folios currently on the desk. Archival requires stillness; learning requires motion.
      </MarginNote></div>
    </div>
  );
}
