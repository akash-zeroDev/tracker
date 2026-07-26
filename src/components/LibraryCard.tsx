'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from "next/link";
import { sendBackupEmail } from '@/app/actions';
import { EditorialTime } from '@/components/ui/EditorialTime';
import { motion, AnimatePresence } from 'framer-motion';
import { Stamp } from '@/components/AtelierPrimitives';

interface LibraryCardProps {
  goalId: string;
  publicSlug: string;
  createdAt: Date;
}

export function LibraryCard({ goalId, publicSlug, createdAt }: LibraryCardProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [isVaulted, setIsVaulted] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('backup_email_v1');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleCopy = async () => {
    try {
      const fullUrl = `${window.location.origin}/${publicSlug}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard API failed', err);
    }
  };

  const handleVaultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    if (!email || !email.includes('@')) {
      setError('Invalid email format.');
      return;
    }

    startTransition(async () => {
      try {
        localStorage.setItem('backup_email_v1', email);
        const fullUrl = `${window.location.origin}/edit/${goalId}`;
        await sendBackupEmail(email, fullUrl);
        setIsVaulted(true);
      } catch (err) {
        console.error(err);
        setError('Vault seal failed.');
      }
    });
  };

  return (
    <div className="relative w-full max-w-[340px] mx-auto mt-12">
      {/* The paper pocket holding the card */}
      <div className="absolute -inset-4 bg-[#e8e4db] rounded-b-lg border-x border-b border-[rgba(0,0,0,0.1)] shadow-[inset_0_-4px_6px_rgba(0,0,0,0.05)] z-0 hidden md:block" style={{ clipPath: 'polygon(0 40%, 100% 10%, 100% 100%, 0 100%)' }} />
      
      {/* The Library Card */}
      <div className="tracing-paper paper-lift relative z-10 flex flex-col p-6 border-t-8 border-[color:var(--color-burgundy)]">
        
        {/* Card Header */}
        <div className="flex justify-between items-start mb-6 border-b-2 border-[color:var(--color-ink)] pb-2">
          <div className="flex flex-col">
            <span className="font-mono text-[0.65rem] uppercase tracking-widest opacity-60">Library / Archive Card</span>
            <span className="font-serif italic text-[1.1rem]">Publication Details</span>
          </div>
          <EditorialTime date={createdAt} context="compact" className="font-mono text-[0.7rem] uppercase" />
        </div>

        {/* Public Link Row (Library Check-out) */}
        <div className="flex flex-col gap-2 mb-6 border-b border-dashed border-[color:var(--color-rule)] pb-4 relative cursor-pointer group" onClick={handleCopy}>
          <div className="flex justify-between items-center">
            <span className="font-serif italic text-[0.8rem] opacity-70">Public Edition Link</span>
            <span className="font-mono text-[0.65rem] uppercase group-hover:text-[color:var(--color-burgundy)] transition-colors">Copy URL</span>
          </div>
          <span className="font-mono text-[0.8rem] truncate opacity-90 group-hover:opacity-100">{typeof window !== 'undefined' ? window.location.host : 'archive.dev'}/{publicSlug}</span>
          
          <AnimatePresence>
            {copied && (
              <motion.div 
                initial={{ opacity: 0, scale: 1.5, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: -5 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="absolute inset-0 m-auto flex items-center justify-center pointer-events-none"
              >
                <Stamp className="text-[2rem] text-[color:var(--color-burgundy)] opacity-90 shadow-sm border-[3px] border-[color:var(--color-burgundy)] rounded-sm px-4 py-1">
                  COPIED
                </Stamp>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Secret Vault Row */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="font-serif italic text-[0.8rem] opacity-70">Secret Edit Vault</span>
            <span className="font-mono text-[0.65rem] uppercase text-[color:var(--color-critical)]">Private</span>
          </div>
          
          <AnimatePresence mode="wait">
            {isVaulted ? (
              <motion.div 
                key="vaulted"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mt-2 text-center"
              >
                <div className="font-serif italic text-[0.9rem] text-[color:var(--color-ink)] mb-1">
                  Envelope securely sealed.
                </div>
                <button 
                  onClick={() => setIsVaulted(false)}
                  className="text-[0.65rem] font-serif italic text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-burgundy)] transition-colors"
                >
                  Change delivery address
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleVaultSubmit} className="flex flex-col mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Dispatch link to email..."
                  disabled={isPending}
                  className="w-full bg-transparent border-b border-[color:var(--color-rule)] font-serif text-[0.9rem] py-1.5 focus:outline-none focus:border-[color:var(--color-ink)] transition-colors placeholder:italic placeholder:opacity-40"
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[0.65rem] font-serif text-[color:var(--color-burgundy)]">{error}</span>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="appearance-none font-serif italic text-[0.8rem] hover:text-[color:var(--color-burgundy)] transition-colors disabled:opacity-50 border-b border-dashed border-transparent hover:border-[color:var(--color-burgundy)] pb-0.5 ml-auto"
                  >
                    {isPending ? 'Sealing...' : 'Send to Vault'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
