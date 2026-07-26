import * as React from "react";
import { getCommunityFeed } from '@/app/actions';
import Link from 'next/link';
import { EditorialTime } from '@/components/ui/EditorialTime';

type Kind = "index" | "slip" | "folded" | "tracing" | "bookmark";

export type Fragment = {
  id: string;
  ref: string;
  author: string;
  handle: string;
  goal: string;
  topic: string;
  streak: number;
  fragment: string;
  date: string | React.ReactNode;
  kind: Kind;
  tilt: number; // degrees, |x| <= 1
  featured?: boolean;
  publicSlug?: string;
};

const MOCK_FRAGMENTS: Fragment[] = [
  {
    id: "1",
    ref: "PA-0421 / vol.iii",
    author: "Iris Halden",
    handle: "@iris",
    goal: "Learning type theory in public",
    topic: "Type Theory",
    streak: 48,
    fragment:
      "Dependent types collapse the boundary between values and proofs — a function's signature can literally require the caller to have proven something first. Today: the Curry–Howard mirror, held up sideways.",
    date: "24 Jul 2026",
    kind: "index",
    tilt: -0.6,
    featured: true,
  },
  {
    id: "2",
    ref: "PA-0388",
    author: "Marcus Vale",
    handle: "@mv",
    goal: "Reading 100 papers on distributed systems",
    topic: "Consensus",
    streak: 31,
    fragment:
      "Raft doesn't beat Paxos on correctness. It wins on the fact that a person can hold the whole protocol in their head at 11pm.",
    date: "24 Jul",
    kind: "slip",
    tilt: 0.5,
  },
  {
    id: "3",
    ref: "PA-0102",
    author: "Sena Okafor",
    handle: "@sena",
    goal: "Studying the pigment archives of the 17th c.",
    topic: "Materials",
    streak: 12,
    fragment:
      "Lead-tin yellow was forgotten for two centuries — not lost to war, lost to a workshop closing without an apprentice.",
    date: "23 Jul",
    kind: "folded",
    tilt: -0.9,
  },
  {
    id: "4",
    ref: "PA-0257",
    author: "Jonas Krieger",
    handle: "@jk",
    goal: "Reimplementing a small CPython",
    topic: "Interpreters",
    streak: 22,
    fragment:
      "The GIL is not one lock — it's a social contract between the interpreter and every C extension ever written.",
    date: "23 Jul",
    kind: "tracing",
    tilt: 0.4,
  },
  {
    id: "5",
    ref: "PA-0511",
    author: "Amaya Rin",
    handle: "@amaya",
    goal: "One woodblock print per week for a year",
    topic: "Printmaking",
    streak: 7,
    fragment:
      "Registration marks first. Everything else is negotiable.",
    date: "22 Jul",
    kind: "bookmark",
    tilt: -0.5,
  },
  {
    id: "6",
    ref: "PA-0074",
    author: "Elena Prieto",
    handle: "@ep",
    goal: "Notes on urban cartography",
    topic: "Cartography",
    streak: 19,
    fragment:
      "A city map is a lie you agree to. The question is which lies you preserve.",
    date: "22 Jul",
    kind: "index",
    tilt: 0.8,
  },
];

function Pin({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={`pin-dot ${className}`}
      style={{ position: "absolute", ...style }}
    />
  );
}

function Clip({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={`paper-clip ${className}`}
      style={{ position: "absolute", ...style }}
    />
  );
}

function StreakGlyph({ n }: { n: number }) {
  return (
    <span
      className="label-caps"
      title={`${n}-day streak`}
      style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
    >
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: 999,
          background: "var(--color-burgundy)",
        }}
      />
      {n} day streak
    </span>
  );
}

function Meta({ f }: { f: Fragment }) {
  return (
    <div className="flex items-baseline justify-between gap-4 pt-4">
      <span className="ref-id">{f.ref}</span>
      <span className="label-caps">{f.date}</span>
    </div>
  );
}

function Byline({ f }: { f: Fragment }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div>
        <div className="label-caps">Filed by</div>
        <div
          className="font-serif"
          style={{ fontSize: "1.05rem", lineHeight: 1.2 }}
        >
          {f.author}{" "}
          <span className="ref-id" style={{ marginLeft: 4 }}>
            {f.handle}
          </span>
        </div>
      </div>
      <StreakGlyph n={f.streak} />
    </div>
  );
}

function OpenArchive({ f }: { f: Fragment }) {
  if (f.publicSlug) {
    return (
      <Link href={`/${f.publicSlug}`} className="ink-link label-caps" style={{ letterSpacing: "0.2em" }}>
        Open archive →
      </Link>
    );
  }
  return (
    <a href="#" className="ink-link label-caps" style={{ letterSpacing: "0.2em" }}>
      Open archive →
    </a>
  );
}

/* ————— Individual note variants ————— */

function IndexCardNote({ f, featured }: { f: Fragment; featured?: boolean }) {
  return (
    <article
      className="paper-sheet paper-lift relative group"
      style={{
        padding: featured ? "2rem 2.25rem" : "1.5rem 1.75rem",
        transform: `rotate(${f.tilt}deg)`,
      }}
    >
      <Clip style={{ top: -14, left: featured ? 40 : 28 }} className="" />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 16,
          bottom: 16,
          left: featured ? 56 : 44,
          width: 1,
          background: "var(--color-burgundy)",
          opacity: 0.35,
        }}
      />
      <div style={{ paddingLeft: featured ? 44 : 32 }}>
        <div className="flex items-center gap-3">
          <span className="label-caps">Goal</span>
          <span className="ref-id">— {f.topic}</span>
        </div>
        <h3
          className="font-serif group-hover:text-[color:var(--color-burgundy)] transition-colors"
          style={{
            fontSize: featured ? "1.6rem" : "1.2rem",
            lineHeight: 1.15,
            marginTop: 6,
          }}
        >
          {f.goal}
        </h3>
        <p
          style={{
            marginTop: featured ? 18 : 14,
            lineHeight: 1.7,
            color: "var(--color-ink)",
            fontSize: featured ? "1.02rem" : "0.94rem",
          }}
        >
          {f.fragment}
        </p>
        <div style={{ marginTop: 18 }}>
          <Byline f={f} />
        </div>
        <hr className="fold-line" style={{ margin: "16px 0 10px" }} />
        <div className="flex items-center justify-between">
          <OpenArchive f={f} />
          <span className="ref-id">{f.ref}</span>
        </div>
      </div>
    </article>
  );
}

function PaperSlipNote({ f }: { f: Fragment }) {
  return (
    <article
      className="paper-sheet paper-lift relative group"
      style={{
        padding: "1.25rem 1.35rem 1rem",
        transform: `rotate(${f.tilt}deg)`,
      }}
    >
      <Pin style={{ top: -6, right: 18 }} />
      <div className="flex items-center gap-2">
        <span className="archive-stamp" style={{ transform: "rotate(-3deg)" }}>
          {f.topic}
        </span>
      </div>
      <p
        style={{
          marginTop: 14,
          lineHeight: 1.65,
          fontSize: "0.95rem",
        }}
      >
        <span
          className="font-serif group-hover:text-[color:var(--color-burgundy)] transition-colors"
          style={{ fontSize: "1.6rem", float: "left", lineHeight: 0.9, marginRight: 6, marginTop: 4 }}
        >
          “
        </span>
        {f.fragment}
      </p>
      <Meta f={f} />
      <hr className="fold-line" style={{ margin: "10px 0" }} />
      <div className="flex items-center justify-between">
        <div>
          <div className="font-serif" style={{ fontSize: "0.98rem" }}>
            {f.author}
          </div>
          <div className="ref-id">{f.goal}</div>
        </div>
        <StreakGlyph n={f.streak} />
      </div>
      <div style={{ marginTop: 10 }}>
        <OpenArchive f={f} />
      </div>
    </article>
  );
}

function FoldedNote({ f }: { f: Fragment }) {
  const fold = 22;
  return (
    <article
      className="paper-sheet paper-lift relative group"
      style={{
        padding: "1.35rem 1.5rem",
        transform: `rotate(${f.tilt}deg)`,
        overflow: "hidden",
      }}
    >
      {/* folded corner */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: `0 ${fold}px ${fold}px 0`,
          borderColor: `transparent var(--color-paper-deep) transparent transparent`,
          filter: "drop-shadow(-1px 1px 1px rgba(0,0,0,0.08))",
        }}
      />
      <div className="label-caps">{f.topic} · fragment</div>
      <h3
        className="font-serif group-hover:text-[color:var(--color-burgundy)] transition-colors"
        style={{ fontSize: "1.15rem", lineHeight: 1.2, marginTop: 4 }}
      >
        {f.goal}
      </h3>
      <p style={{ marginTop: 12, lineHeight: 1.7, fontSize: "0.94rem" }}>
        {f.fragment}
      </p>
      <div style={{ marginTop: 14 }}>
        <Byline f={f} />
      </div>
      <Meta f={f} />
      <div style={{ marginTop: 8 }}>
        <OpenArchive f={f} />
      </div>
    </article>
  );
}

function TracingNote({ f }: { f: Fragment }) {
  return (
    <article
      className="tracing-paper paper-lift relative group"
      style={{
        padding: "1.35rem 1.5rem",
        transform: `rotate(${f.tilt}deg)`,
      }}
    >
      <Pin style={{ top: -6, left: 22 }} />
      <Pin style={{ top: -6, right: 22 }} />
      <div className="label-caps">Working note · {f.topic}</div>
      <h3
        className="font-serif group-hover:text-[color:var(--color-burgundy)] transition-colors"
        style={{ fontSize: "1.15rem", lineHeight: 1.2, marginTop: 4 }}
      >
        {f.goal}
      </h3>
      <p
        style={{
          marginTop: 12,
          lineHeight: 1.75,
          fontSize: "0.94rem",
          fontStyle: "italic",
          color: "var(--color-ink-soft)",
        }}
      >
        {f.fragment}
      </p>
      <Meta f={f} />
      <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
        <span className="ref-id">— {f.author}</span>
        <StreakGlyph n={f.streak} />
      </div>
      <div style={{ marginTop: 10 }}>
        <OpenArchive f={f} />
      </div>
    </article>
  );
}

function BookmarkNote({ f }: { f: Fragment }) {
  return (
    <article
      className="paper-sheet paper-lift relative row-hover group"
      style={{
        padding: "1.35rem 1.5rem 1.35rem 1.75rem",
        transform: `rotate(${f.tilt}deg)`,
      }}
    >
      {/* bookmark ribbon */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: -6,
          left: 24,
          width: 14,
          height: 40,
          background: "var(--color-burgundy)",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
          boxShadow: "0 2px 3px rgba(0,0,0,0.15)",
        }}
      />
      <div className="label-caps" style={{ paddingLeft: 28 }}>
        Bookmarked · {f.topic}
      </div>
      <h3
        className="font-serif group-hover:text-[color:var(--color-burgundy)] transition-colors"
        style={{ fontSize: "1.15rem", lineHeight: 1.2, marginTop: 4, paddingLeft: 28 }}
      >
        {f.goal}
      </h3>
      <p style={{ marginTop: 12, lineHeight: 1.7, fontSize: "0.94rem" }}>
        {f.fragment}
      </p>
      <div style={{ marginTop: 14 }}>
        <Byline f={f} />
      </div>
      <Meta f={f} />
      <div style={{ marginTop: 8 }}>
        <OpenArchive f={f} />
      </div>
    </article>
  );
}

function Note({ f, featured }: { f: Fragment; featured?: boolean }) {
  switch (f.kind) {
    case "index":
      return <IndexCardNote f={f} featured={featured} />;
    case "slip":
      return <PaperSlipNote f={f} />;
    case "folded":
      return <FoldedNote f={f} />;
    case "tracing":
      return <TracingNote f={f} />;
    case "bookmark":
      return <BookmarkNote f={f} />;
  }
}

/* ————— Board ————— */

export default async function CommunityPinboard() {
  const dbGoals = await getCommunityFeed(6);

  // The first note MUST be an "index" card to fit the featured grid slot.
  // The rest can be randomly shuffled so the board feels organic every time.
  const remainingKinds: Kind[] = ["slip", "folded", "tracing", "bookmark", "index"];
  
  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const shuffledKinds = ["index", ...shuffle(remainingKinds)];
  const randomTilt = () => (Math.random() * 2.5 - 1.25); // Between -1.25 and 1.25 degrees

  const mapped: Fragment[] = dbGoals.map((goal, idx) => {
    const entry = goal.entries[0];
    return {
      id: goal.id,
      ref: `PA-${goal.id.split('-')[0].substring(0, 4)}`,
      author: "Folio Author", 
      handle: `@writer`,
      goal: goal.title,
      topic: goal.title.split(' ')[0] || "Topic",
      streak: goal.currentStreak,
      fragment: entry?.content || "Goal initiated. Awaiting first fragment.",
      date: <EditorialTime date={goal.createdAt} context="compact" />,
      kind: shuffledKinds[idx] as Kind,
      tilt: randomTilt(),
      featured: idx === 0,
      publicSlug: goal.publicSlug
    };
  });

  // If there are fewer than 6 real goals, we pad the rest with the mock fragments
  // and assign them the remaining shuffled kinds/tilts
  const mockPadding = MOCK_FRAGMENTS.slice(mapped.length, 6).map((mock, idx) => ({
    ...mock,
    kind: shuffledKinds[mapped.length + idx] as Kind,
    tilt: randomTilt(),
  }));

  const fragments = [...mapped, ...mockPadding];
  const [featured, ...rest] = fragments;

  return (
    <section
      aria-labelledby="community-pinboard-heading"
      style={{ padding: "6rem 1.5rem" }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Section header */}
        <header
          className="reveal"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            marginBottom: "3rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="label-caps">Section vii — community</div>
            <h2
              id="community-pinboard-heading"
              className="font-serif"
              style={{
                fontSize: "clamp(1.9rem, 3.2vw, 2.75rem)",
                lineHeight: 1.05,
                marginTop: 8,
                maxWidth: 720,
              }}
            >
              What thoughtful people are quietly learning.
            </h2>
            <p
              style={{
                marginTop: 14,
                color: "var(--color-ink-soft)",
                maxWidth: 560,
                lineHeight: 1.7,
              }}
            >
              Fragments pinned to the shared board this week — small
              pieces of larger, patient projects filed in the open.
            </p>
          </div>
          <span className="archive-stamp">Board · wk 30</span>
        </header>

        {/* Pinboard surface */}
        <div
          className="relative"
          style={{
            padding: "clamp(1.25rem, 3vw, 2.5rem)",
            border: "1px solid var(--color-rule)",
            borderRadius: 4,
            background:
              "repeating-linear-gradient(135deg, oklch(0.95 0.014 82 / 0.55), oklch(0.95 0.014 82 / 0.55) 6px, oklch(0.92 0.02 82 / 0.55) 6px, oklch(0.92 0.02 82 / 0.55) 7px)",
            boxShadow:
              "inset 0 0 60px oklch(0.4 0.03 60 / 0.08), 0 20px 40px -30px oklch(0.2 0.02 80 / 0.35)",
          }}
        >
          {/* corner pins on the board itself */}
          <span
            aria-hidden
            className="pin-dot"
            style={{ position: "absolute", top: 14, left: 14 }}
          />
          <span
            aria-hidden
            className="pin-dot"
            style={{ position: "absolute", top: 14, right: 14 }}
          />
          <span
            aria-hidden
            className="pin-dot"
            style={{ position: "absolute", bottom: 14, left: 14 }}
          />
          <span
            aria-hidden
            className="pin-dot"
            style={{ position: "absolute", bottom: 14, right: 14 }}
          />

          {/* Composition grid: featured left, stack right, strip bottom */}
          <div className="grid gap-8 lg:gap-10 lg:grid-cols-12">
            {/* Featured (large index card) */}
            <div
              className="reveal lg:col-span-7"
              style={{ animationDelay: "60ms" }}
            >
              <Note f={featured} featured />
            </div>

            {/* Right column: two smaller notes stacked */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="reveal" style={{ animationDelay: "140ms" }}>
                <Note f={rest[0]} />
              </div>
              <div
                className="reveal"
                style={{ animationDelay: "220ms", marginLeft: "clamp(0px, 4%, 32px)" }}
              >
                <Note f={rest[1]} />
              </div>
            </div>

            {/* Bottom strip: three offset supporting fragments */}
            <div className="lg:col-span-12 grid gap-8 md:grid-cols-3 mt-2">
              <div className="reveal" style={{ animationDelay: "300ms" }}>
                <Note f={rest[2]} />
              </div>
              <div
                className="reveal"
                style={{ animationDelay: "360ms", marginTop: "clamp(0px, 2vw, 24px)" }}
              >
                <Note f={rest[3]} />
              </div>
              <div className="reveal" style={{ animationDelay: "420ms" }}>
                <Note f={rest[4]} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer margin note */}
        <div
          className="reveal"
          style={{
            marginTop: "2.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 16,
            flexWrap: "wrap",
            animationDelay: "500ms",
          }}
        >
          <p
            className="font-serif"
            style={{
              fontStyle: "italic",
              color: "var(--color-ink-soft)",
              maxWidth: 520,
              lineHeight: 1.55,
            }}
          >
            “A shared workspace of people learning together — filed carefully,
            read slowly.”
          </p>
        </div>
      </div>
    </section>
  );
}
