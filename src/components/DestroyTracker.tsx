'use client';
import React, { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { deleteGoal } from '@/app/actions';
import { useTrackers } from '@/hooks/useTrackers';
export function DestroyTracker({ goalId }: { goalId: string }) {
  const router = useRouter();
  const [step, setStep] = useState<'idle' | 'confirm'>('idle');
  const [isPending, startTransition] = useTransition();
  const { removeTracker } = useTrackers();
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (step === 'confirm') {
      timeout = setTimeout(() => {
        setStep('idle');
      }, 10000); 
    }
    return () => clearTimeout(timeout);
  }, [step]);
  const handleInitialClick = () => {
    setStep('confirm');
  };
  const handleConfirmClick = () => {
    startTransition(async () => {
      try {
        await deleteGoal(goalId);
        removeTracker(goalId);
        router.push('/');
      } catch (err) {
        console.error('Failed to delete goal', err);
        setStep('idle');
      }
    });
  };
  if (step === 'idle') {
    return (
      <Button 
        variant="ghost" 
        onClick={handleInitialClick}
        className="w-full text-white/50 hover:bg-white/5 hover:text-white"
      >
        DESTROY TRACKER
      </Button>
    );
  }
  return (
    <Button 
      variant="danger" 
      onClick={handleConfirmClick}
      isLoading={isPending}
      className="w-full"
    >
      IRREVERSIBLE. CONFIRM DESTRUCTION.
    </Button>
  );
}
