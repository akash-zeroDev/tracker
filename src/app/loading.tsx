'use client';

import React, { useState, useEffect } from 'react';

const PHRASES = [
  'Locating volume',
  'Retrieving records',
  'Accessing archive',
  'Opening folio'
];

export default function Loading() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % PHRASES.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[var(--color-background)]">
      <div className="flex items-center gap-3">
        {/* Typographic label matching the museum archive theme */}
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-soft)]">
          {PHRASES[phase]}...
        </span>
        {/* Minimal typewriter block cursor */}
        <span className="inline-block h-3 w-1.5 bg-[var(--color-ink-soft)] animate-[pulse_1s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
