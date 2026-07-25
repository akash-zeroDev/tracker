'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface CopyLinkButtonProps {
  url: string;
  defaultText: string;
  successText?: string;
  className?: string;
}

export function CopyLinkButton({
  url,
  defaultText,
  successText = 'COPIED TO CLIPBOARD',
  className
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const [fallback, setFallback] = useState(false);

  const handleCopy = async () => {
    try {
      const fullUrl = url.startsWith('/') ? `${window.location.origin}${url}` : url;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard API failed, falling back', err);
      setFallback(true);
    }
  };

  if (fallback) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <span className="text-xs uppercase text-[var(--color-critical)]">MANUAL COPY REQUIRED</span>
        <input
          type="text"
          readOnly
          value={url.startsWith('/') ? (typeof window !== 'undefined' ? `${window.location.origin}${url}` : url) : url}
          onClick={(e) => (e.target as HTMLInputElement).select()}
          className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border-primary)] text-[var(--color-foreground)] p-3 text-sm focus:outline-none focus:border-[var(--color-catalyst-cyan)]"
        />
      </div>
    );
  }

  return (
    <Button
      variant="secondary"
      onClick={handleCopy}
      className={className}
    >
      {copied ? successText : defaultText}
    </Button>
  );
}
