import * as React from 'react';
import { cn } from '@/lib/utils';

export const AppContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  )
);
AppContainer.displayName = 'AppContainer';

export const ContentWidth = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('w-full max-w-3xl mx-auto', className)}
      {...props}
    />
  )
);
ContentWidth.displayName = 'ContentWidth';

export const Section = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <section
      ref={ref}
      className={cn('py-12 md:py-24', className)}
      {...props}
    />
  )
);
Section.displayName = 'Section';

export const Stack = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-4', className)}
      {...props}
    />
  )
);
Stack.displayName = 'Stack';

export const Inline = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-row items-center gap-4', className)}
      {...props}
    />
  )
);
Inline.displayName = 'Inline';

export const Cluster = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-wrap items-center gap-4', className)}
      {...props}
    />
  )
);
Cluster.displayName = 'Cluster';

export const Divider = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => (
    <hr
      ref={ref}
      className={cn('w-full border-t border-[var(--color-border-primary)]', className)}
      {...props}
    />
  )
);
Divider.displayName = 'Divider';

export const Spacer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { size?: 'sm' | 'md' | 'lg' | 'xl' }>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-4',
      md: 'h-8',
      lg: 'h-16',
      xl: 'h-32',
    };
    return (
      <div
        ref={ref}
        className={cn('w-full', sizeClasses[size], className)}
        {...props}
      />
    );
  }
);
Spacer.displayName = 'Spacer';

export const EmptyStateContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col items-center justify-center p-12 text-center border border-dashed border-[var(--color-border-primary)]', className)}
      {...props}
    />
  )
);
EmptyStateContainer.displayName = 'EmptyStateContainer';

export const LoadingContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col items-center justify-center min-h-[200px] w-full', className)}
      {...props}
    />
  )
);
LoadingContainer.displayName = 'LoadingContainer';

export const ErrorContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col p-6 bg-[var(--color-core-ink-700)] border border-[var(--color-critical)] text-[var(--color-critical)]', className)}
      {...props}
    />
  )
);
ErrorContainer.displayName = 'ErrorContainer';
