'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { addLogEntry, sendBackupEmail, toggleGoalVisibility } from "@/app/actions";
import { DestroyTracker } from "./DestroyTracker";
import { GoalDescriptionEditor } from "./GoalDescriptionEditor";
import { GoalCategoryEditor } from "./GoalCategoryEditor";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface GoalData {
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
  const opened = new Date(goal.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' }).replace(/ /g, ' · ');
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
        <Stat label="Streak" value={goal.currentStreak} suffix="days" />
        <Stat label="Opened" value={ageDays} suffix="days ago" />
        <Stat label="Filed" value={goal.entries.length} suffix="frags." />
      </dl>

      <div className="pt-8 mt-8 border-t border-[var(--color-rule)]">
        <div className="flex items-center justify-between">
          <Label>Opened</Label>
          <Ref>{opened}</Ref>
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
  const router = useRouter();
  
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const today = new Date();
  const dateLabel = formatArchivalDate(today);

  const handleFileFragment = () => {
    if (!text.trim() || isPending) return;
    
    startTransition(async () => {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        await addLogEntry(goal.id, text, tz);
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
      <div className="relative mt-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[2px]"
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
          onChange={(e) => setText(e.target.value)}
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
      </div>

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
  const createdDate = new Date(goal.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' }).replace(/ /g, ' · ');
  const lastFiled = goal.entries.length > 0 ? new Date(goal.entries[0].createdAt).toLocaleDateString('en-GB') : "Never";
  
  const rows: Array<[string, string]> = [
    ["Created", createdDate],
    ["Last filed", lastFiled],
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

function ShelfIndex({ goal }: { goal: GoalData }) {
  const [hover, setHover] = React.useState<number | null>(null);
  
  // Deterministic heatmap from actual entries
  const total = 18 * 7; // 126 days
  const heatmap = React.useMemo(() => {
    const map = new Array(total).fill(0);
    goal.entries.forEach(entry => {
      const daysAgo = Math.floor((Date.now() - new Date(entry.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      const index = total - 1 - daysAgo;
      if (index >= 0 && index < total) {
        map[index] += 1;
      }
    });
    return map;
  }, [goal.entries]);

  const filed = heatmap.filter((v) => v > 0).length;
  
  // Helper to map weight (0-max) to 0, 1, 2, 3 for styling
  const normalizeWeight = (v: number) => {
    if (v === 0) return 0;
    if (v === 1) return 1;
    if (v === 2) return 2;
    return 3;
  };

  return (
    <section className="reveal reveal-delay-3 paper-sheet relative overflow-hidden p-8 lg:p-10">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <SectionHeading
          index="§ III"
          title="The Shelf"
          hint="each spine · one day filed"
        />
        <div className="flex items-baseline gap-6">
          <div>
            <Label>Filed</Label>
            <div className="font-serif text-xl leading-none">
              {filed}
              <span className="text-[11px] text-[var(--color-ink-soft)]">/{total}</span>
            </div>
          </div>
          <div>
            <Label>Cadence</Label>
            <div className="font-serif text-xl leading-none">
              {Math.round((filed / total) * 100)}%
            </div>
          </div>
        </div>
      </div>

      <FoldRule className="mt-6" />

      <div className="relative mt-10">
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-[6px]"
          style={{
            background: "linear-gradient(180deg, oklch(0.72 0.03 80), oklch(0.55 0.04 60))",
            boxShadow: "0 1px 0 oklch(1 0 0 / 0.5) inset, 0 6px 10px -6px oklch(0.2 0.02 80 / 0.5)",
          }}
        />
        <div
          aria-hidden
          className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[var(--color-rule)]"
        />

        <div className="flex h-56 items-end gap-[3px]">
          {heatmap.map((rawVal, i) => {
            const v = normalizeWeight(rawVal);
            const isEmpty = v === 0;
            const h = isEmpty ? 26 : 60 + v * 34;
            const isHover = hover === i;
            return (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                onFocus={() => setHover(i)}
                onBlur={() => setHover((h) => (h === i ? null : h))}
                aria-label={`Day ${i + 1}`}
                className="group relative flex-1 origin-bottom cursor-default transition-transform duration-300 ease-out"
                style={{
                  height: `${h}px`,
                  transform: isHover ? "translateY(-6px)" : "translateY(0)",
                }}
              >
                <span
                  aria-hidden
                  className="block h-full w-full"
                  style={{
                    background: isEmpty
                      ? "repeating-linear-gradient(180deg, oklch(0.93 0.014 82) 0 4px, oklch(0.9 0.018 82) 4px 5px)"
                      : volumeColor(v),
                    boxShadow: isEmpty
                      ? "inset 0 0 0 1px var(--color-rule)"
                      : "inset 0 0 0 1px oklch(0.2 0.02 80 / 0.25), inset 1px 0 0 oklch(1 0 0 / 0.35), 0 6px 10px -8px oklch(0.2 0.02 80 / 0.5)",
                    borderTopLeftRadius: 1,
                    borderTopRightRadius: 1,
                  }}
                />
                {!isEmpty && (
                  <>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-0 right-0 h-[3px]"
                      style={{ top: "22%", background: "oklch(0.2 0.02 80 / 0.35)" }}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-0 right-0 h-[3px]"
                      style={{ bottom: "22%", background: "oklch(0.2 0.02 80 / 0.35)" }}
                    />
                  </>
                )}
              </button>
            );
          })}
        </div>

        <div className="pointer-events-none absolute left-0 top-0 h-full w-full" aria-hidden>
          {hover !== null && (
            <div
              className="absolute -top-2 max-w-[220px] paper-sheet px-4 py-3"
              style={{
                left: `calc(${(hover / total) * 100}% - 90px)`,
                transform: "translateY(-100%)",
              }}
            >
              <Label>Volume</Label>
              <div className="mt-1 font-serif text-[15px] leading-tight">
                {heatmap[hover] === 0 ? "Empty Day" : `${heatmap[hover]} Fragment(s)`}
              </div>
              <div className="mt-1 font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-soft)]">
                {total - 1 - hover} days ago
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Ref>earliest ⟶ today</Ref>
        <div className="flex items-center gap-3">
          <Label>Weight</Label>
          <div className="flex items-end gap-[2px]">
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className="block w-2"
                style={{ height: `${8 + n * 4}px`, background: volumeColor(n) }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function volumeColor(weight: number) {
  if (weight >= 3) return "oklch(0.36 0.09 25)"; 
  if (weight === 2) return "oklch(0.48 0.06 45)"; 
  return "oklch(0.58 0.04 70)"; 
}

// ─────────────────────────────────────────────────────────────────────────────
// Recent fragments
// ─────────────────────────────────────────────────────────────────────────────

function RecentFragments({ goal }: { goal: GoalData }) {
  const [expanded, setExpanded] = React.useState(false);
  const displayedEntries = expanded ? goal.entries : goal.entries.slice(0, 5);

  return (
    <section className="reveal reveal-delay-3 paper-sheet p-8 lg:p-10">
      <SectionHeading index="§ IV" title="Recent fragments" hint="most recent first" />
      <FoldRule className="mt-6" />
      <ul className="mt-2 divide-y divide-[var(--color-rule)]">
        {goal.entries.length === 0 && (
          <li className="py-6 text-center font-serif italic text-[var(--color-ink-soft)]">
            The archive is empty. Begin writing above.
          </li>
        )}
        {displayedEntries.map((e, index) => (
          <li key={e.id} className="row-hover group -mx-3 grid grid-cols-12 gap-6 px-3 py-6">
            <div className="col-span-12 sm:col-span-2 flex flex-col gap-1">
              <Ref>E-{e.id.split('-')[0].toUpperCase()}</Ref>
              <div className="font-mono text-[11px] tracking-[0.14em] text-[var(--color-ink-soft)]">
                {new Date(e.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
              </div>
            </div>
            <div className="col-span-12 sm:col-span-10">
              <div className="flex items-baseline gap-3">
                <span className="bookmark" aria-hidden />
                <h4 className="font-serif text-[19px] leading-tight">Folio · {goal.entries.length - index}</h4>
              </div>
              <p className="mt-2 max-w-[62ch] font-serif text-[15px] leading-7 text-[var(--color-ink)] whitespace-pre-wrap">
                {e.content}
              </p>
            </div>
          </li>
        ))}
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
          <ShelfIndex goal={goal} />
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
