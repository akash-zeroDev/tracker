'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Stamp } from '@/components/AtelierPrimitives';
import { motion, AnimatePresence } from 'framer-motion';
interface CopyLinkButtonProps {
  url: string;
  slug?: string;
  createdAt?: Date;
  className?: string;
}
export function CopyLinkButton({
  url,
  slug = 'folio',
  createdAt = new Date(),
  className = ''
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      const fullUrl = url.startsWith('/') ? `${window.location.origin}${url}` : url;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard API failed', err);
    }
  };
  return (
    <div className={`tracing-paper paper-lift relative p-6 flex flex-col group cursor-pointer ${className}`} onClick={handleCopy}>
      <div className="flex justify-between items-start mb-4">
        <span className="label-caps opacity-60">PUBLIC EDITION</span>
        <span className="font-serif italic text-[0.75rem] opacity-40 group-hover:opacity-100 transition-opacity">Copy Link</span>
      </div>
      <div className="font-mono text-[0.85rem] tracking-tight text-[color:var(--color-ink)] truncate mb-6 border-b border-dashed border-[color:var(--color-ink-soft)] pb-2">
        {url.startsWith('/') ? (typeof window !== 'undefined' ? window.location.host : 'archive.dev') : ''}{url}
      </div>
      <div className="flex justify-between items-end mt-auto">
        <div className="flex flex-col gap-1">
          <span className="font-serif text-[0.7rem] italic opacity-60">First printed</span>
          <span className="font-mono text-[0.75rem] uppercase">{new Date(createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="font-serif text-[0.7rem] italic opacity-60">Visibility</span>
          <span className="font-mono text-[0.75rem] uppercase">Public</span>
        </div>
      </div>
      {}
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
  );
}
