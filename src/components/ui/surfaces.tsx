import * as React from 'react';
import { cn } from '@/lib/utils';
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-none border border-[var(--color-border-primary)] bg-[var(--color-core-ink-800)] text-[var(--color-foreground)] shadow-none',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';
export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6 border-b border-[var(--color-border-primary)]', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';
export const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-6', className)} {...props} />
  )
);
CardBody.displayName = 'CardBody';
export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 border-t border-[var(--color-border-primary)]', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';
