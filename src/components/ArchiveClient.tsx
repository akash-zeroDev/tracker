'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, animate, AnimatePresence } from 'framer-motion';
import { Stamp } from '@/components/AtelierPrimitives';
import Link from 'next/link';

/* ————— TYPES ————— */

export type VolumeSize = "featured" | "standard" | "compact";

export interface ArchiveVolumeData {
  id: string;
  volNumber: string;
  title: string;
  archivedDate: string;
  duration: string;
  totalEntries: number;
  longestStreak: number;
  category: string;
  excerpt: string;
  size: VolumeSize;
  shelfCode: string;
  refId: string;
  timestamp: number;
}

const FILTERS = ["All Volumes", "Software Engineering", "Design", "Writing", "Research", "Reading", "Uncategorized"];

/* ————— HELPER COMPONENTS ————— */

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

function Section01Stats({ stats }: { stats: any }) {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16 mb-16 border-b border-[color:var(--color-rule)]">
      {[
        { val: stats.archivedCount, label: "Published Volumes", dur: 1.8 },
        { val: stats.yearsCount, label: "Years Documented", dur: 1.0 },
        { val: stats.fragmentsCount, label: "Fragments Preserved", dur: 1.4 },
        { val: stats.subjectsCount, label: "Subjects Mastered", dur: 1.6 },
      ].map((stat, i) => (
        <motion.div key={i} variants={itemVariants} className="flex flex-col">
          <div className="font-serif text-[4rem] sm:text-[5rem] leading-[0.9] text-[color:var(--color-ink)] mb-4">
            <Counter to={stat.val} duration={stat.dur} />
          </div>
          <span className="font-sans uppercase tracking-[0.15em] text-[0.8rem] text-[color:var(--color-ink-soft)]">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ————— THE VOLUME (BOOK) COMPONENT ————— */

function Volume({ vol }: { vol: ArchiveVolumeData }) {
  const isFeatured = vol.size === 'featured';
  const isCompact = vol.size === 'compact';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col justify-end bg-[color:var(--color-paper-deep)] border border-[color:var(--color-rule)] cursor-pointer
        ${isFeatured ? 'md:col-span-2 lg:col-span-2 row-span-2 min-h-[500px]' : ''}
        ${!isFeatured && !isCompact ? 'col-span-1 row-span-2 min-h-[400px]' : ''}
        ${isCompact ? 'col-span-1 row-span-1 min-h-[250px]' : ''}
      `}
    >
      {/* Bookmark Ribbon */}
      <div className="absolute top-0 right-8 w-6 h-0 bg-[color:var(--color-burgundy)] opacity-80 transition-all duration-500 ease-out group-hover:h-12 z-0" style={{ transformOrigin: 'top' }} />

      {/* Book Spine Texture / Thickness Indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-3 border-r border-[color:var(--color-rule)] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-multiply" />
      <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-[color:var(--color-ink)]/5 to-transparent" />

      {/* Volume Content */}
      <div className="relative z-10 p-8 md:p-10 flex flex-col h-full justify-between transition-transform duration-500 ease-out group-hover:-translate-y-2">
        
        {/* Header: Stamps & Meta */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex flex-col gap-2">
            <span className="font-serif text-[1.5rem] italic text-[color:var(--color-ink-soft)] transition-colors duration-300 group-hover:text-[color:var(--color-burgundy)]">
              Vol. {vol.volNumber}
            </span>
            <span className="font-mono text-[0.65rem] tracking-widest uppercase opacity-60">
              {vol.shelfCode}
            </span>
          </div>
          {isFeatured && (
            <div className="archive-stamp !text-[0.6rem] !px-1.5 opacity-60 border-[color:var(--color-ink)] transition-opacity duration-300 group-hover:opacity-100">
              FEATURED PUBLICATION
            </div>
          )}
        </div>

        {/* Core Metadata */}
        <div>
          <div className="mb-4">
            <span className="label-caps !text-[0.65rem] opacity-60">
              {vol.category}
            </span>
          </div>
          <h3 className={`font-serif leading-[1.1] text-[color:var(--color-ink)] mb-4 ${isFeatured ? 'text-[2.5rem] md:text-[3.5rem]' : 'text-[1.8rem]'}`}>
            {vol.title}
          </h3>
          
          {/* Title Underline Animation */}
          <div className="h-[1px] w-0 bg-[color:var(--color-ink)] opacity-30 transition-all duration-500 ease-out group-hover:w-full mb-6" />

          {!isCompact && (
            <p className="font-serif text-[1.05rem] leading-[1.6] text-[color:var(--color-ink-soft)] mb-8 max-w-[90%]">
              {vol.excerpt}
            </p>
          )}

          {/* Archival Record Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[color:var(--color-rule)] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-col">
              <span className="font-mono text-[0.6rem] tracking-widest uppercase mb-1">Archived</span>
              <span className="font-serif text-[0.95rem]">{vol.archivedDate}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[0.6rem] tracking-widest uppercase mb-1">Duration</span>
              <span className="font-serif text-[0.95rem]">{vol.duration}</span>
            </div>
            {!isCompact && (
              <>
                <div className="flex flex-col">
                  <span className="font-mono text-[0.6rem] tracking-widest uppercase mb-1">Entries</span>
                  <span className="font-serif text-[0.95rem]">{vol.totalEntries}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[0.6rem] tracking-widest uppercase mb-1">Max Streak</span>
                  <span className="font-serif text-[0.95rem]">{vol.longestStreak}</span>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Hover Shadow */}
      <div className="absolute -bottom-4 left-4 right-4 h-4 bg-black/5 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-full" />
    </motion.div>
  );
}

function SortCycler({ sortBy, setSortBy }: { sortBy: string, setSortBy: (v: string) => void }) {
  const options = [
    { id: "Newest", label: "Newest Edition" },
    { id: "Oldest", label: "Oldest Edition" },
    { id: "Longest", label: "Longest Journey" },
    { id: "Entries", label: "Most Entries" },
    { id: "Alphabetical", label: "Alphabetical" }
  ];

  const currentIndex = options.findIndex(o => o.id === sortBy);
  const activeLabel = options[currentIndex]?.label;

  const handleCycle = () => {
    const nextIndex = (currentIndex + 1) % options.length;
    setSortBy(options[nextIndex].id);
  };

  return (
    <button 
      onClick={handleCycle}
      className="group flex items-center gap-2 appearance-none bg-transparent font-serif text-[0.95rem] italic text-[color:var(--color-ink)] cursor-pointer outline-none border-b border-dashed border-[color:var(--color-ink-soft)] pb-0.5 hover:border-[color:var(--color-burgundy)] hover:text-[color:var(--color-burgundy)] transition-colors duration-300"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={sortBy}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
        >
          {activeLabel}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/* ————— MAIN PAGE COMPONENT ————— */

export function ArchiveClient({ volumes, stats }: { volumes: ArchiveVolumeData[], stats: any }) {
  const [activeFilter, setActiveFilter] = useState("All Volumes");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(7);
  const [sortBy, setSortBy] = useState<"Newest" | "Oldest" | "Longest" | "Entries" | "Alphabetical">("Newest");

  let filteredVolumes = [...volumes];
  
  if (activeFilter !== "All Volumes") {
    filteredVolumes = filteredVolumes.filter(v => v.category === activeFilter);
  }

  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    filteredVolumes = filteredVolumes.filter(v => 
      v.title.toLowerCase().includes(q) || 
      v.excerpt.toLowerCase().includes(q)
    );
  }

  filteredVolumes.sort((a, b) => {
    switch (sortBy) {
      case "Newest": return b.timestamp - a.timestamp;
      case "Oldest": return a.timestamp - b.timestamp;
      case "Longest": return b.longestStreak - a.longestStreak;
      case "Entries": return b.totalEntries - a.totalEntries;
      case "Alphabetical": return a.title.localeCompare(b.title);
      default: return 0;
    }
  });

  return (
    <main className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 pt-12 pb-32 relative">
      
      {/* Ambient background noise */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply z-[-1]" />

      {/* Header & Search */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
        <div>
          <Stamp>The Permanent Collection</Stamp>
          <h1 className="mt-4 font-serif text-[3rem] sm:text-[4rem] leading-[0.9] tracking-tight">
            The Archive
          </h1>
        </div>
        <div className="w-full md:w-72 border-b border-[color:var(--color-rule)] pb-2 flex items-center focus-within:border-[color:var(--color-ink)] transition-colors duration-300">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the Library..." 
            className="w-full bg-transparent border-none outline-none font-serif text-[1.05rem] italic text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-soft)] placeholder:opacity-50"
          />
        </div>
      </header>

      {/* Statistics Section */}
      <Section01Stats stats={stats} />

      {/* Editorial Filters & Sorting */}
      <div className="mb-16 flex flex-col md:flex-row justify-between items-baseline gap-8">
        <nav className="flex flex-wrap gap-4 items-center font-serif text-[1.05rem]">
          {FILTERS.map((filter, i) => (
            <React.Fragment key={filter}>
              <button 
                onClick={() => setActiveFilter(filter)}
                className={`transition-colors duration-300 ${activeFilter === filter ? 'text-[color:var(--color-ink)] italic' : 'text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]'}`}
              >
                {filter}
              </button>
              {i < FILTERS.length - 1 && <span className="opacity-30">·</span>}
            </React.Fragment>
          ))}
        </nav>
        <div className="flex gap-4 opacity-80 items-baseline">
          <span className="font-mono text-[0.65rem] tracking-widest uppercase">Sort By</span>
          <SortCycler sortBy={sortBy} setSortBy={setSortBy as any} />
        </div>
      </div>

      {/* The Library Shelf */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-min">
        {filteredVolumes.slice(0, visibleCount).map((vol) => (
          <Volume key={vol.id} vol={vol} />
        ))}
      </div>

      {filteredVolumes.length > visibleCount && (
        <div className="mt-16 flex justify-center">
          <button 
            onClick={() => setVisibleCount(prev => prev + 7)}
            className="px-6 py-3 border border-[color:var(--color-ink)] text-[color:var(--color-ink)] font-mono text-[0.7rem] uppercase tracking-widest hover:bg-[color:var(--color-ink)] hover:text-[color:var(--color-paper)] transition-colors duration-300"
          >
            Load More Volumes
          </button>
        </div>
      )}

      {filteredVolumes.length === 0 && (
        <div className="mt-24 text-center">
          <div className="font-serif text-[2rem] text-[color:var(--color-ink)] mb-4">
            No completed volumes yet.
          </div>
          <div className="font-serif italic text-[color:var(--color-ink-soft)] text-lg">
            Every finished journey earns its place here.
          </div>
        </div>
      )}

      {/* End of Archive Marker */}
      <div className="mt-32 pt-12 border-t border-dashed border-[color:var(--color-rule)] flex justify-center opacity-40">
        <Stamp>END OF COLLECTION</Stamp>
      </div>

    </main>
  );
}
