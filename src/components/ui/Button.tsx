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
          // Base styles: architectural, physical feel
          'inline-flex items-center justify-center font-serif tracking-widest uppercase transition-all duration-200 active:translate-y-[2px]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-burgundy)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)]',
          'disabled:pointer-events-none disabled:opacity-50 disabled:active:translate-y-0',
          'rounded-none border-2',
          
          // Variants
          variant === 'primary' && 'border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:bg-transparent hover:text-[color:var(--color-ink)] active:bg-[color:var(--color-burgundy)] active:border-[color:var(--color-burgundy)] active:text-white',
          variant === 'secondary' && 'border-[color:var(--color-rule)] bg-transparent text-[color:var(--color-ink-soft)] hover:border-[color:var(--color-ink)] hover:text-[color:var(--color-ink)]',
          variant === 'ghost' && 'border-transparent bg-transparent text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]',
          variant === 'danger' && 'border-red-900 bg-red-900 text-white hover:bg-transparent hover:text-red-900',
          variant === 'icon' && 'border-transparent bg-transparent text-[color:var(--color-ink)] hover:bg-[color:var(--color-rule)]',
          
          // Sizes
          size === 'default' && 'h-12 px-6 py-3 text-[0.85rem]',
          size === 'sm' && 'h-10 px-4 py-2 text-[0.75rem]',
          size === 'lg' && 'h-14 px-8 py-4 text-[0.95rem]',
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
