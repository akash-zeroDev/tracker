'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { RefId, Stamp } from '@/components/AtelierPrimitives';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { archiveGoal } from '@/app/actions';

/* ————— TYPES ————— */

type SpecialType = "normal" | "milestone" | "published" | "chain_10" | "chain_50" | "chain_100" | "new_subject" | "chain_broken" | "deep_focus" | "revival" | "archived";

interface EntryRow {
  id: string;
  goalId: string;
  dateStr: string; 
  displayDate: string; // e.g., "18 Jul"
  fragment: string;
  readingTime: string;
  subject: string;
  category: string;
  refId: string;
  specialType?: SpecialType;
  monthId: string; // e.g., "2026-07"
  year: string; // e.g., "2026"
  monthName: string; // e.g., "JULY"
}

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
        { val: stats.fragmentsCount, label: "Fragments Filed", dur: 1.8 },
        { val: stats.monthsRecorded, label: "Months Recorded", dur: 1.0 },
        { val: stats.maxChain, label: "Longest Chain", dur: 1.2 },
        { val: stats.activeSubjects, label: "Subjects Studied", dur: 1.4 },
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

function ChronicleRow({ entry }: { entry: EntryRow }) {
  const router = useRouter();
  const is10 = entry.specialType === "chain_10";
  const is50 = entry.specialType === "chain_50";
  const is100 = entry.specialType === "chain_100";
  const isNew = entry.specialType === "new_subject";
  const isDeepFocus = entry.specialType === "deep_focus";
  const isRevival = entry.specialType === "revival";
  const isArchived = entry.specialType === "archived";
  
  const hasSpecial = is10 || is50 || is100 || isNew || isDeepFocus || isRevival || isArchived;

  return (
    <Link href={`/edit/${entry.goalId}`} className="group relative flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 py-5 border-b border-[color:var(--color-rule)] hover:bg-[color:var(--color-paper-deep)] transition-colors duration-300 -mx-6 px-6 cursor-pointer">
      {/* Date Column */}
      <div className="w-24 shrink-0">
        <span className="font-serif text-[1.1rem] text-[color:var(--color-ink-soft)] group-hover:text-[color:var(--color-ink)] transition-colors duration-300">
          {entry.displayDate}
        </span>
      </div>

      {/* Fragment Content */}
      <div className="flex-1 min-w-0 relative">
        <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-[1px]">
          {hasSpecial && (
            <div className="mb-2">
              {is10 && <span className="archive-stamp !text-[0.6rem] !px-1.5 opacity-80 border-[color:var(--color-burgundy)] text-[color:var(--color-burgundy)]">10 Day Chain</span>}
              {is50 && <span className="archive-stamp !text-[0.6rem] !px-1.5 opacity-80 border-[color:var(--color-burgundy)] text-[color:var(--color-burgundy)]">50 Day Chain</span>}
              {is100 && <span className="archive-stamp !text-[0.6rem] !px-1.5 opacity-80 border-[color:var(--color-burgundy)] text-[color:var(--color-burgundy)]">100 Day Chain</span>}
              {isNew && <span className="label-caps !text-[0.65rem] opacity-60 italic">New Subject</span>}
              {isDeepFocus && <span className="label-caps !text-[0.65rem] opacity-60 italic">Deep Focus</span>}
              {isRevival && <span className="label-caps !text-[0.65rem] opacity-60 italic">Revival</span>}
              {isArchived && <span className="label-caps !text-[0.65rem] opacity-40 line-through">Archived</span>}
            </div>
          )}
          <h3 className="font-serif text-[1.2rem] font-medium leading-[1.3] text-[color:var(--color-ink)] mb-1">
            {entry.subject}
          </h3>
          <p className={`font-serif text-[1.05rem] leading-[1.65] ${isArchived ? 'text-[color:var(--color-ink-soft)] italic' : 'text-[color:var(--color-ink-soft)]'}`}>
            {entry.fragment}
          </p>
        </div>
      </div>

      {/* Metadata Columns */}
      <div className="flex md:flex-col items-baseline justify-between md:items-end w-full md:w-32 shrink-0 gap-2 md:gap-1 mt-3 md:mt-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
        <span className="label-caps !text-[0.65rem] truncate max-w-full">{entry.category !== 'Uncategorized' ? entry.category : 'Log'}</span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.65rem] tracking-widest">{entry.readingTime}</span>
          <RefId className="group-hover:text-[color:var(--color-burgundy)] transition-colors">{entry.refId}</RefId>
        </div>
        {!isArchived && (
          <button 
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await archiveGoal(entry.goalId);
              router.refresh();
            }}
            className="mt-2 text-[0.6rem] uppercase tracking-widest font-mono opacity-0 group-hover:opacity-100 hover:text-[color:var(--color-burgundy)] transition-all duration-300"
          >
            Archive Folio
          </button>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-[color:var(--color-ink)] group-hover:w-full transition-all duration-500 ease-out z-20" />
    </Link>
  );
}

function MonthlySummary({ monthName, summary }: { monthName: string, summary: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mt-12 mb-24 p-8 bg-[color:var(--color-paper-deep)] border border-[color:var(--color-rule)] flex flex-col md:flex-row justify-between items-baseline gap-8"
    >
      <div>
        <div className="label-caps mb-2">{monthName} SUMMARY</div>
        <h3 className="font-serif text-[2rem] text-[color:var(--color-ink)]">{summary.fragments} Fragments Filed</h3>
      </div>
      <div className="flex gap-8 lg:gap-16">
        <div>
          <div className="label-caps mb-1 opacity-60">Longest Chain</div>
          <div className="font-serif text-[1.25rem]">{summary.chain} Days</div>
        </div>
        <div>
          <div className="label-caps mb-1 opacity-60">Most Studied</div>
          <div className="font-serif text-[1.25rem]">{summary.mostStudied || "Mixed"}</div>
        </div>
      </div>
    </motion.div>
  );
}


/* ————— MAIN COMPONENT ————— */

const FILTERS = ["All", "Software Engineering", "Design", "Writing", "Research", "Reading"];

export function EntriesManuscript({ entries, summaries, archiveStats }: { entries: EntryRow[], summaries: any, archiveStats: any }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. First filter by search query (across fragment, subject, refId)
  let filteredList = entries;
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    filteredList = filteredList.filter(e => 
      e.fragment.toLowerCase().includes(q) || 
      e.subject.toLowerCase().includes(q) || 
      e.refId.toLowerCase().includes(q)
    );
  }

  // 2. Then filter by Category
  if (activeFilter !== "All") {
    filteredList = filteredList.filter(e => e.category === activeFilter);
  }

  // Group by Year -> Month
  const groupedEntries = filteredList.reduce((acc, entry) => {
    if (!acc[entry.year]) acc[entry.year] = {};
    if (!acc[entry.year][entry.monthId]) acc[entry.year][entry.monthId] = [];
    acc[entry.year][entry.monthId].push(entry);
    return acc;
  }, {} as Record<string, Record<string, EntryRow[]>>);

  return (
    <section className="w-full max-w-[1080px] mx-auto px-6 sm:px-8 pt-12 pb-32 relative">
      
      {/* Ambient background noise */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply z-[-1]" />

      {/* Header & Search */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
        <div>
          <Stamp>Vol. IV</Stamp>
          <h1 className="mt-4 font-serif text-[3rem] sm:text-[4rem] leading-[0.9] tracking-tight">
            The Chronicle
          </h1>
        </div>
        <div className="w-full md:w-64 border-b border-[color:var(--color-rule)] pb-2 flex items-center focus-within:border-[color:var(--color-ink)] transition-colors duration-300">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Lookup fragment..." 
            className="w-full bg-transparent border-none outline-none font-serif text-[1.05rem] italic text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-soft)] placeholder:opacity-50"
          />
        </div>
      </header>

      {/* Statistics Section */}
      <Section01Stats stats={archiveStats} />

      {/* Editorial Filters */}
      <nav className="mb-16 flex flex-wrap gap-4 items-center font-serif text-[1.05rem]">
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

      {/* The Manuscript (Chronicle) */}
      <div className="space-y-24">
        {Object.entries(groupedEntries).sort((a, b) => Number(b[0]) - Number(a[0])).map(([year, months]) => (
          <div key={year}>
            
            {/* Year Divider */}
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex items-center gap-4 mb-12 origin-left"
            >
              <h2 className="font-serif text-[2.5rem] tracking-tight">{year}</h2>
              <div className="flex-1 h-[1px] bg-[color:var(--color-rule)]" />
            </motion.div>

            {/* Months */}
            <div className="space-y-16">
              {Object.entries(months).sort((a, b) => b[0].localeCompare(a[0])).map(([monthId, monthGroupedEntries]) => {
                const monthName = monthGroupedEntries[0].monthName;
                const summary = summaries[monthId];
                
                return (
                  <div key={monthId}>
                    {/* Month Header */}
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="label-caps mb-6 text-[color:var(--color-ink-soft)]"
                    >
                      {monthName}
                    </motion.div>

                    {/* Entries List */}
                    <div className="flex flex-col">
                      {monthGroupedEntries.map(entry => (
                        <ChronicleRow key={entry.id} entry={entry} />
                      ))}
                    </div>

                    {/* Monthly Summary */}
                    {summary && activeFilter === "All" && searchQuery === "" && (
                      <MonthlySummary monthName={monthName} summary={summary} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {filteredList.length === 0 && (
          <div className="font-serif italic text-[color:var(--color-ink-soft)] text-lg text-center py-12">
            No fragments found in the archive.
          </div>
        )}
      </div>

      {/* End of Archive Marker */}
      <div className="mt-32 pt-12 border-t border-dashed border-[color:var(--color-rule)] flex justify-center opacity-40">
        <Stamp>END OF RECORD</Stamp>
      </div>

    </section>
  );
}
