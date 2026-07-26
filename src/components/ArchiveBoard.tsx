'use client';

import { useMemo, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";

type Kind =
  | "note"
  | "index"
  | "notebook"
  | "scrap"
  | "letter"
  | "blueprint"
  | "sealed"
  | "certificate"
  | "catalog"
  | "clipping";

type Artifact = {
  id: string;
  kind: Kind;
  title: string;
  category: string;
  date: string;
  minutes: number;
  streak: number;
  tags: string[];
  excerpt: string;
  project?: string;
  goal?: string;
  annotation?: string;
  ref?: string;
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  rotate: number;
  offsetX: number;
  offsetY: number;
  z: number;
};

const TABS = ["All", "Projects", "Learning", "Reviews", "Milestones", "Research", "Reading", "Design"] as const;
type Tab = typeof TABS[number];

const KIND_TO_TAB: Record<Kind, Tab> = {
  note: "Learning",
  index: "Research",
  notebook: "Learning",
  scrap: "Learning",
  letter: "Reviews",
  blueprint: "Projects",
  sealed: "Milestones",
  certificate: "Milestones",
  catalog: "Reading",
  clipping: "Research",
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  const mon = d.toLocaleString("en", { month: "short" }).toUpperCase();
  return `${String(d.getDate()).padStart(2, "0")} · ${mon} · ${d.getFullYear()}`;
}

function daysAgo(iso: string) {
  const d = new Date(iso).getTime();
  return Math.floor((Date.now() - d) / 86_400_000);
}

import { GoalData } from "./EditWorkspaceRedesign";

const KINDS: Kind[] = [
  "note", "index", "notebook", "scrap", "letter", 
  "blueprint", "sealed", "certificate", "catalog", "clipping"
];

// Simple deterministic hash for stable visual randomization
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function ArchiveBoard({ goal }: { goal?: GoalData }) {
  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  
  // Month navigation state
  const [currentDate, setCurrentDate] = useState(() => new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const isCurrentMonth = new Date().getFullYear() === year && new Date().getMonth() === month;
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const liveArtifacts = useMemo(() => {
    if (!goal || !goal.entries) return [];

    // Filter entries for the selected month
    const monthEntries = goal.entries.filter(entry => {
      const d = new Date(entry.createdAt);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    return monthEntries.map((entry, index): Artifact => {
      const h = hashString(entry.id);
      
      // Deterministically pick kind based on ID hash to preserve variety
      const kind = KINDS[h % KINDS.length];
      const category = KIND_TO_TAB[kind];
      
      // Layout generation
      const colsPerRow = 3;
      const colIndex = index % colsPerRow; // 0, 1, 2
      const rowIndex = Math.floor(index / colsPerRow);
      
      // We want a slightly staggered masonry-ish feel
      const col = (colIndex * 4) + 1; // 1, 5, 9
      const row = (rowIndex * 3) + 1; // 1, 4, 7
      const colSpan = 3 + (h % 2); // 3 or 4 columns wide
      const rowSpan = 2 + ((h >> 1) % 2); // 2 or 3 rows tall
      
      const rotate = ((h % 7) - 3) * 1.5; // -4.5 to 4.5 degrees
      const offsetX = ((h >> 2) % 11) - 5; // -5 to 5 px
      const offsetY = ((h >> 3) % 9) - 4; // -4 to 4 px

      // Generate a title from the content (first ~6 words)
      const words = entry.content.split(/\s+/);
      const title = words.length > 6 
        ? words.slice(0, 6).join(" ") + "..."
        : words.join(" ") || `Folio ${goal.entries.length - index}`;

      return {
        id: entry.id,
        kind,
        title,
        category,
        date: entry.createdAt.toString(),
        minutes: 15 + (h % 45), // Fake metadata for aesthetics
        streak: 1 + (h % 10),
        tags: [],
        excerpt: entry.content,
        col,
        row,
        colSpan: colIndex === 2 ? Math.min(colSpan, 4) : colSpan, // ensure it doesn't break grid on right edge
        rowSpan,
        rotate,
        offsetX,
        offsetY,
        z: index,
      };
    });
  }, [goal, year, month]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return liveArtifacts.filter((a) => {
      if (tab !== "All") {
        if (tab === "Design" && a.category !== "UI Design") return false;
        if (tab !== "Design" && KIND_TO_TAB[a.kind] !== tab) return false;
      }
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [tab, query]);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1400px] px-6 pt-10 pb-6">
        <div className="flex items-baseline justify-between gap-6">
          <div>
            <div className="label-caps">Experimental · Fascicle IV</div>
            <h1 className="font-serif text-4xl md:text-5xl mt-2 leading-[1.05] text-[color:var(--color-ink)]">
              The Archive Board
            </h1>
            <p className="mt-3 text-[color:var(--color-ink-soft)] max-w-xl leading-relaxed">
              A quiet wall of evidence — every artifact is something you actually made,
              read, or resolved. Pinned in the order it was filed, not the order it was scored.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 archive-stamp">
            <span>Ref · AB-01</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-0 border-b border-[color:var(--color-rule)]">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`index-tab tab-lift ${tab === t ? "index-tab-active" : ""}`}
              >
                {t}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-3 bg-[var(--color-paper-deep)] px-3 py-1.5 rounded-full border border-[var(--color-rule)]">
              <button onClick={prevMonth} className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <span className="font-mono text-[11px] tracking-widest uppercase w-28 text-center text-[var(--color-ink)]">
                {monthName} {year}
              </span>
              <button onClick={nextMonth} disabled={isCurrentMonth} className={`transition-colors ${isCurrentMonth ? 'text-[var(--color-rule)] cursor-not-allowed' : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>

            <label className="flex items-baseline gap-3 min-w-[260px]">
              <span className="label-caps whitespace-nowrap">Catalog ·</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search titles, tags, subjects..."
                className="flex-1 bg-transparent border-0 border-b border-[color:var(--color-rule)] focus:border-[color:var(--color-ink)] outline-none py-1 font-mono text-sm text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-soft)]/60"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 pb-24">
        <Board artifacts={filtered} openId={openId} setOpenId={setOpenId} />
        <div className="mt-8 flex items-center justify-between text-[color:var(--color-ink-soft)]">
          <span className="label-caps">{filtered.length} of {liveArtifacts.length} artifacts on the board</span>
          <span className="ref-id">/archive-board · active session</span>
        </div>
      </div>
    </div>
  );
}

function Board({
  artifacts,
  openId,
  setOpenId,
}: {
  artifacts: Artifact[];
  openId: string | null;
  setOpenId: (id: string | null) => void;
}) {
  return (
    <div
      className="relative rounded-[14px] p-6 md:p-10"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.96 0.018 78), oklch(0.93 0.022 76))",
        boxShadow:
          "inset 0 0 0 10px oklch(0.34 0.05 40), inset 0 0 0 12px oklch(0.22 0.04 40), 0 30px 60px -30px oklch(0.2 0.02 80 / 0.35)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-3 rounded-[6px] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.55 0.04 60 / 0.10) 1px, transparent 1.4px), radial-gradient(oklch(0.30 0.03 60 / 0.08) 1px, transparent 1.4px)",
          backgroundSize: "9px 9px, 13px 13px",
          backgroundPosition: "0 0, 4px 6px",
          mixBlendMode: "multiply",
        }}
      />
      <LayoutGroup>
        <div
          className="relative grid gap-4"
          style={{
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            gridAutoRows: "56px",
          }}
        >
          {artifacts.map((a, i) => (
            <ArtifactCell
              key={a.id}
              artifact={a}
              index={i}
              open={openId === a.id}
              onOpen={() => setOpenId(openId === a.id ? null : a.id)}
            />
          ))}
          {artifacts.length === 0 && (
            <div className="col-span-12 py-24 text-center text-[color:var(--color-ink-soft)] label-caps">
              Nothing filed under this heading.
            </div>
          )}
        </div>
      </LayoutGroup>
    </div>
  );
}

function ArtifactCell({
  artifact,
  index,
  open,
  onOpen,
}: {
  artifact: Artifact;
  index: number;
  open: boolean;
  onOpen: () => void;
}) {
  const age = daysAgo(artifact.date);
  const fade = Math.min(0.28, Math.max(0, (age - 30) / 900));

  return (
    <motion.button
      type="button"
      layout
      onClick={onOpen}
      initial={{ opacity: 0, y: 12, rotate: 0 }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: open ? 0 : artifact.rotate,
        scale: open ? 1.02 : 1,
      }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.035, 1.6),
        ease: [0.22, 0.61, 0.36, 1],
      }}
      whileHover={{ y: -4, scale: 1.02, rotate: open ? 0 : artifact.rotate * 0.4 }}
      className="group relative text-left"
      style={{
        gridColumn: `${artifact.col} / span ${artifact.colSpan}`,
        gridRow: `${artifact.row} / span ${open ? artifact.rowSpan + 2 : artifact.rowSpan}`,
        transform: `translate(${artifact.offsetX}px, ${artifact.offsetY}px)`,
        zIndex: open ? 50 : artifact.z,
      }}
    >
      <ArtifactPaper artifact={artifact} open={open} fade={fade} />
    </motion.button>
  );
}

function ArtifactPaper({ artifact, open, fade }: { artifact: Artifact; open: boolean; fade: number }) {
  const paperTone = (() => {
    switch (artifact.kind) {
      case "note": return "oklch(0.92 0.055 92)";
      case "index": return "oklch(0.97 0.008 85)";
      case "notebook": return "oklch(0.955 0.012 82)";
      case "scrap": return "oklch(0.94 0.02 82)";
      case "letter": return "oklch(0.945 0.018 78)";
      case "blueprint": return "oklch(0.62 0.07 240)";
      case "sealed": return "oklch(0.95 0.014 82)";
      case "certificate": return "oklch(0.96 0.02 88)";
      case "catalog": return "oklch(0.965 0.01 84)";
      case "clipping": return "oklch(0.9 0.022 82)";
    }
  })();

  return (
    <div
      className="relative h-full w-full transition-shadow duration-200 group-hover:shadow-[0_20px_40px_-24px_oklch(0.2_0.02_80/0.45)]"
      style={{
        background: paperTone,
        border: "1px solid oklch(0.78 0.02 80)",
        boxShadow:
          "0 1px 0 oklch(1 0 0 / 0.6) inset, 0 2px 4px oklch(0.2 0.02 80 / 0.08), 0 12px 22px -18px oklch(0.2 0.02 80 / 0.35)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: `oklch(0.35 0.04 60 / ${fade})`, mixBlendMode: "multiply" }}
      />
      <Fastener kind={artifact.kind} />

      <div className="relative p-3 md:p-4 h-full flex flex-col">
        <KindHeader artifact={artifact} />
        <div className="mt-2 font-serif text-[15px] md:text-[17px] leading-snug text-[color:var(--color-ink)] line-clamp-3">
          {artifact.title}
        </div>

        {!open ? (
          <div className="mt-auto pt-2 flex items-end justify-between gap-2">
            <span className="ref-id">{artifact.id}</span>
            <span className="label-caps opacity-70">{artifact.category}</span>
          </div>
        ) : (
          <ExpandedContent artifact={artifact} />
        )}
      </div>

      {(artifact.kind === "letter" || artifact.kind === "clipping") && <FoldedCorner />}
    </div>
  );
}

function KindHeader({ artifact }: { artifact: Artifact }) {
  const label: Record<Kind, string> = {
    note: "Note",
    index: "Index Card",
    notebook: "Notebook Page",
    scrap: "Scrap",
    letter: "Weekly Letter",
    blueprint: "Blueprint",
    sealed: "Sealed Goal",
    certificate: "Milestone",
    catalog: "Catalog Ref",
    clipping: "Clipping",
  };
  const isBlueprint = artifact.kind === "blueprint";
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="label-caps" style={isBlueprint ? { color: "oklch(0.94 0.02 240)" } : undefined}>
        {label[artifact.kind]}
      </span>
      <span className="ref-id" style={isBlueprint ? { color: "oklch(0.92 0.02 240)" } : undefined}>
        {fmtDate(artifact.date)}
      </span>
    </div>
  );
}

function ExpandedContent({ artifact }: { artifact: Artifact }) {
  const isBlueprint = artifact.kind === "blueprint";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
      className="mt-3 flex-1 flex flex-col gap-3"
      style={isBlueprint ? { color: "oklch(0.96 0.02 240)" } : undefined}
    >
      <p className="font-serif italic text-[14px] leading-relaxed">
        "{artifact.excerpt}"
      </p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-[12px] font-mono">
        <dt className="opacity-70">Category</dt><dd>{artifact.category}</dd>
        <dt className="opacity-70">Duration</dt><dd>{artifact.minutes} min</dd>
        <dt className="opacity-70">Streak</dt><dd>{artifact.streak} d</dd>
        {artifact.project && (<><dt className="opacity-70">Project</dt><dd>{artifact.project}</dd></>)}
        {artifact.goal && (<><dt className="opacity-70">Goal</dt><dd>{artifact.goal}</dd></>)}
        {artifact.ref && (<><dt className="opacity-70">See also</dt><dd>{artifact.ref}</dd></>)}
      </dl>
      <div className="flex flex-wrap gap-1.5">
        {artifact.tags.map((t) => (
          <span key={t} className="px-1.5 py-0.5 text-[10px] font-mono border border-current/40 rounded-sm opacity-80">
            #{t}
          </span>
        ))}
      </div>
      {artifact.annotation && (
        <div className="mt-auto pt-2 text-[12px] italic font-serif opacity-75">
          — {artifact.annotation}
        </div>
      )}
    </motion.div>
  );
}

function Fastener({ kind }: { kind: Kind }) {
  switch (kind) {
    case "note": return <Pin />;
    case "index": return <Clip />;
    case "notebook": return <Tape />;
    case "scrap": return <Pin small />;
    case "letter": return <Ribbon />;
    case "blueprint": return <Clip binder />;
    case "sealed": return <WaxSeal />;
    case "certificate": return (<><Pin /><Pin right /></>);
    case "catalog": return <PunchHole />;
    case "clipping": return <Tape torn />;
  }
}

function Pin({ right = false, small = false }: { right?: boolean; small?: boolean }) {
  const size = small ? 10 : 14;
  return (
    <span
      aria-hidden
      className="absolute z-10 transition-transform duration-200 group-hover:rotate-6"
      style={{
        top: -6,
        left: right ? "auto" : "50%",
        right: right ? 14 : "auto",
        transform: right ? "none" : "translateX(-50%)",
        width: size,
        height: size,
        borderRadius: 999,
        background:
          "radial-gradient(circle at 35% 30%, oklch(0.85 0.12 55), oklch(0.5 0.14 40) 70%, oklch(0.32 0.08 40))",
        boxShadow: "0 2px 3px oklch(0.2 0 0 / 0.4), 0 0 0 1px oklch(0.25 0.05 40 / 0.5)",
      }}
    />
  );
}

function Clip({ binder = false }: { binder?: boolean }) {
  return (
    <span
      aria-hidden
      className="absolute z-10"
      style={{
        top: -14,
        left: 16,
        width: 22,
        height: 40,
        border: `2px solid ${binder ? "oklch(0.32 0.02 260)" : "oklch(0.55 0.02 250)"}`,
        borderRadius: "10px 10px 4px 4px",
        borderBottomColor: "transparent",
        opacity: 0.75,
      }}
    />
  );
}

function Tape({ torn = false }: { torn?: boolean }) {
  return (
    <span
      aria-hidden
      className="absolute z-10"
      style={{
        top: -8,
        right: 12,
        width: 64,
        height: 18,
        background: "oklch(0.92 0.02 80 / 0.75)",
        border: "1px solid oklch(0.78 0.02 80 / 0.6)",
        transform: "rotate(-6deg)",
        clipPath: torn
          ? "polygon(0 20%, 8% 0, 20% 30%, 30% 0, 45% 25%, 60% 5%, 75% 30%, 90% 0, 100% 25%, 100% 100%, 0 100%)"
          : undefined,
        boxShadow: "0 1px 2px oklch(0.2 0 0 / 0.12)",
      }}
    />
  );
}

function Ribbon() {
  return (
    <span
      aria-hidden
      className="absolute z-10"
      style={{
        top: -2,
        right: 20,
        width: 10,
        height: 34,
        background: "var(--color-burgundy)",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
        opacity: 0.9,
      }}
    />
  );
}

function WaxSeal() {
  return (
    <span
      aria-hidden
      className="absolute z-10 flex items-center justify-center font-mono text-[9px]"
      style={{
        bottom: -10,
        right: -10,
        width: 34,
        height: 34,
        borderRadius: 999,
        background: "radial-gradient(circle at 35% 30%, oklch(0.58 0.14 25), oklch(0.36 0.12 25) 75%)",
        color: "oklch(0.92 0.02 25)",
        boxShadow: "0 2px 4px oklch(0.2 0 0 / 0.35), inset 0 -2px 3px oklch(0.2 0 0 / 0.35)",
        transform: "rotate(-8deg)",
        letterSpacing: "0.1em",
      }}
    >
      P·A
    </span>
  );
}

function PunchHole() {
  return (
    <span
      aria-hidden
      className="absolute z-10"
      style={{
        top: 10,
        left: 10,
        width: 8,
        height: 8,
        borderRadius: 999,
        background: "oklch(0.75 0.02 80)",
        boxShadow: "inset 0 1px 2px oklch(0.2 0 0 / 0.35)",
      }}
    />
  );
}

function FoldedCorner() {
  return (
    <span
      aria-hidden
      className="absolute z-0 pointer-events-none"
      style={{
        bottom: 0,
        right: 0,
        width: 22,
        height: 22,
        background:
          "linear-gradient(135deg, transparent 50%, oklch(0.86 0.02 80) 50%, oklch(0.78 0.02 80) 100%)",
        boxShadow: "-2px -2px 3px oklch(0.2 0 0 / 0.08) inset",
      }}
    />
  );
}
