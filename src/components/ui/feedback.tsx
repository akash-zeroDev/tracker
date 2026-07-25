import * as React from 'react';
import { cn } from '@/lib/utils';

export const Spinner = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      aria-label="Loading"
      className={cn('inline-flex items-center justify-center', className)}
      {...props}
    >
      <svg
        className="animate-spin-slow h-5 w-5 text-[var(--color-catalyst-cyan)]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
);
Spinner.displayName = 'Spinner';

export const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('animate-pulse bg-[var(--color-core-ink-600)] rounded-none', className)}
      {...props}
    />
  )
);
Skeleton.displayName = 'Skeleton';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'critical';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-none border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest transition-none',
          variant === 'default' && 'border-[var(--color-border-primary)] bg-[var(--color-core-ink-700)] text-[var(--color-foreground)]',
          variant === 'success' && 'border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-success)]',
          variant === 'warning' && 'border-[var(--color-warning)] bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
          variant === 'critical' && 'border-[var(--color-critical)] bg-[var(--color-critical)]/10 text-[var(--color-critical)]',
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: 'active' | 'pending' | 'offline' | 'error';
}

export const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ className, status = 'offline', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'h-2.5 w-2.5 rounded-none border',
          status === 'active' && 'bg-[var(--color-success)] border-[var(--color-success)]',
          status === 'pending' && 'bg-transparent border-[var(--color-warning)] border-dashed animate-spin-slow',
          status === 'error' && 'bg-[var(--color-critical)] border-[var(--color-critical)]',
          status === 'offline' && 'bg-[var(--color-core-ink-600)] border-[var(--color-border-primary)]',
          className
        )}
        {...props}
      />
    );
  }
);
StatusIndicator.displayName = 'StatusIndicator';
