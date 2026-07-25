'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { RefId } from '@/components/AtelierPrimitives';

function Counter({ to, duration = 1.5 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(0, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          if (ref.current) ref.current.textContent = Math.round(value).toString();
        }
      });
      return () => controls.stop();
    }
  }, [inView, to, duration]);

  return <span ref={ref}>0</span>;
}

export function ArchiveManifest({
  fragmentsCount,
  longestChain,
  activeFoliosCount,
  subjectsCount
}: {
  fragmentsCount: number;
  longestChain: number;
  activeFoliosCount: number;
  subjectsCount?: number;
}) {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });
  const [footnote, setFootnote] = useState<string>("Hover over a metric to view its archival record.");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } // Custom soft ease-out
    },
  };

  const lineVariants = {
    hidden: { scaleX: 0, originX: 0 },
    visible: { 
      scaleX: 1,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
    },
  };

  return (
    <div className="relative w-full py-16" ref={containerRef}>
      
      {/* Background ambient texture & cursor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-[1180px] mx-auto px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-end">
          
          {/* HUGE STATISTIC - DOMINANT */}
          <motion.div variants={itemVariants} className="md:col-span-5">
            <div 
              className="group relative cursor-crosshair pb-4"
              onMouseEnter={() => setFootnote("Total physical fragments filed permanently into the archive since 12 Feb 2026.")}
              onMouseLeave={() => setFootnote("Hover over a metric to view its archival record.")}
            >
              <div className="flex items-baseline gap-4 mb-2">
                <span className="archive-stamp !text-[0.6rem] !px-1.5 opacity-60">VOL. IV</span>
                <span className="w-1.5 h-3 bg-[color:var(--color-burgundy)] animate-pulse opacity-70 inline-block" />
              </div>
              
              <div className="font-serif text-[6rem] sm:text-[8rem] md:text-[10rem] leading-[0.8] text-[color:var(--color-ink)] transition-transform duration-500 ease-out group-hover:-translate-y-1">
                <Counter to={fragmentsCount} duration={1.8} />
              </div>
              
              <div className="mt-6 flex justify-between items-end border-b border-[color:var(--color-rule)] pb-4 transition-colors duration-500 group-hover:border-[color:var(--color-ink)]">
                <span className="font-sans uppercase tracking-[0.15em] text-[0.85rem] text-[color:var(--color-ink-soft)] group-hover:text-[color:var(--color-ink)] transition-colors duration-300">
                  Fragments Filed
                </span>
                <RefId className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  ref: 01
                </RefId>
              </div>
            </div>
          </motion.div>

          {/* SECONDARY STATISTICS - ASYMMETRICAL */}
          <div className="md:col-span-6 md:col-start-7 flex flex-col justify-end gap-12 pb-4">
            
            <motion.div variants={itemVariants}>
              <div 
                className="group relative cursor-crosshair"
                onMouseEnter={() => setFootnote("Longest uninterrupted learning chain, recorded in consecutive days.")}
                onMouseLeave={() => setFootnote("Hover over a metric to view its archival record.")}
              >
                <div className="font-serif text-[4rem] sm:text-[5rem] leading-[0.9] text-[color:var(--color-ink)] transition-transform duration-500 ease-out group-hover:-translate-y-1">
                  <Counter to={longestChain} duration={1.4} />
                </div>
                
                <div className="mt-4 flex justify-between items-end border-b border-[color:var(--color-rule)] pb-3 transition-colors duration-500 group-hover:border-[color:var(--color-ink)]">
                  <span className="font-sans uppercase tracking-[0.15em] text-[0.8rem] text-[color:var(--color-ink-soft)] group-hover:text-[color:var(--color-ink)] transition-colors duration-300">
                    Longest Chain
                  </span>
                  <RefId className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ref: 02
                  </RefId>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-8">
              <motion.div variants={itemVariants}>
                <div 
                  className="group relative cursor-crosshair"
                  onMouseEnter={() => setFootnote("Currently active learning folios remaining on the desk.")}
                  onMouseLeave={() => setFootnote("Hover over a metric to view its archival record.")}
                >
                  <div className="font-serif text-[2.5rem] leading-none text-[color:var(--color-ink)] transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
                    <Counter to={activeFoliosCount} duration={1.0} />
                  </div>
                  <div className="mt-3 flex justify-between items-end border-b border-[color:var(--color-rule)] pb-2 transition-colors duration-500 group-hover:border-[color:var(--color-ink)]">
                    <span className="font-sans uppercase tracking-[0.1em] text-[0.75rem] text-[color:var(--color-ink-soft)]">
                      Active Folios
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div 
                  className="group relative cursor-crosshair"
                  onMouseEnter={() => setFootnote("Total subjects explored across all archived volumes.")}
                  onMouseLeave={() => setFootnote("Hover over a metric to view its archival record.")}
                >
                  <div className="font-serif text-[2.5rem] leading-none text-[color:var(--color-ink)] transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
                    <Counter to={subjectsCount} duration={1.2} />
                  </div>
                  <div className="mt-3 flex justify-between items-end border-b border-[color:var(--color-rule)] pb-2 transition-colors duration-500 group-hover:border-[color:var(--color-ink)]">
                    <span className="font-sans uppercase tracking-[0.1em] text-[0.75rem] text-[color:var(--color-ink-soft)]">
                      Subjects
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>

        {/* Editorial Footnote Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-20 pt-6 border-t border-[color:var(--color-rule)] relative overflow-hidden"
        >
          <motion.div 
            variants={lineVariants}
            className="absolute top-[-1px] left-0 h-[1px] bg-[color:var(--color-ink)]" 
            style={{ width: '10%' }}
          />
          
          <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4">
            <div className="font-serif text-[1.1rem] italic text-[color:var(--color-ink-soft)] min-h-[1.5rem] transition-colors duration-300">
              {footnote}
            </div>
            
            <div className="flex gap-6 opacity-60">
              <span className="font-mono text-[0.65rem] tracking-widest uppercase">
                Last updated: <span className="animate-pulse">just now</span>
              </span>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
