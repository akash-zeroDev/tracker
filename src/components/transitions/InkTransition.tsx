'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export function InkTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // We wrap everything in a grid so the old and new pages stack exactly on top of each other
  // while the AnimatePresence crossfades them. This creates the "cluttered" overlap effect
  // where the old ink washes away while the new ink is printing.
  return (
    <div className="grid w-full flex-1">
      <AnimatePresence>
        <motion.div
          key={pathname}
          style={{ gridArea: '1 / 1' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(3px)', transform: 'scale(1.01)' }}
          transition={{ duration: 4, ease: 'easeOut' }} // Super slow exit of the old page
          className="w-full flex flex-col"
        >
          <InkTransitionInner>
            {children}
          </InkTransitionInner>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function InkTransitionInner({ children }: { children: React.ReactNode }) {
  const [isSettling, setIsSettling] = useState(true);

  useEffect(() => {
    // Keep the "wet ink" classes active for 5000ms to match the experimental slow speeds
    const timer = setTimeout(() => {
      setIsSettling(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={isSettling ? 'fresh-print flex-1 flex flex-col' : 'flex-1 flex flex-col'}>
      {isSettling && (
        <div className="ink-noise-overlay">
          <svg className="w-full h-full opacity-60">
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
      )}
      {children}
    </div>
  );
}
