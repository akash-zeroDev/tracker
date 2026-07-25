import React from 'react';

export function RefId({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <span className={`ref-id ${className}`}>{children}</span>;
}

export function Label({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <span className={`label-caps ${className}`}>{children}</span>;
}

export function Stamp({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <span className={`archive-stamp ${className}`}>{children}</span>;
}

export function MarginNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-serif italic text-[0.82rem] leading-snug text-[color:var(--color-ink-soft)]">
      {children}
    </p>
  );
}

export function ReferenceSnippet({
  id,
  source,
  note,
}: {
  id: string;
  source: string;
  note: string;
}) {
  return (
    <figure className="group relative pt-2">
      <RefId>{id}</RefId>
      <blockquote className="mt-4 font-serif italic text-[1.02rem] leading-[1.6] text-[color:var(--color-ink)]">
        “{note}”
      </blockquote>
      <figcaption className="mt-5 flex items-center justify-between border-t border-[color:var(--color-rule)] pt-3">
        <span className="label-caps">{source}</span>
        <span className="ref-id opacity-60 transition-opacity duration-200 group-hover:opacity-100">cf. R-039</span>
      </figcaption>
    </figure>
  );
}

export function ComponentAtlas() {
  const items = [
    {
      n: "α",
      title: "Learning Goal",
      body: "A single objective, pinned to the desk. Long enough to matter, narrow enough to keep.",
    },
    {
      n: "β",
      title: "Daily Entry",
      body: "A dated fragment with a subject and a margin. Two sentences count.",
    },
    {
      n: "γ",
      title: "Streak",
      body: "A binding stitch, not a heatmap. Missed days remain visible; the book still holds.",
    },
    {
      n: "δ",
      title: "Public Link",
      body: "Your archive opened as a bound volume — permanent, quiet, well-typed.",
    },
  ];
  return (
    <section className="mx-auto max-w-[1180px] px-8 py-32">
      <div className="flex items-end justify-between">
        <div>
          <Label>Fig. 05 · Objects in the drawer</Label>
          <h2 className="mt-5 font-serif text-[2.4rem] leading-[1.1] tracking-tight">
            Four <span className="italic">objects</span>. Nothing else.
          </h2>
        </div>
        <RefId>index · α β γ δ</RefId>
      </div>
      <div className="mt-14 grid grid-cols-1 md:grid-cols-4">
        {items.map((it, i) => (
          <article
            key={it.n}
            className={
              "group relative py-2 md:py-4 md:px-8 " +
              (i === 0 ? "md:pl-0 " : "") +
              (i === items.length - 1 ? "md:pr-0 " : "") +
              (i < items.length - 1
                ? "md:border-r md:border-[color:var(--color-rule)]"
                : "")
            }
          >
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-[2.8rem] leading-none text-[color:var(--color-burgundy)] transition-transform duration-300 group-hover:-translate-y-0.5 inline-block">
                {it.n}
              </span>
              <RefId>0{i + 1}</RefId>
            </div>
            <h3 className="mt-8 font-serif text-[1.4rem] leading-[1.25]">
              {it.title}
            </h3>
            <p className="mt-4 font-serif text-[0.95rem] leading-[1.75] text-[color:var(--color-ink-soft)]">
              {it.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Stitch({ intensity }: { intensity: number }) {
  if (intensity === 0) {
    return (
      <span
        aria-hidden
        className="block h-[10px] w-[26px] border-t border-dashed border-[color:var(--color-rule)]"
      />
    );
  }
  const opacity = 0.35 + intensity * 0.22;
  return (
    <span
      aria-hidden
      className="block h-[10px] w-[26px] rounded-[1px]"
      style={{
        background: `repeating-linear-gradient(90deg, oklch(0.24 0.015 250 / ${opacity}) 0 4px, transparent 4px 6px)`,
      }}
    />
  );
}

export function ReadingMarkers() {
  const items = [
    { id: "B-11", title: "A Pattern Language", page: "p. 214 / 1171" },
    { id: "B-12", title: "Notes on the Synthesis of Form", page: "p. 63 / 216" },
    { id: "B-13", title: "The Craftsman — Sennett", page: "p. 148 / 326" },
  ];
  return (
    <div className="p-7">
      <div className="flex items-center justify-between">
        <Label>Reading markers</Label>
        <RefId>SHELF · III</RefId>
      </div>
      <ul className="mt-5 divide-y divide-[color:var(--color-rule)]">
        {items.map((b) => (
          <li key={b.id} className="group flex items-baseline gap-3 py-3">
            <span className="ref-id w-12 transition-colors duration-200 group-hover:text-[color:var(--color-ink)]">{b.id}</span>
            <span className="flex-1 font-serif text-[0.98rem] leading-tight">
              {b.title}
            </span>
            <span className="ref-id whitespace-nowrap">{b.page}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5"><MarginNote>
        — Marg. A bookmark is a promise to return; the archive is a promise kept.
      </MarginNote></div>
    </div>
  );
}
