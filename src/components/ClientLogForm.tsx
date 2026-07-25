'use client';

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea, FieldGroup, ValidationMessage } from '@/components/ui/forms';
import { addLogEntry } from '@/app/actions';
import { useRouter } from 'next/navigation';

interface PendingLog {
  id: string;
  content: string;
  createdAt: string;
  timezone: string;
}

export function ClientLogForm({ goalId }: { goalId: string }) {
  const [content, setContent] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [pendingLogs, setPendingLogs] = useState<PendingLog[]>([]);
  const router = useRouter();

  // Load offline logs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`pending_logs_${goalId}`);
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPendingLogs(JSON.parse(stored));
      } catch {
        // ignore parsing errors
      }
    }
  }, [goalId]);

  // Save offline logs to localStorage whenever they change
  useEffect(() => {
    if (pendingLogs.length > 0) {
      localStorage.setItem(`pending_logs_${goalId}`, JSON.stringify(pendingLogs));
    } else {
      localStorage.removeItem(`pending_logs_${goalId}`);
    }
  }, [pendingLogs, goalId]);

  // Window Focus SWR
  useEffect(() => {
    const handleFocus = () => router.refresh();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [router]);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {
      // fallback to UTC
    }
  }, []);

  const syncPendingLog = useCallback(async (log: PendingLog) => {
    try {
      await addLogEntry(goalId, log.content, log.timezone);
      return true;
    } catch {
      return false;
    }
  }, [goalId]);

  // Auto-sync when online
  useEffect(() => {
    const handleOnline = async () => {
      if (pendingLogs.length > 0) {
        const remaining = [...pendingLogs];
        const toRemove = new Set<string>();
        
        for (const log of pendingLogs) {
          const success = await syncPendingLog(log);
          if (success) {
            toRemove.add(log.id);
          }
        }
        
        const nextPending = remaining.filter(log => !toRemove.has(log.id));
        setPendingLogs(nextPending);
        if (nextPending.length === 0) {
          router.refresh();
        }
      }
    };
    
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [pendingLogs, syncPendingLog, router]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;
    setError(undefined);

    const logToSubmit = content;

    startTransition(async () => {
      // Offline immediately
      if (!navigator.onLine) {
        setPendingLogs(prev => [
          { id: Date.now().toString(), content: logToSubmit, createdAt: new Date().toISOString(), timezone },
          ...prev
        ]);
        setContent('');
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        
        // Wrap action in promise race to detect timeout
        const actionPromise = addLogEntry(goalId, logToSubmit, timezone);
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('TIMEOUT')), 4000);
        });

        await Promise.race([actionPromise, timeoutPromise]);
        clearTimeout(timeoutId);
        
        setContent('');
        router.refresh();
      } catch (err) {
        console.error(err);
        
        if (err instanceof Error && err.message === 'TIMEOUT') {
          // Fall back to offline queue
          setPendingLogs(prev => [
            { id: Date.now().toString(), content: logToSubmit, createdAt: new Date().toISOString(), timezone },
            ...prev
          ]);
          setContent('');
        } else {
          setError('Network fracture detected. Your entry is preserved locally.');
        }
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="w-full relative group">
        <div 
          className="tracing-paper paper-lift relative p-8 md:p-12 min-h-[400px] flex flex-col transition-all duration-700 ease-in-out"
          style={{ 
            opacity: isPending ? 0.5 : 1, 
            filter: isPending ? 'blur(2px)' : 'none',
            transform: isPending ? 'translateY(4px)' : 'translateY(0px)'
          }}
        >
          <div className="flex justify-between items-center mb-10 border-b border-[color:var(--color-rule)] pb-4">
            <div className="flex gap-6 items-center">
              <span className="ref-id">NO. 004.1</span>
              <span className="label-caps">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <span className="font-serif italic text-[0.8rem] text-[color:var(--color-ink-soft)]">pg. 1</span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Log today's progress... What did you build? What broke? What did you learn?"
            disabled={isPending}
            className="flex-grow bg-transparent font-serif text-[1.05rem] leading-[1.8] text-[color:var(--color-ink)] resize-none outline-none placeholder-[color:var(--color-ink-soft)]"
            autoFocus
          />

          <div className="mt-8 flex items-center justify-between opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity duration-300">
            <span className="label-caps opacity-50">{error ? <span className="text-[color:var(--color-burgundy)]">{error}</span> : 'Cmd + Enter to log'}</span>
            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className="appearance-none bg-transparent cursor-pointer font-serif italic text-[0.95rem] border-b border-dashed border-[color:var(--color-ink-soft)] pb-0.5 hover:text-[color:var(--color-burgundy)] hover:border-[color:var(--color-burgundy)] transition-colors disabled:opacity-50"
            >
              {isPending ? 'Ink drying...' : 'File fragment'}
            </button>
          </div>
        </div>
      </form>

      {pendingLogs.length > 0 && (
        <div className="tracing-paper p-6 opacity-70">
          <div className="ref-id mb-4">Offline Archive Buffer</div>
          <div className="flex flex-col gap-4">
            {pendingLogs.map((log) => (
              <div key={log.id} className="font-serif text-[0.9rem] leading-[1.6] border-l border-[color:var(--color-rule)] pl-4">
                <span className="block text-[0.7rem] uppercase tracking-widest opacity-60 mb-1">{new Date(log.createdAt).toLocaleDateString()}</span>
                {log.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
