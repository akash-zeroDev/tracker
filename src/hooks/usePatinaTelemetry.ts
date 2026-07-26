"use client";
import { useEffect, useRef } from 'react';
import { logPatinaEvent } from '@/app/actions/patina';
export function usePatinaTelemetry(goalId: string, entryId?: string) {
  const loggedRef = useRef(false);
  useEffect(() => {
    if (loggedRef.current) return;
    const idleCallback = (window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1000))) as unknown as (cb: () => void) => void;
    idleCallback(() => {
      logPatinaEvent(goalId, entryId).catch(console.error);
      loggedRef.current = true;
    });
  }, [goalId, entryId]);
}
