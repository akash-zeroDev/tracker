'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, FieldGroup, ValidationMessage } from '@/components/ui/forms';
import { sendBackupEmail } from '@/app/actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/AtelierPrimitives';

export function EmailBackupCard({ editUrl }: { editUrl: string }) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    startTransition(async () => {
      try {
        localStorage.setItem('backup_email_v1', email);
        const fullUrl = `${window.location.origin}${editUrl}`;
        await sendBackupEmail(email, fullUrl);
        setIsVaulted(true);
      } catch (err) {
        console.error(err);
        setError('Failed to seal vault.');
      }
    });
  };

  return (
    <div className="tracing-paper paper-lift p-6 flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <Label>SECRET VAULT</Label>
      </div>

      <AnimatePresence mode="wait">
        {isVaulted ? (
          <motion.div 
            key="sealed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-4 text-center py-4"
          >
            <div className="font-serif italic text-[1.1rem] text-[color:var(--color-ink)]">
              Envelope quietly sealed.
            </div>
            <p className="font-serif text-[0.8rem] text-[color:var(--color-ink-soft)] leading-snug">
              Secure link dispatched to <br /> <span className="text-[color:var(--color-ink)] font-mono text-[0.7rem]">{email}</span>
            </p>
            <button 
              onClick={() => setIsVaulted(false)}
              className="mt-2 text-[0.7rem] font-serif italic text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-burgundy)] transition-colors"
            >
              Update delivery address
            </button>
          </motion.div>
        ) : (
          <motion.form 
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit} 
            className="flex flex-col gap-4"
          >
            <p className="font-serif text-[0.8rem] leading-relaxed text-[color:var(--color-ink-soft)]">
              Your archive relies on local coordinates. Without this secret URL, your volume is lost if your browser clears.
            </p>
            
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="editor@press.com"
                disabled={isPending}
                className="w-full bg-transparent border-b border-[color:var(--color-rule)] font-serif text-[0.95rem] py-2 focus:outline-none focus:border-[color:var(--color-ink)] transition-colors placeholder:italic placeholder:opacity-40"
              />
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-[0.75rem] font-serif text-[color:var(--color-burgundy)]">{error}</span>
              <button
                type="submit"
                disabled={isPending}
                className="appearance-none font-serif italic text-[0.9rem] hover:text-[color:var(--color-burgundy)] transition-colors disabled:opacity-50 border-b border-dashed border-transparent hover:border-[color:var(--color-burgundy)] pb-0.5 ml-auto"
              >
                {isPending ? 'Sealing...' : 'Send to vault'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
