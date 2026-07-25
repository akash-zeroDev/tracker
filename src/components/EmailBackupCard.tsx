'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, FieldGroup, ValidationMessage } from '@/components/ui/forms';
import { sendBackupEmail } from '@/app/actions';
import { Check } from 'lucide-react';

export function EmailBackupCard({ editUrl }: { editUrl: string }) {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [isVaulted, setIsVaulted] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('backup_email_v1');
    if (savedEmail) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
        setError('Failed to vault tracker.');
      }
    });
  };

  if (isVaulted) {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 text-sm text-[var(--color-catalyst-cyan)] font-medium">
          <Check className="h-4 w-4" />
          <span>Vaulted securely to {email}</span>
        </div>
        <button 
          onClick={() => setIsVaulted(false)}
          className="text-xs uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-[var(--color-catalyst-cyan)] transition-colors"
        >
          UPDATE EMAIL
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <FieldGroup>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={isPending}
            aria-invalid={!!error}
            className={`flex-1 ${error ? 'border-[var(--color-critical)] focus:border-[var(--color-critical)]' : ''}`}
          />
          <Button
            type="submit"
            variant="secondary"
            isLoading={isPending}
            className="w-full sm:w-auto"
          >
            VAULT
          </Button>
        </div>
        <ValidationMessage 
          error={error || (isPending ? '' : undefined)} 
          helpText={error ? "Vault delivery failed. Verify email format or retry." : "Architecture relies on local coordinates. To prevent permanent loss, secure this URL to an external vault."} 
        />
      </FieldGroup>
    </form>
  );
}
