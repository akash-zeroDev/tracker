'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Label, Stamp, RefId } from '@/components/AtelierPrimitives';

export function LiveFooter() {
  const footerRef = useRef(null);
  const inView = useInView(footerRef, { once: true, margin: "-50px" });
  
  const currentYear = new Date().getFullYear();
  // Simple roman numeral converter for the year
  const romanYear = (num: number) => {
    const lookup: any = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
    let roman = '';
    for (let i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <footer ref={footerRef} className="border-t border-[color:var(--color-rule)] bg-[color:var(--color-paper-deep)]/60 mt-auto overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="mx-auto grid max-w-[1180px] grid-cols-12 gap-8 px-8 py-14 relative"
      >
        <div className="col-span-12 md:col-span-5">
          <motion.div variants={itemVariants}>
            <Label>Colophon</Label>
          </motion.div>
          <motion.p variants={itemVariants} className="mt-4 font-serif text-[0.98rem] leading-[1.65] text-[color:var(--color-ink-soft)] max-w-[42ch]">
            Sync is set in{" "}
            <span className="font-serif italic text-[color:var(--color-ink)]">Fraunces</span>,{" "}
            <span className="font-sans text-[color:var(--color-ink)]">Inter&nbsp;Tight</span>, and{" "}
            <span className="font-mono text-[color:var(--color-ink)]">JetBrains&nbsp;Mono</span>. Printed on
            warm paper stock. Bound by hand, one day at a time.
          </motion.p>
        </div>
        
        <div className="col-span-6 md:col-span-3">
          <motion.div variants={itemVariants}><Label>Sections</Label></motion.div>
          <ul className="mt-4 space-y-3 font-serif text-[0.95rem]">
            <motion.li variants={itemVariants}>
              <Link href="/" className="footnote-link inline-block hover:text-[color:var(--color-burgundy)] transition-colors duration-300">
                Desk
              </Link>
            </motion.li>
            <motion.li variants={itemVariants}>
              <Link href="/community" className="footnote-link inline-block hover:text-[color:var(--color-burgundy)] transition-colors duration-300">
                Community Board
              </Link>
            </motion.li>
            <motion.li variants={itemVariants}>
              <span className="footnote-link inline-block opacity-50 cursor-not-allowed">Public Archive</span>
            </motion.li>
          </ul>
        </div>

        <div className="col-span-6 md:col-span-2">
          <motion.div variants={itemVariants}><Label>Marginalia</Label></motion.div>
          <ul className="mt-4 space-y-3 font-serif text-[0.95rem]">
            <motion.li variants={itemVariants}>
              <a href="https://github.com/teamSiksha" target="_blank" rel="noreferrer" className="footnote-link inline-block hover:text-[color:var(--color-burgundy)] transition-colors duration-300">
                Source Code
              </a>
            </motion.li>
            <motion.li variants={itemVariants}>
              <a href="#" className="footnote-link inline-block hover:text-[color:var(--color-burgundy)] transition-colors duration-300">
                Release Notes
              </a>
            </motion.li>
          </ul>
        </div>

        <div className="col-span-12 md:col-span-2 flex flex-col justify-between items-start md:items-end mt-8 md:mt-0">
          <motion.div variants={itemVariants} whileHover={{ rotate: 2, scale: 1.05 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
            <Stamp>Vol. IV · {romanYear(currentYear)}</Stamp>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-8 md:mt-0 opacity-80 hover:opacity-100 transition-opacity">
            <RefId>SYNC · {currentYear}</RefId>
          </motion.div>
        </div>
      </motion.div>

      <div className="border-t border-dashed border-[color:var(--color-rule)]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.0, duration: 1 }}
          className="mx-auto flex flex-col sm:flex-row max-w-[1180px] sm:items-center justify-between px-8 py-4 gap-4"
        >
          <RefId>© {currentYear} — Built by Ak</RefId>
          <RefId className="flex items-center gap-2">
            Sync
          </RefId>
        </motion.div>
      </div>
    </footer>
  );
}
