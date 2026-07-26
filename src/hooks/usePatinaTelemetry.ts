"use client";

import { useEffect, useRef } from 'react';
import { logPatinaEvent } from '@/app/actions/patina';

export function usePatinaTelemetry(goalId: string, entryId?: string) {
  const loggedRef = useRef(false);

  useEffect(() => {
    // Only log once per mount to avoid thrashing the DB
    if (loggedRef.current) return;
    
    // We use requestIdleCallback (or a timeout fallback) to ensure 
    // telemetry NEVER blocks the main rendering thread.
    const idleCallback = (window.requestIdleCallback || ((cb) => setTimeout(cb, 1000))) as (cb: Function) => void;
    
    idleCallback(() => {
      logPatinaEvent(goalId, entryId).catch(console.error);
      loggedRef.current = true;
    });
  }, [goalId, entryId]);
}
