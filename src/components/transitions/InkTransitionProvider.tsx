'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { TransitionProviderInner, useTransitionContext } from './TransitionContext';
export function InkTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <TransitionProviderInner>
      <InkTransitionOrchestrator pathname={pathname}>
        {children}
      </InkTransitionOrchestrator>
    </TransitionProviderInner>
  );
}
function InkTransitionOrchestrator({ children, pathname }: { children: React.ReactNode, pathname: string }) {
  const { status } = useTransitionContext();
  const activeVariant = status === 'leaving' ? 'leaving' : 'animate';
  return (
    <div className="grid w-full flex-1">
      <AnimatePresence>
        <motion.div
          key={pathname}
          initial="initial"
          animate={activeVariant}
          exit="exit"
          style={{ gridArea: '1 / 1' }}
          className="w-full flex-1 flex flex-col relative z-10"
        >
          {}
          <div className="pointer-events-none fixed inset-0 z-50 mix-blend-multiply opacity-[0.15]">
            <svg className="w-full h-full">
              <filter id="noiseFilter">
                <feTurbulence 
                  type="fractalNoise" 
                  baseFrequency="0.9" 
                  numOctaves="4" 
                  stitchTiles="stitch" 
                />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>
            </div>
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
  );
}
