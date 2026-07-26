'use client';
import React, { createContext, useContext, useState, useCallback, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
export type TransitionStatus = 'idle' | 'leaving';
interface TransitionContextValue {
  status: TransitionStatus;
  isPending: boolean;
  navigate: (href: string) => void;
}
const TransitionContext = createContext<TransitionContextValue | null>(null);
export function useTransitionContext() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransitionContext must be used within an InkTransitionProvider');
  }
  return context;
}
export function TransitionProviderInner({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<TransitionStatus>('idle');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  React.useEffect(() => {
    if (status === 'leaving') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('idle');
    }
  }, [pathname, status]); 
  const navigate = useCallback((href: string) => {
    if (pathname === href) return;
    setStatus('leaving');
    startTransition(() => {
      router.push(href);
    });
  }, [pathname, router]);
  return (
    <TransitionContext.Provider value={{ status, isPending, navigate }}>
      {children}
    </TransitionContext.Provider>
  );
}
