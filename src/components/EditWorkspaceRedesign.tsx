'use client';

import * as React from "react";
import { Folder, Search, CheckCircle, Clock } from 'lucide-react';
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { EditorialTime } from '@/components/ui/EditorialTime';
import { addLogEntry, sendBackupEmail, toggleGoalVisibility } from "@/app/actions";
import { DestroyTracker } from "./DestroyTracker";
import { GoalDescriptionEditor } from "./GoalDescriptionEditor";
import { Flame, Trash2 } from 'lucide-react';
import { deleteLogEntry } from '@/app/actions';
import { GoalCategoryEditor } from "./GoalCategoryEditor";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface GoalData {
  id: string;
  publicSlug: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  isPublic: boolean;
  createdAt: Date;
  currentStreak: number;
  longestStreak: number;
  entries: Array<{
    id: string;
    content: string | null;
    createdAt: Date;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Small primitives
// ─────────────────────────────────────────────────────────────────────────────

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`label-caps ${className}`}>{children}</span>;
}

function Ref({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`ref-id ${className}`}>{children}</span>;
}

function FoldRule({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full bg-[var(--color-rule)] ${className}`} aria-hidden />;
}

function SectionHeading({
  index,
  title,
  hint,
}: {
  index: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <div className="flex items-baseline gap-4">
        <Ref>{index}</Ref>
        <h3 className="font-serif text-xl leading-none tracking-tight">{title}</h3>
      </div>
      {hint && <Label className="hidden sm:inline">{hint}</Label>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Left column — Volume information
// ─────────────────────────────────────────────────────────────────────────────

function VolumePlate({ goal }: { goal: GoalData }) {
  const ageDays = Math.max(1, Math.floor((Date.now() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24)));
  const shelf = goal.id.slice(0, 2).toUpperCase();
  const accession = goal.id.split('-')[0].toUpperCase();

  return (
    <aside className="reveal paper-sheet relative flex flex-col p-8 lg:p-10">
      <div className="flex justify-between items-start mb-6">
        <Label>Volume · {goal.status.toLowerCase()}</Label>
        <div className="flex flex-col items-end gap-1">
          <Label>Shelf {shelf}</Label>
          <Ref>№ {accession}</Ref>
        </div>
      </div>

      <h1 className="font-serif text-4xl leading-[1.05] tracking-tight lg:text-5xl">
        {goal.title}
      </h1>

      <div className="mt-4 -ml-2">
        <GoalDescriptionEditor goalId={goal.id} initialDescription={goal.description} />
      </div>

      <div className="mt-4">
        <GoalCategoryEditor goalId={goal.id} initialCategory={goal.category} />
      </div>

      <FoldRule className="my-10" />

      <dl className="grid grid-cols-3 gap-6">
        <ArchivalStreakStat label="Streak" value={goal.currentStreak} trigger={goal.entries.length} suffix="days" />
        <Stat label="Opened" value={ageDays} suffix="days ago" />
        <Stat label="Filed" value={goal.entries.length} suffix="frags." />
      </dl>

      <div className="pt-8 mt-8 border-t border-[var(--color-rule)]">
        <div className="flex items-center justify-between">
          <Label>Opened</Label>
          <Ref><EditorialTime date={goal.createdAt} context="compact" /></Ref>
        </div>
      </div>
    </aside>
  );
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const n = useCountUp(value);
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="font-serif text-3xl leading-none">{n}</span>
        <span className="text-[11px] text-[var(--color-ink-soft)]">{suffix}</span>
      </div>
    </div>
  );
}

function ArchivalStreakStat({ label, value, trigger, suffix }: { label: string; value: number; trigger?: number; suffix: string }) {
  // We do not count up from 0. A physical archive displays the exact value.
  // The animation triggers strictly when the trigger (entries length) changes.
  
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex items-baseline gap-1.5 overflow-hidden py-1">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={trigger ?? value}
            initial={{ opacity: 0, y: -25, rotateX: 60, filter: 'blur(3px)', textShadow: '0px 0px 0px rgba(0,0,0,0)' }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              rotateX: 0,
              filter: 'blur(0px)',
              textShadow: '0px 2px 2px rgba(0,0,0,0.1), 0px -1px 1px rgba(255,255,255,0.7)' // The blind emboss impression
            }}
            exit={{ opacity: 0, y: 25, rotateX: -60, filter: 'blur(3px)', textShadow: '0px 0px 0px rgba(0,0,0,0)' }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 18,
              mass: 2.5, // Heavy mechanical feel
            }}
            className="font-serif text-3xl leading-none block origin-center"
            style={{ perspective: 1000 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
        <span className="text-[11px] text-[var(--color-ink-soft)]">{suffix}</span>
      </div>
    </div>
  );
}

function useCountUp(target: number, ms = 700) {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return n;
}

// ─────────────────────────────────────────────────────────────────────────────
// Center — Manuscript writing surface
// ─────────────────────────────────────────────────────────────────────────────

function WritingSurface({ goal }: { goal: GoalData }) {
  const [text, setText] = React.useState("");
  const [isPending, startTransition] = React.useTransition();
  const [exitIntentFlash, setExitIntentFlash] = React.useState(false);
  const [stampedFragment, setStampedFragment] = React.useState<number | null>(null);
  const router = useRouter();
  
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const today = new Date();
  const dateLabel = formatArchivalDate(today);

  React.useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger if mouse leaves viewport at the top and there's unsaved text
      if (e.clientY <= 0 && text.trim().length > 0 && !isPending) {
        setExitIntentFlash(true);
        setTimeout(() => setExitIntentFlash(false), 2500);
      }
    };
    
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [text, isPending]);

  const handleFileFragment = () => {
    if (!text.trim() || isPending) return;
    
    startTransition(async () => {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        await addLogEntry(goal.id, text, tz);
        setStampedFragment(goal.entries.length + 1);
        setTimeout(() => setStampedFragment(null), 2500); // Auto-hide after 2.5 seconds
        setText("");
        router.refresh();
      } catch (err) {
        console.error("Failed to file fragment:", err);
      }
    });
  };

  return (
    <section className="reveal reveal-delay-1 paper-sheet relative p-8 lg:p-14">
      <span className="paper-clip left-10 -top-3 hidden lg:block" aria-hidden />

      <header className="flex flex-wrap items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <Label>Manuscript · today</Label>
          <Ref>{dateLabel}</Ref>
        </div>
      </header>

      <FoldRule className="mt-6" />

      {/* Ruled writing area */}
      <motion.div 
        animate={stampedFragment ? { scale: [1, 0.995, 1], y: [0, 1, 0] } : {}}
        transition={stampedFragment ? { duration: 0.3, times: [0, 0.2, 1], ease: "easeOut", delay: 0.05 } : {}}
        className={`relative mt-8 rounded-[4px] transition-all duration-500 ease-out ${
          exitIntentFlash ? 'ring-2 ring-[var(--color-burgundy)] bg-[var(--color-burgundy)]/5' : 'ring-1 ring-transparent'
        }`}
      >
        <AnimatePresence>
          {exitIntentFlash && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-12 right-0 bg-[var(--color-burgundy)] text-[var(--color-paper)] font-mono text-[0.7rem] uppercase tracking-widest px-4 py-2 shadow-lg z-20 flex items-center gap-2 rounded-sm"
            >
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              Unfiled Manuscript
            </motion.div>
          )}
        </AnimatePresence>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[4px]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent, transparent 31px, oklch(0.82 0.02 80 / 0.35) 32px)",
            backgroundPosition: "0 6px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-10 top-0 bottom-0 w-px bg-[var(--color-burgundy)]/25"
        />
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (stampedFragment !== null) setStampedFragment(null);
          }}
          placeholder="Write today's fragment. A sentence is enough. The archive is patient."
          rows={18}
          disabled={isPending}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleFileFragment();
            }
          }}
          className={`relative w-full resize-none bg-transparent pl-14 pr-4 font-serif text-[17px] leading-8 tracking-[0.005em] text-[var(--color-ink)] placeholder:italic placeholder:text-[var(--color-ink-soft)]/70 focus:outline-none ${isPending ? 'opacity-50 blur-[1px]' : ''}`}
          style={{ caretColor: "var(--color-burgundy)" }}
        />

        {/* Fragment Stamp (appears after successful submission) */}
        <AnimatePresence>
          {stampedFragment !== null && (
            <FragmentStamp key="stamp" fragmentNumber={stampedFragment} />
          )}
        </AnimatePresence>
      </motion.div>

      <FoldRule className="mt-8" />

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div>
            <Label>Words</Label>
            <div className="font-serif text-lg leading-none">{words}</div>
          </div>
          <div>
            <Label>Reading</Label>
            <div className="font-serif text-lg leading-none">
              {Math.max(1, Math.ceil(words / 220))}′
            </div>
          </div>
          <div>
            <Label>Folio</Label>
            <div className="font-serif text-lg leading-none">
              {String(goal.entries.length + 1).padStart(4, "0")}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.1em] opacity-30 hidden sm:inline">Cmd + Enter</span>
          <FileFragmentButton onFile={handleFileFragment} isPending={isPending} disabled={!text.trim()} />
        </div>
      </footer>
    </section>
  );
}

function FileFragmentButton({ onFile, isPending, disabled }: { onFile: () => void, isPending: boolean, disabled: boolean }) {
  const [stamped, setStamped] = React.useState(false);
  
  const handleClick = () => {
    if (disabled || isPending) return;
    setStamped(true);
    onFile();
    setTimeout(() => setStamped(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isPending}
      className={`press relative inline-flex items-center gap-3 border border-[var(--color-ink)] bg-[var(--color-ink)] px-5 py-2.5 text-[var(--color-paper)] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className="font-mono text-[10px] tracking-[0.22em] uppercase">{isPending ? 'Filing...' : 'File Fragment'}</span>
      <span className="h-3 w-px bg-[var(--color-paper)]/30" />
      <span className="font-serif text-[13px] italic">into the archive</span>
      {stamped && (
        <span
          aria-hidden
          className="archive-stamp pointer-events-none absolute -right-4 -top-4"
          style={{ background: "var(--color-paper)" }}
        >
          Filed
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Right column — Archive Utilities
// ─────────────────────────────────────────────────────────────────────────────

function ArchiveUtilities({ goal }: { goal: GoalData }) {
  return (
    <aside className="reveal reveal-delay-2 flex h-full flex-col gap-8">
      <EditionPlate goal={goal} />
      <AccessionSlip goal={goal} />
      <VaultDeposit goal={goal} />
      <MetadataLedger goal={goal} />
      
      <div className="mt-8 flex justify-end opacity-30 hover:opacity-100 transition-opacity">
        <DestroyTracker goalId={goal.id} />
      </div>
    </aside>
  );
}

function EditionPlate({ goal }: { goal: GoalData }) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const togglePublic = () => {
    startTransition(async () => {
      await toggleGoalVisibility(goal.id, !goal.isPublic);
      router.refresh();
    });
  };

  return (
    <div className="paper-sheet p-6">
      <div className="flex items-start justify-between">
        <div>
          <Label>Edition</Label>
          <div className="mt-2 font-serif text-xl leading-none">
            {goal.isPublic ? "Public Edition" : "Secret Vault"}
          </div>
          <p className="mt-2 max-w-[26ch] font-serif text-[13px] italic leading-snug text-[var(--color-ink-soft)]">
            {goal.isPublic
              ? "Bound copy, visible on the public shelf."
              : "Sealed copy, kept in the private vault."}
          </p>
        </div>
        <span
          className="archive-stamp shrink-0"
          style={{
            color: goal.isPublic ? "var(--color-burgundy)" : "var(--color-ink-soft)",
            borderColor: goal.isPublic ? "var(--color-burgundy)" : "var(--color-ink-soft)",
          }}
        >
          {goal.isPublic ? "Public" : "Sealed"}
        </span>
      </div>
      <FoldRule className="my-5" />
      <button
        type="button"
        disabled={isPending}
        onClick={togglePublic}
        className="footnote-link text-[13px] disabled:opacity-50"
      >
        {isPending ? 'Updating...' : (goal.isPublic ? "Withdraw from public shelf" : "Bind for the public shelf")}
      </button>
    </div>
  );
}

function AccessionSlip({ goal }: { goal: GoalData }) {
  const [copied, setCopied] = React.useState(false);
  const [host, setHost] = React.useState('archive.dev');
  
  React.useEffect(() => {
    setHost(window.location.host);
  }, []);

  const url = `${host}/${goal.publicSlug}`;
  
  return (
    <div className="paper-sheet relative p-6 pinned-tilt">
      <span className="pin-dot absolute left-4 top-3" aria-hidden />
      <span className="pin-dot absolute right-4 top-3" aria-hidden />
      <Label>Accession slip</Label>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="font-mono text-[11px] tracking-[0.14em] text-[var(--color-ink-soft)] uppercase">
          № {goal.id.split('-')[0]}
        </span>
        <Ref>Shelf {goal.id.slice(0, 2).toUpperCase()}</Ref>
      </div>
      <div className="mt-3 border-t border-dashed border-[var(--color-rule)] pt-3">
        <div className="font-mono text-[12px] leading-snug text-[var(--color-ink)] break-all">
          {url}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            const fullUrl = `${window.location.origin}/${goal.publicSlug}`;
            navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
          className="ink-link text-[13px]"
        >
          {copied ? "Copied to hand" : "Copy the accession link"}
        </button>
        <span
          className={`font-mono text-[10px] tracking-[0.18em] transition-opacity duration-300 ${
            copied ? "opacity-100 text-[var(--color-burgundy)]" : "opacity-0"
          }`}
        >
          ✓ STAMPED
        </span>
      </div>
    </div>
  );
}

function VaultDeposit({ goal }: { goal: GoalData }) {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<"idle" | "submitting" | "received">("idle");
  
  React.useEffect(() => {
    const saved = localStorage.getItem('backup_email_v1');
    if (saved) setEmail(saved);
  }, []);

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) return;
    setState("submitting");
    try {
      localStorage.setItem('backup_email_v1', email);
      const editUrl = `${window.location.origin}/edit/${goal.id}`;
      await sendBackupEmail(email, editUrl);
      setState("received");
      setTimeout(() => setState("idle"), 2400);
    } catch (err) {
      console.error(err);
      setState("idle");
    }
  };

  return (
    <div className="paper-sheet p-6">
      <div>
        <Label>Preservation request</Label>
        <div className="mt-2 font-serif text-xl leading-none">Deposit into the Vault</div>
      </div>
      <p className="mt-3 max-w-[30ch] font-serif text-[13px] italic leading-snug text-[var(--color-ink-soft)]">
        A backup copy will be dispatched, sealed, to the address below.
      </p>

      <FoldRule className="my-5" />

      <div className="space-y-4">
        <div>
          <Label>Address for dispatch</Label>
          <div className="mt-2 border-b border-[var(--color-rule)]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@quiet.study"
              className="w-full bg-transparent pb-1 font-serif text-[15px] leading-tight text-[var(--color-ink)] placeholder:italic placeholder:text-[var(--color-ink-soft)]/60 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <FoldRule className="my-5" />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <Ref>signed</Ref>
          <Ref className="text-[var(--color-ink)]">@writer</Ref>
        </div>
        <button
          type="button"
          disabled={state !== "idle" || !email}
          onClick={handleSubmit}
          className="press border border-[var(--color-ink)] bg-transparent px-3 py-2 font-mono text-[10px] tracking-[0.1em] text-[var(--color-ink)] disabled:opacity-50 shrink-0"
        >
          {state === "idle" && "SUBMIT"}
          {state === "submitting" && "SEALING…"}
          {state === "received" && "RECEIVED"}
        </button>
      </div>
    </div>
  );
}

function MetadataLedger({ goal }: { goal: GoalData }) {
  const rows: Array<[string, React.ReactNode]> = [
    ["Created", <EditorialTime key="c" date={goal.createdAt} context="metadata" />],
    ["Last filed", goal.entries.length > 0 ? <EditorialTime key="l" date={goal.entries[0].createdAt} context="metadata" /> : "Never"],
    ["Visibility", goal.isPublic ? "Public" : "Private"],
    ["Status", goal.status === 'ACTIVE' ? "In progress" : "Archived"],
    ["Language", "en · gb"],
  ];
  return (
    <div className="paper-sheet p-6">
      <div className="flex items-baseline justify-between">
        <Label>Ledger</Label>
        <Ref>meta · v.03</Ref>
      </div>
      <dl className="mt-4 divide-y divide-[var(--color-rule)]">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="row-hover -mx-2 flex items-baseline justify-between px-2 py-2.5"
          >
            <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-ink-soft)]">
              {k}
            </dt>
            <dd className="font-serif text-[14px] text-[var(--color-ink)]">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// Progress — The "Shelf Index" archive visualization
// ─────────────────────────────────────────────────────────────────────────────

function CalendarHeatmap({ goal }: { goal: GoalData }) {
  const [currentDate, setCurrentDate] = React.useState(() => new Date());
  const [hoveredDay, setHoveredDay] = React.useState<{ date: string, count: number } | null>(null);

  // Group entries by YYYY-MM-DD
  const entriesByDate = React.useMemo(() => {
    const map: Record<string, number> = {};
    goal.entries.forEach(entry => {
      const d = new Date(entry.createdAt);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      map[dateKey] = (map[dateKey] || 0) + 1;
    });
    return map;
  }, [goal.entries]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = endOfMonth.getDate();
  const startDayOfWeek = startOfMonth.getDay(); // 0 = Sunday

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const isCurrentMonth = new Date().getFullYear() === year && new Date().getMonth() === month;

  // Build grid: pad with nulls for empty days at start
  const grid = Array.from({ length: startDayOfWeek }).map(() => null)
    .concat(Array.from({ length: daysInMonth }).map((_, i) => i + 1));

  // Refined designer ink scale
  const getDotStyle = (count: number) => {
    if (count === 0) return { 
      background: 'transparent', 
      border: '1px solid var(--color-rule)' 
    };
    if (count === 1) return { 
      background: 'oklch(0.70 0.10 20)', 
      boxShadow: 'inset 0 1px 1px oklch(1 1 1 / 0.2)',
      border: '1px solid oklch(0.60 0.12 20)' 
    };
    if (count === 2) return { 
      background: 'oklch(0.55 0.15 20)', 
      boxShadow: 'inset 0 1px 1px oklch(1 1 1 / 0.2)',
      border: '1px solid oklch(0.45 0.15 20)' 
    };
    if (count === 3) return { 
      background: 'oklch(0.40 0.18 20)', 
      boxShadow: 'inset 0 1px 1px oklch(1 1 1 / 0.15)',
      border: '1px solid oklch(0.30 0.18 20)' 
    };
    return { 
      background: 'var(--color-burgundy)', 
      boxShadow: 'inset 0 1px 1px oklch(1 1 1 / 0.1)',
      border: '1px solid oklch(0.2 0.1 20)' 
    };
  };

  const filedThisMonth = Array.from({ length: daysInMonth }).map((_, i) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
    return entriesByDate[key] || 0;
  }).reduce((a, b) => a + b, 0);

  // Stagger animation container
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.015 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 350, damping: 25 } }
  };

  return (
    <section className="reveal reveal-delay-3 paper-sheet relative p-8 lg:p-10">
      <div className="flex flex-wrap items-baseline justify-between gap-4 relative z-10 min-h-[48px]">
        <SectionHeading
          index="§ III"
          title="The Calendar"
          hint="each dot · one day filed"
        />
        
        {/* Dynamic Editorial Metadata Panel */}
        <div className="flex items-baseline gap-6 min-w-[140px] justify-end text-right">
          <AnimatePresence mode="wait">
            {hoveredDay ? (
              <motion.div 
                key="hovered"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-end"
              >
                <Label><EditorialTime date={hoveredDay.date} context="metadata" /></Label>
                <div className="font-serif text-[22px] leading-none flex items-baseline gap-1.5 text-[var(--color-burgundy)]">
                  {hoveredDay.count} <span className="text-[11px] text-[var(--color-ink-soft)] font-mono uppercase tracking-widest">logs</span>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="month"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-end"
              >
                <Label>This Month</Label>
                <div className="font-serif text-[22px] leading-none flex items-baseline gap-1.5">
                  {filedThisMonth} <span className="text-[11px] text-[var(--color-ink-soft)] font-mono uppercase tracking-widest">logs</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <FoldRule className="mt-4 mb-8 relative z-10" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="font-serif text-[22px] md:text-2xl text-[var(--color-ink)] flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-burgundy)] opacity-60" />
          {monthName} {year}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-rule)]/50 rounded-full transition-all active:scale-95">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={nextMonth} disabled={isCurrentMonth} className={`p-2 rounded-full transition-all active:scale-95 ${isCurrentMonth ? 'text-[var(--color-rule)] cursor-not-allowed' : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-rule)]/50'}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div className="relative z-10">
        <motion.div 
          key={`${year}-${month}`} 
          variants={container} 
          initial="hidden" 
          animate="show" 
          className="grid grid-cols-7 gap-y-4 gap-x-2 md:gap-y-6 md:gap-x-4 mb-2"
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-mono text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-[var(--color-ink-soft)]">
              {day}
            </div>
          ))}
          {grid.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="w-8 h-8 md:w-10 md:h-10 mx-auto" />;
            }

            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const count = entriesByDate[dateKey] || 0;
            const style = getDotStyle(count);
            
            // Is it today?
            const isToday = isCurrentMonth && day === new Date().getDate();

            return (
              <div 
                key={`day-${day}`} 
                className="relative flex justify-center items-center h-10 w-full"
                onMouseEnter={() => setHoveredDay({ date: dateKey, count })}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <motion.button
                  variants={item}
                  whileHover={{ scale: 1.15, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-6 h-6 md:w-[28px] md:h-[28px] rounded-full transition-shadow ${
                    isToday 
                      ? 'ring-1 ring-offset-[3px] ring-offset-[var(--color-paper)] ring-[var(--color-ink)]/30 shadow-[0_0_12px_rgba(0,0,0,0.03)]' 
                      : ''
                  }`}
                  style={style}
                  aria-label={`${dateKey}: ${count} logs`}
                />
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Recent fragments
// ─────────────────────────────────────────────────────────────────────────────

function RecentFragments({ goal }: { goal: GoalData }) {
  const [expanded, setExpanded] = React.useState(false);
  const [strikingIds, setStrikingIds] = React.useState<Set<string>>(new Set());
  const router = useRouter();
  
  const displayedEntries = expanded ? goal.entries : goal.entries.slice(0, 5);

  const handleDeleteEntry = (id: string) => {
    setStrikingIds(prev => new Set(prev).add(id));
    setTimeout(async () => {
      try {
        await deleteLogEntry(id);
        router.refresh();
      } catch (e) {
        console.error("Failed to delete entry", e);
        // Remove from striking if failed
        setStrikingIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    }, 600); // Wait for red pen strike animation
  };

  return (
    <section className="reveal reveal-delay-3 paper-sheet p-8 lg:p-10">
      <SectionHeading index="§ IV" title="Recent fragments" hint="most recent first" />
      <FoldRule className="mt-6" />
      <ul className="mt-2 divide-y divide-[var(--color-rule)]">
        <AnimatePresence>
          {goal.entries.length === 0 && (
            <motion.li 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="py-6 text-center font-serif italic text-[var(--color-ink-soft)]"
            >
              The archive is empty. Begin writing above.
            </motion.li>
          )}
          {displayedEntries.map((e, index) => (
            <motion.li 
              key={e.id} 
              layout
              initial={{ opacity: 1, height: 'auto' }}
              animate={{ opacity: strikingIds.has(e.id) ? 0.6 : 1 }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.4 }}
              className="row-hover group -mx-3 grid grid-cols-12 gap-6 px-3 py-6"
            >
              <div className="col-span-12 sm:col-span-2 flex flex-col gap-1">
                <Ref>E-{e.id.split('-')[0].toUpperCase()}</Ref>
                <div className="font-mono text-[11px] tracking-[0.14em] text-[var(--color-ink-soft)]">
                  <EditorialTime date={e.createdAt} context="compact" />
                </div>
              </div>
              <div className="col-span-12 sm:col-span-10">
                <div className="flex items-baseline justify-between w-full">
                  <div className="flex items-baseline gap-3">
                    <span className="bookmark" aria-hidden />
                    <h4 className="font-serif text-[19px] leading-tight">Folio · {goal.entries.length - index}</h4>
                  </div>
                  <button
                    onClick={() => handleDeleteEntry(e.id)}
                    title="Incinerate Fragment"
                    disabled={strikingIds.has(e.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1.5 text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-burgundy)] rounded-full hover:bg-[color:var(--color-burgundy)]/10 disabled:opacity-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="relative mt-2 max-w-[62ch]">
                  <p className={`font-serif text-[15px] leading-7 text-[var(--color-ink)] whitespace-pre-wrap transition-opacity duration-500 ${strikingIds.has(e.id) ? 'opacity-30' : ''}`}>
                    {e.content}
                  </p>
                  
                  {/* Ledger Strikethrough Animation (Red Pen) */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: strikingIds.has(e.id) ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute top-1/2 left-0 right-0 h-[2px] bg-[color:var(--color-burgundy)] origin-left pointer-events-none mix-blend-multiply"
                  />
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <FoldRule className="mt-2" />
      <div className="mt-6 flex items-center justify-between">
        <Ref>showing {Math.min(displayedEntries.length, goal.entries.length)} of {goal.entries.length}</Ref>
        {goal.entries.length > 5 && !expanded && (
          <button type="button" onClick={() => setExpanded(true)} className="ink-link text-[13px]">
            Walk the full archive →
          </button>
        )}
        {expanded && (
          <button type="button" onClick={() => setExpanded(false)} className="ink-link text-[13px]">
            Collapse archive ↑
          </button>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatArchivalDate(d: Date) {
  const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][
    d.getMonth()
  ];
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
  return `${String(d.getDate()).padStart(2, "0")} · ${roman} · ${weekday}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────────────────────

export default function EditWorkspaceRedesign({ goal }: { goal: GoalData }) {
  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-ink)] pb-32">
      {/* Running head */}
      <div className="mx-auto flex max-w-[1360px] items-baseline justify-between px-6 pt-10 lg:px-12">
        <div className="flex items-baseline gap-4">
          <Ref>SYNC · ARCHIVE</Ref>
          <span className="hidden sm:inline text-[var(--color-ink-soft)]">·</span>
          <Label className="hidden sm:inline">Edit workspace · folio {goal.entries.length + 1}</Label>
        </div>
        <Ref>Recto</Ref>
      </div>

      {/* The desk */}
      <main className="mx-auto grid max-w-[1360px] grid-cols-12 gap-6 px-6 pb-24 pt-8 lg:gap-8 lg:px-12">
        {/* Left — Volume plate */}
        <div className="col-span-12 lg:col-span-3">
          <VolumePlate goal={goal} />
        </div>

        {/* Center — Writing surface */}
        <div className="col-span-12 lg:col-span-6">
          <WritingSurface goal={goal} />
        </div>

        {/* Right — Archive utilities */}
        <div className="col-span-12 lg:col-span-3">
          <ArchiveUtilities goal={goal} />
        </div>

        {/* Full width — Shelf Index (progress) */}
        <div className="col-span-12 mt-4">
          <CalendarHeatmap goal={goal} />
        </div>

        {/* Full width — Recent fragments */}
        <div className="col-span-12 mt-2">
          <RecentFragments goal={goal} />
        </div>
      </main>

      {/* Colophon */}
      <footer className="mx-auto flex max-w-[1360px] items-baseline justify-between border-t border-[var(--color-rule)] px-6 py-8 lg:px-12">
        <Ref>colophon · set in Fraunces & Inter Tight</Ref>
        <Ref>№ {goal.id.split('-')[0].toUpperCase()} · shelf {goal.id.slice(0, 2).toUpperCase()}</Ref>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Physical Fragment Stamp Animation
// ─────────────────────────────────────────────────────────────────────────────

function FragmentStamp({ fragmentNumber }: { fragmentNumber: number }) {
  // Generate subtle physical randomness (always distinctly tilted by 30-40 degrees)
  const rotation = React.useMemo(() => (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 10), []); 
  const xOffset = React.useMemo(() => (Math.random() * 8 - 4), []);
  const yOffset = React.useMemo(() => (Math.random() * 8 - 4), []);
  const inkOpacity = React.useMemo(() => (0.88 + Math.random() * 0.12), []);

  return (
    <motion.div
      initial={{ x: xOffset, y: yOffset, opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(2px)" }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 m-auto pointer-events-none z-50 flex items-center justify-center mix-blend-multiply w-fit h-fit"
      style={{ perspective: 1000 }}
    >
      {/* 1. The Shadow (Simulates the descending handle) */}
      <motion.div
        initial={{ opacity: 0.15, scale: 1.5, y: -40, rotateZ: rotation }}
        animate={{ 
          opacity: [0.15, 0.4, 0, 0], 
          scale:   [1.5,  0.8, 1, 1],
          y:       [-40,  0,   0, 0]
        }}
        transition={{ duration: 0.75, times: [0, 0.2, 0.22, 1], ease: "easeIn" }}
        className="absolute w-24 h-24 bg-black rounded-full blur-md"
      />
      
      {/* 2. The Ink Transfer (Impact at 20% of timeline, persists) */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05, rotateZ: rotation, filter: 'blur(3px)' }}
        animate={{ 
          opacity: [0, 0, inkOpacity, inkOpacity],
          scale:   [1.05, 1.05, 0.98, 1],
          filter:  ['blur(3px)', 'blur(3px)', 'blur(0px)', 'blur(0.3px)']
        }}
        transition={{ 
          duration: 0.75, 
          times: [0, 0.2, 0.25, 1], // Impact is perfectly aligned with shadow vanishing
        }}
      >
        <svg width="180" height="180" viewBox="0 0 180 180" className="text-[var(--color-burgundy)] drop-shadow-sm">
           <defs>
              <filter id="distress" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                {/* Add a tiny bit of opacity noise for texture without destroying legibility */}
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 -0.2" in="noise" result="opacityNoise" />
                <feComposite operator="in" in="displaced" in2="opacityNoise" result="textured" />
              </filter>
              <path id="text-curve" d="M 42,95 A 48,48 0 0,0 138,95" fill="none" />
           </defs>

           <g filter="url(#distress)" fill="currentColor">
             {/* Outer Rings */}
             <circle cx="90" cy="90" r="70" fill="none" stroke="currentColor" strokeWidth="4" />
             <circle cx="90" cy="90" r="62" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="14 4" opacity="0.8" />
             
             {/* Flame Center */}
             <g transform="translate(62, 32) scale(2.4)">
               <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
             </g>

             {/* Fragment Number inside the Flame Base */}
             <text x="90" y="99" fontSize="18" fontFamily="var(--font-serif)" fontWeight="bold" textAnchor="middle" fill="var(--color-paper)" letterSpacing="0">
               {fragmentNumber}
             </text>

             {/* Curved Text */}
             <text fontSize="16" fontFamily="var(--font-sans)" fontWeight="700" letterSpacing="6" fill="currentColor">
               <textPath href="#text-curve" startOffset="50%" textAnchor="middle">
                 FRAGMENT
               </textPath>
             </text>
           </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}
