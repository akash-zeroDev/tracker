'use client';

import React, { useState, useEffect } from 'react';
import { getRecentGoals, archiveGoal } from '@/app/actions';
import { Label, RefId, MarginNote } from '@/components/AtelierPrimitives';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function ActiveFoliosList() {
  const [goals, setGoals] = useState<any[]>([]);
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    getRecentGoals(3).then(setGoals);
  }, []);

  const handleArchiveClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setArchivingId(id);
  };

  const confirmArchive = async () => {
    if (!archivingId) return;
    
    // Optimistic UI update
    const idToArchive = archivingId;
    setGoals(goals.filter(g => g.id !== idToArchive));
    setArchivingId(null);
    
    await archiveGoal(idToArchive);
    router.refresh();
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
              onClick={(e) => handleArchiveClick(e, g.id)}
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
      <div className="mt-5 flex items-center justify-between">
        <MarginNote>
          Marg. Active folios currently on the desk. Archival requires stillness; learning requires motion.
        </MarginNote>
        <Link href="/desk" className="ink-link text-[13px] whitespace-nowrap shrink-0 ml-4">
          View full desk →
        </Link>
      </div>

      {/* Custom Archive Modal */}
      {archivingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--color-surface)]/80 backdrop-blur-sm p-4">
          <div className="paper-sheet p-8 max-w-sm w-full relative shadow-2xl pinned-tilt">
            <span className="pin-dot absolute left-4 top-3" aria-hidden />
            <span className="pin-dot absolute right-4 top-3" aria-hidden />
            
            <Label>Confirm Archival</Label>
            <h3 className="mt-4 font-serif text-[1.4rem] leading-tight">Seal this volume?</h3>
            <p className="mt-3 font-serif text-[0.95rem] italic text-[color:var(--color-ink-soft)] leading-relaxed">
              It will be removed from your active desk, but safely preserved in the ledger for future reference.
            </p>
            
            <div className="mt-8 flex items-center justify-end gap-6 border-t border-dashed border-[var(--color-rule)] pt-6">
              <button 
                onClick={() => setArchivingId(null)}
                className="font-mono text-[10px] tracking-[0.15em] uppercase text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
              >
                Cancel
              </button>
              <button 
                onClick={confirmArchive}
                className="press border border-[color:var(--color-ink)] bg-[color:var(--color-ink)] px-4 py-2 font-mono text-[10px] tracking-[0.15em] text-[color:var(--color-paper)] uppercase shadow-sm"
              >
                Seal Volume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
