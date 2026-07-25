'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Input, FieldGroup, ValidationMessage } from '@/components/ui/forms';
import { Button } from '@/components/ui/Button';
import { createGoal } from '@/app/actions';

export function OriginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    const trimmedValue = value.trim();
    if (!trimmedValue) {
      setError('Title is required');
      return;
    }

    startTransition(async () => {
      try {
        const goal = await createGoal(trimmedValue);
        // Instant redirect on success
        router.push(`/edit/${goal.id}`);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <FieldGroup>
        <Input
          placeholder="What are you tracking? (e.g., Learn Rust, Read Daily)..."
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isPending}
          aria-invalid={!!error}
        />
        <ValidationMessage error={error} />
        <Button type="submit" variant="primary" isLoading={isPending} className="w-full sm:w-auto mt-2">
          START TRACKING
        </Button>
      </FieldGroup>
    </form>
  );
}
