'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';

export interface OmniInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSubmitAction?: (value: string) => void;
}

export function OmniInput({ className, onSubmitAction, ...props }: OmniInputProps) {
  const [value, setValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && onSubmitAction) {
      onSubmitAction(value);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('group relative mx-auto w-full max-w-2xl', className)}
    >
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-25 blur transition duration-1000 group-focus-within:opacity-50 group-hover:duration-200" />
      <div className="glass-panel relative flex items-center rounded-2xl bg-[#0a0a0a]/80 p-2 pl-6">
        <input
          {...props}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent text-xl text-white outline-none placeholder:text-white/30 md:text-2xl"
          placeholder="What are you mastering?"
        />
        <Button
          type="submit"
          variant="primary"
          className="ml-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl p-0 transition-all group-focus-within:bg-white group-focus-within:text-black"
        >
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
    </form>
  );
}
