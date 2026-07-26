'use client';
import React, { createContext, useContext } from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
export type InkPriority = 0 | 1 | 2 | 3 | 4;
const InkRegionContext = createContext<InkPriority>(2);
export function useInkRegionPriority() {
  return useContext(InkRegionContext);
}
interface InkRegionProps {
  children: React.ReactNode;
  priority?: InkPriority;
  className?: string; 
}
export function InkRegion({ children, priority = 2, className = '' }: InkRegionProps) {
  if (className) {
    return (
      <InkRegionContext.Provider value={priority}>
        <div className={className}>{children}</div>
      </InkRegionContext.Provider>
    );
  }
  return (
    <InkRegionContext.Provider value={priority}>
      {children}
    </InkRegionContext.Provider>
  );
}
const INCOMING_DELAYS = [0, 0.04, 0.08, 0.12, 0.16];
const OUTGOING_DELAYS = [0.16, 0.12, 0.08, 0.04, 0];
// The core ink variants that all primitives inherit
const inkVariants: Variants = {
  initial: {
    opacity: 0,
    filter: 'blur(3px)',
  },
  animate: (priority: number) => ({
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      delay: INCOMING_DELAYS[priority] || 0,
      duration: 0.35 + (priority * 0.05),
      ease: [0.22, 1, 0.36, 1] as const, // easeOut
    },
  }),
  leaving: (priority: number) => ({
    opacity: 0,
    filter: 'blur(2px)', // Fades into paper with a slight softening
    transition: {
      delay: OUTGOING_DELAYS[priority] || 0,
      duration: 0.3 + ((4 - priority) * 0.05),
      ease: [0.33, 1, 0.68, 1] as const, // easeOutCubic
    },
  }),
  exit: () => ({
    opacity: 0,
    filter: 'blur(2px)',
    transition: {
      duration: 0.15,
      ease: 'linear'
    },
  }),
};
export function InkText({ className, children, ...props }: HTMLMotionProps<"span">) {
  const priority = useInkRegionPriority();
  return (
    <motion.span 
      className={className} 
      variants={inkVariants} 
      custom={priority}
      {...props}
    >
      {children}
    </motion.span>
  );
}
export function InkBlock({ className, children, ...props }: HTMLMotionProps<"div">) {
  const priority = useInkRegionPriority();
  return (
    <motion.div 
      className={className} 
      variants={inkVariants} 
      custom={priority}
      {...props}
    >
      {children}
    </motion.div>
  );
}
export function InkRule({ className, ...props }: HTMLMotionProps<"div">) {
  const priority = useInkRegionPriority();
  return (
    <motion.div 
      aria-hidden
      className={`h-px w-full bg-[var(--color-rule)] ${className || ''}`} 
      variants={inkVariants} 
      custom={priority}
      {...props}
    />
  );
}
