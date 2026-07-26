'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArchiveVolumeData } from './ArchiveClient';
import { EditorialTime } from '@/components/ui/EditorialTime';
import { deleteGoal } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface FolioWithdrawalNoticeProps {
  folio: ArchiveVolumeData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function FolioWithdrawalNotice({ folio, isOpen, onClose, onSuccess }: FolioWithdrawalNoticeProps) {
  const [inputValue, setInputValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Reset input when modal opens
  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      // Slight delay to allow animation to complete before stealing focus
      const t = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isPending) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isPending]);

  // Case-sensitive exact match for intentional friction
  const isValid = inputValue.trim() === folio.title.trim();

  const handleDiscard = () => {
    if (!isValid) return;
    startTransition(async () => {
      try {
        await deleteGoal(folio.id);
        onSuccess();
        onClose();
        router.refresh();
      } catch (err) {
        console.error('Failed to discard folio', err);
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-[color:var(--color-paper-deep)]/80 backdrop-blur-sm"
            onClick={() => !isPending && onClose()}
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdrawal-title"
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg bg-[color:var(--color-paper)] border border-[color:var(--color-rule)] p-8 sm:p-10 shadow-2xl"
          >
            {/* Header */}
            <div className="flex flex-col gap-2 mb-8">
              <span className="font-mono text-[0.65rem] tracking-widest uppercase opacity-60">
                Official Notice of Deaccession
              </span>
              <h2 id="withdrawal-title" className="font-serif text-[2rem] leading-tight text-[color:var(--color-burgundy)]">
                Discard Folio
              </h2>
            </div>

            {/* Warning Text */}
            <p className="font-serif text-[1.1rem] leading-[1.6] text-[color:var(--color-ink)] mb-8">
              This folio will be permanently discarded and removed from your archive.
              All associated historical entries, metadata, and streaks will be irreversibly erased.
            </p>

            {/* Archival Summary (reinforcing value) */}
            <div className="bg-[color:var(--color-paper-deep)] border border-[color:var(--color-rule)] p-5 mb-8">
              <div className="font-mono text-[0.65rem] tracking-widest uppercase opacity-60 mb-4 border-b border-[color:var(--color-rule)] pb-2">
                Folio Details
              </div>
              <dl className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <dt className="font-mono text-[0.65rem] uppercase opacity-60 mb-1">Title</dt>
                  <dd className="font-serif text-[0.95rem] truncate" title={folio.title}>{folio.title}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="font-mono text-[0.65rem] uppercase opacity-60 mb-1">Created</dt>
                  <dd><EditorialTime date={folio.archivedDate} context="metadata" className="font-serif text-[0.95rem]" /></dd>
                </div>
                <div className="flex flex-col">
                  <dt className="font-mono text-[0.65rem] uppercase opacity-60 mb-1">Total Entries</dt>
                  <dd className="font-serif text-[0.95rem]">{folio.totalEntries}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="font-mono text-[0.65rem] uppercase opacity-60 mb-1">Volume</dt>
                  <dd className="font-serif text-[0.95rem]">Vol. {folio.volNumber}</dd>
                </div>
              </dl>
            </div>

            {/* Intentional Friction Input */}
            <div className="mb-10">
              <label htmlFor="friction-input" className="block font-serif text-[1.05rem] text-[color:var(--color-ink)] mb-3">
                To confirm this irreversible action, type the folio title below exactly as it appears (case-sensitive).
              </label>
              <input
                ref={inputRef}
                id="friction-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={folio.title}
                className="w-full bg-transparent border-b border-[color:var(--color-ink-soft)] px-0 py-2 font-serif text-[1.2rem] text-[color:var(--color-ink)] outline-none focus:border-[color:var(--color-burgundy)] transition-colors duration-300 placeholder:opacity-30"
                disabled={isPending}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isValid) {
                    handleDiscard();
                  }
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-6 items-center">
              <button
                onClick={onClose}
                disabled={isPending}
                className="font-mono text-[0.7rem] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
              >
                Return to Archive
              </button>
              
              <button
                onClick={handleDiscard}
                disabled={!isValid || isPending}
                className={`
                  relative flex items-center gap-2 px-6 py-3 font-mono text-[0.7rem] uppercase tracking-widest transition-all duration-500
                  ${isValid && !isPending
                    ? 'bg-[color:var(--color-burgundy)] text-[color:var(--color-paper)] cursor-pointer hover:bg-opacity-90' 
                    : 'bg-transparent border border-[color:var(--color-rule)] text-[color:var(--color-ink-soft)] cursor-not-allowed opacity-50'
                  }
                `}
              >
                {isPending ? (
                  <span className="animate-pulse">Discarding...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Discard
                  </>
                )}
              </button>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
