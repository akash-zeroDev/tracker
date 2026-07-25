import * as React from 'react';
import { cn } from '@/lib/utils';
import { ErrorText, HelperText } from './typography';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, 'aria-invalid': ariaInvalid, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full rounded-none border border-[var(--color-border-primary)] bg-[var(--color-background)] px-4 py-2 text-base text-[var(--color-foreground)] transition-none',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-[var(--color-liquid-metal-500)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-catalyst-cyan)] focus-visible:ring-offset-0 focus-visible:border-[var(--color-catalyst-cyan)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        ariaInvalid && 'border-[var(--color-critical)] focus-visible:ring-[var(--color-critical)] focus-visible:border-[var(--color-critical)]',
        className
      )}
      ref={ref}
      aria-invalid={ariaInvalid}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, 'aria-invalid': ariaInvalid, ...props }, ref) => (
    <textarea
      className={cn(
        'flex min-h-[120px] w-full rounded-none border border-[var(--color-border-primary)] bg-[var(--color-background)] px-4 py-3 text-base text-[var(--color-foreground)] transition-none',
        'placeholder:text-[var(--color-liquid-metal-500)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-catalyst-cyan)] focus-visible:ring-offset-0 focus-visible:border-[var(--color-catalyst-cyan)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        ariaInvalid && 'border-[var(--color-critical)] focus-visible:ring-[var(--color-critical)] focus-visible:border-[var(--color-critical)]',
        className
      )}
      ref={ref}
      aria-invalid={ariaInvalid}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      type="checkbox"
      className={cn(
        'peer h-5 w-5 appearance-none rounded-none border border-[var(--color-border-primary)] bg-transparent checked:bg-[var(--color-catalyst-cyan)] checked:border-[var(--color-catalyst-cyan)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-catalyst-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50 transition-none',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Checkbox.displayName = 'Checkbox';

export const Switch = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      type="checkbox"
      role="switch"
      className={cn(
        'peer h-6 w-11 appearance-none rounded-none border border-[var(--color-border-primary)] bg-[var(--color-core-ink-600)] checked:bg-[var(--color-catalyst-cyan)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-catalyst-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50 transition-none cursor-pointer',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Switch.displayName = 'Switch';

export const FieldGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  )
);
FieldGroup.displayName = 'FieldGroup';

interface ValidationMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: string;
  helpText?: string;
}

export const ValidationMessage = React.forwardRef<HTMLParagraphElement, ValidationMessageProps>(
  ({ error, helpText, className, ...props }, ref) => {
    if (error) {
      return (
        <ErrorText ref={ref} className={className} {...props}>
          {error}
        </ErrorText>
      );
    }
    if (helpText) {
      return (
        <HelperText ref={ref} className={className} {...props}>
          {helpText}
        </HelperText>
      );
    }
    return null;
  }
);
ValidationMessage.displayName = 'ValidationMessage';
