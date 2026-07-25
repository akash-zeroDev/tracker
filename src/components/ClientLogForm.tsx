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
      <form onSubmit={handleSubmit} className="w-full">
        <FieldGroup>
          <div className="relative">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Log today's progress..."
              disabled={isPending}
              aria-invalid={!!error}
            />
            {isPending && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden bg-transparent pointer-events-none">
                <div className="h-full w-1/3 bg-[var(--color-catalyst-cyan)] animate-[scanning_1.5s_ease-in-out_infinite] origin-left" />
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
            <ValidationMessage error={error} helpText="Cmd + Enter to submit" />
            <Button
              type="submit"
              variant="primary"
              isLoading={isPending}
              className="w-full sm:w-auto uppercase tracking-widest font-bold"
            >
              {error ? 'RETRY INJECTION' : (isPending ? 'LOGGING...' : 'LOG ENTRY')}
            </Button>
          </div>
        </FieldGroup>
      </form>

      {pendingLogs.length > 0 && (
        <div className="flex flex-col gap-6 border-l-2 border-dashed border-[var(--color-border-primary)] pl-6 ml-2 opacity-70">
          <div className="text-xs font-mono uppercase text-[var(--color-liquid-metal-400)]">
            Operating offline. Local grid active. Awaiting network sync...
          </div>
          {pendingLogs.map((log) => (
            <div key={log.id} className="flex flex-col gap-1">
              <div className="font-mono text-xs">
                {new Date(log.createdAt).toLocaleDateString()}
              </div>
              <div className="text-[var(--color-foreground)] break-words">
                {log.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
