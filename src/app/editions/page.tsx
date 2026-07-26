'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Label, Stamp, RefId } from '@/components/AtelierPrimitives';
import { upcomingEditions } from '@/data/editions';
export default function EditionsPage() {
  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
  const item: any = {
    hidden: { opacity: 0, y: 10, filter: 'blur(3px)' },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
    }
  };
  return (
    <main className="min-h-screen text-[color:var(--color-ink)] selection:bg-[color:var(--color-burgundy)] selection:text-[color:var(--color-paper)]">
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply z-[-1]" />
      <article className="mx-auto max-w-[840px] px-6 sm:px-12 pt-24 pb-32 sm:pt-32 sm:pb-48">
        <motion.div variants={container} initial="hidden" animate="show">
          {}
          <motion.header variants={item} className="mb-24">
            <div className="flex items-center gap-4 mb-8 opacity-60">
              <Stamp>RESEARCH & DEVELOPMENT</Stamp>
              <div className="h-[1px] flex-1 bg-[color:var(--color-rule)]" />
              <RefId>VOL. FUTURE</RefId>
            </div>
            <h1 className="font-serif text-[3.5rem] sm:text-[4.5rem] leading-[0.95] tracking-tight mb-8">
              Upcoming <br className="hidden sm:block" />
              <span className="italic">Editions.</span>
            </h1>
            <p className="font-serif text-[1.25rem] leading-[1.6] text-[color:var(--color-ink-soft)] max-w-[42ch]">
              The living archive is never finished. A preview of future capabilities, currently in research or development, designed to deepen the preservation of your work.
            </p>
          </motion.header>
          {}
          <div className="space-y-32">
            {upcomingEditions.map((edition, index) => (
              <motion.section key={edition.id} variants={item} className="relative">
                {index > 0 && <hr className="fold-line mb-32" />}
                <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-10">
                  <h2 className="font-serif text-[2.5rem] leading-[1.1] flex-1">
                    {edition.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 opacity-70">
                    <Stamp>{edition.status.toUpperCase()}</Stamp>
                    <Stamp>IMPACT: {edition.impact.toUpperCase()}</Stamp>
                    <Stamp>COMPLEXITY: {edition.complexity.toUpperCase()}</Stamp>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
                  {}
                  <div className="md:col-span-7">
                    <p className="font-serif text-[1.25rem] leading-[1.7] text-[color:var(--color-ink)]">
                      {edition.shortDescription}
                    </p>
                  </div>
                  {}
                  <div className="md:col-span-5 space-y-10">
                    <div>
                      <Label className="mb-3 block">Problem Solved</Label>
                      <p className="font-serif text-[1.05rem] leading-[1.6] text-[color:var(--color-ink-soft)]">
                        {edition.problemSolved}
                      </p>
                    </div>
                    <div>
                      <Label className="mb-3 block">Why it exists</Label>
                      <p className="font-serif text-[1.05rem] leading-[1.6] text-[color:var(--color-ink-soft)] italic border-l border-[color:var(--color-rule)] pl-4 ml-1">
                        {edition.whyItExists}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>
            ))}
          </div>
          {}
          <motion.div variants={item}>
            <div className="mt-40 mb-16 flex justify-center opacity-40">
              <Stamp>END OF MANUSCRIPT</Stamp>
            </div>
          </motion.div>
          <motion.div variants={item} className="border-t border-[color:var(--color-rule)] pt-12 text-center">
            <div className="mt-4">
              <RefId>Sync Archival Systems</RefId>
            </div>
          </motion.div>
        </motion.div>
      </article>
    </main>
  );
}
