'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Label, Stamp, RefId } from '@/components/AtelierPrimitives';
import { InkText, InkBlock, InkRule } from '@/components/transitions/InkPrimitives';
export default function ManifestoPage() {
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
      <article className="mx-auto max-w-[720px] px-6 sm:px-12 pt-24 pb-32 sm:pt-32 sm:pb-48">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.header variants={item} className="mb-20">
            <div className="flex items-center gap-4 mb-8 opacity-60">
              <Stamp>No. 01</Stamp>
              <div className="h-[1px] flex-1 bg-[color:var(--color-rule)]" />
              <RefId>THE MANIFESTO</RefId>
            </div>
            <h1 className="font-serif text-[3.5rem] sm:text-[4.5rem] leading-[0.95] tracking-tight mb-8">
              Effort <span className="italic">deserves</span> <br className="hidden sm:block" />
              a permanent record.
            </h1>
            <p className="font-serif text-[1.25rem] leading-[1.6] text-[color:var(--color-ink-soft)] max-w-[42ch]">
              A public journal designed not for noise, but for focus. A quiet corner of the web where your daily progress is preserved, not merely tracked.
            </p>
          </motion.header>
          <motion.div variants={item}>
            <hr className="fold-line mb-20" />
          </motion.div>
          <section className="space-y-20">
            <motion.div variants={item}>
              <Label className="mb-6 block">I. The Paradigm</Label>
              <h2 className="font-serif text-[2rem] leading-[1.2] mb-6">Against the performative hustle.</h2>
              <div className="font-serif text-[1.1rem] leading-[1.8] text-[color:var(--color-ink-soft)] space-y-6 max-w-[55ch]">
                <p>
                  Modern tech culture is obsessed with noise. We are pushed to broadcast constantly, optimize every second, and chase superficial engagement. The result is a chaotic feed of fleeting posts, scattered bookmarks, and fragmented tutorials.
                </p>
                <p>
                  This project was built as a rejection of that philosophy. It is not a social network. It does not exist to make you go viral. Instead, it introduces intentional focus—a frictionless, quiet space that simply asks you to slow down and log the work you did today.
                </p>
              </div>
            </motion.div>
            <motion.div variants={item}>
              <Label className="mb-6 block">II. The Philosophy</Label>
              <h2 className="font-serif text-[2rem] leading-[1.2] mb-6">Taking pride in the process.</h2>
              <div className="font-serif text-[1.1rem] leading-[1.8] text-[color:var(--color-ink-soft)] space-y-6 max-w-[55ch]">
                <p>
                  When we look through a filled sketchbook or a physical notebook, we treat the effort inside with respect. Digital tracking tools rarely evoke this feeling. They feel sterile, heavily gamified, and entirely disposable.
                </p>
                <p>
                  By stripping away the clutter—focusing on stark typography, dense activity grids, and distraction-free writing—this archive fosters a genuine pride in your own consistency. Every daily entry you log should feel like a brick laid in a solid foundation: permanent, undeniable, and deeply personal.
                </p>
              </div>
            </motion.div>
            <motion.div variants={item}>
              <Label className="mb-6 block">III. Design Principles</Label>
              <div className="font-serif text-[1.1rem] leading-[1.8] text-[color:var(--color-ink-soft)] space-y-6 max-w-[55ch]">
                <ul className="space-y-8">
                  <li>
                    <strong className="text-[color:var(--color-ink)] font-normal block text-[1.2rem] mb-1">Stillness</strong>
                    The interface should never rush the creator. There are no push notifications, no noisy feeds, and no artificial anxiety. Just you and the blank input field.
                  </li>
                  <li>
                    <strong className="text-[color:var(--color-ink)] font-normal block text-[1.2rem] mb-1">Craftsmanship</strong>
                    Your words and code snippets are the primary material. Setting them in clean, highly legible typography with comfortable margins is not merely an aesthetic choice—it is a functional necessity for reading your own history.
                  </li>
                  <li>
                    <strong className="text-[color:var(--color-ink)] font-normal block text-[1.2rem] mb-1">Proof of Work</strong>
                    We look to physical ledgers and engineering schematics for inspiration. The density of the heatmap grid and the strict chronological timeline inform every interaction.
                  </li>
                </ul>
              </div>
            </motion.div>
            <motion.div variants={item}>
              <Label className="mb-6 block">IV. The Mechanism</Label>
              <h2 className="font-serif text-[2rem] leading-[1.2] mb-6">The architecture of accountability.</h2>
              <div className="font-serif text-[1.1rem] leading-[1.8] text-[color:var(--color-ink-soft)] space-y-6 max-w-[55ch]">
                <p>
                  Progress here is strictly fragment-based. You do not manage an endless, messy document; you file distinct, daily entries.
                </p>
                <p>
                  Each log receives a definitive timestamp, acting as proof of your consistency. Through a frictionless, secret-key architecture, you own your data without the barrier of user accounts and passwords. The interaction model is public-first: once your day is logged, it sits on your unique URL, formatted as a beautiful, shareable ledger for peers, mentors, or recruiters to read.
                </p>
              </div>
            </motion.div>
            <motion.div variants={item}>
              <Label className="mb-6 block">V. The Horizon</Label>
              <h2 className="font-serif text-[2rem] leading-[1.2] mb-6">An artifact of your career.</h2>
              <div className="font-serif text-[1.1rem] leading-[1.8] text-[color:var(--color-ink-soft)] space-y-6 max-w-[55ch]">
                <p>
                  Most tracking software becomes exhausting to maintain over time. This tracker is designed to acquire weight. As weeks turn into months and your grid fills with data, the interface reflects the sheer scale of your dedication.
                </p>
                <p>
                  It is an infrastructure meant to last for years. A quiet companion that documents your intellectual evolution, outliving the fleeting trends of the modern web.
                </p>
              </div>
            </motion.div>
          </section>
          <motion.div variants={item}>
            <div className="mt-32 mb-16 flex justify-center opacity-40">
              <Stamp>END OF RECORD</Stamp>
            </div>
          </motion.div>
          <motion.div variants={item} className="border-t border-[color:var(--color-rule)] pt-12 text-center">
            <p className="font-serif text-[1.25rem] italic leading-relaxed text-[color:var(--color-ink)]">
              "We leave behind not what we consume, <br className="hidden sm:block" />
              but the quiet reflections we choose to preserve."
            </p>
            <div className="mt-8">
              <RefId>Sync · MMXVI</RefId>
            </div>
          </motion.div>
        </motion.div>
      </article>
    </main>
  );
}
