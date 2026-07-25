import * as React from 'react';
import { cn } from '@/lib/utils';

export const Heading = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }>(
  ({ className, level = 1, ...props }, ref) => {
    const Component = `h${level}` as const;
    const sizeClasses = {
      1: 'text-4xl md:text-6xl font-bold tracking-tight',
      2: 'text-3xl md:text-4xl font-bold tracking-tight',
      3: 'text-2xl md:text-3xl font-semibold tracking-tight',
      4: 'text-xl md:text-2xl font-semibold tracking-tight',
      5: 'text-lg font-medium tracking-tight',
      6: 'text-base font-medium tracking-tight',
    };

    return (
      <Component
        ref={ref}
        className={cn('text-[var(--color-foreground)]', sizeClasses[level], className)}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';

export const SubHeading = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-xl md:text-2xl text-[var(--color-liquid-metal-400)] font-medium tracking-tight', className)}
      {...props}
    />
  )
);
SubHeading.displayName = 'SubHeading';

export const Title = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-lg md:text-xl font-semibold tracking-tight text-[var(--color-foreground)]', className)}
      {...props}
    />
  )
);
Title.displayName = 'Title';

export const Body = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-base text-[var(--color-liquid-metal-200)] leading-relaxed', className)}
      {...props}
    />
  )
);
Body.displayName = 'Body';

export const Caption = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-[var(--color-liquid-metal-400)]', className)}
      {...props}
    />
  )
);
Caption.displayName = 'Caption';

export const Mono = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('font-mono text-sm tracking-tight text-[var(--color-liquid-metal-300)]', className)}
      {...props}
    />
  )
);
Mono.displayName = 'Mono';

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-sm font-semibold tracking-tight text-[var(--color-foreground)]', className)}
      {...props}
    />
  )
);
Label.displayName = 'Label';

export const HelperText = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-[var(--color-liquid-metal-500)]', className)}
      {...props}
    />
  )
);
HelperText.displayName = 'HelperText';

export const ErrorText = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm font-medium text-[var(--color-critical)]', className)}
      {...props}
    />
  )
);
ErrorText.displayName = 'ErrorText';
