import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', isLoading = false, children, disabled, ...props }, ref) => {
    const isActuallyDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isActuallyDisabled}
        className={cn(
          // Base styles: mechanical feel, 0ms hover, instant active depression, no border radius
          'inline-flex items-center justify-center font-semibold tracking-tight transition-none active:translate-y-[2px]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-catalyst-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]',
          'disabled:pointer-events-none disabled:opacity-50 disabled:active:translate-y-0',
          'rounded-none border-0',
          
          // Variants
          variant === 'primary' && 'bg-[var(--color-catalyst-cyan)] text-[var(--color-core-ink)] hover:bg-[var(--color-catalyst-cyan-hover)] active:bg-[var(--color-catalyst-cyan-active)]',
          variant === 'secondary' && 'bg-[var(--color-liquid-metal-200)] text-[var(--color-core-ink)] hover:bg-[var(--color-liquid-metal-300)] active:bg-[var(--color-liquid-metal-400)]',
          variant === 'ghost' && 'bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-core-ink-600)] active:bg-[var(--color-core-ink-700)]',
          variant === 'danger' && 'bg-[var(--color-critical)] text-white hover:bg-[var(--color-critical-hover)] active:bg-[var(--color-critical)]',
          variant === 'icon' && 'bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-core-ink-600)] active:bg-[var(--color-core-ink-700)]',
          
          // Sizes
          size === 'default' && 'h-12 px-6 py-3',
          size === 'sm' && 'h-10 px-4 py-2 text-sm',
          size === 'lg' && 'h-16 px-8 py-4 text-lg',
          size === 'icon' && 'h-12 w-12 p-3',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin-slow h-5 w-5 text-current"
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
            {size !== 'icon' && <span>Loading...</span>}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';
