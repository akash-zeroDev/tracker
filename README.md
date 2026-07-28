# Sync

> A zero-friction, auth-less **Learn-in-Public** workspace shaped like an atelier — not a dashboard.

Declare a **Learning Goal**, file a **Daily Entry**, tend your **Streak**, and — when a body of work has settled — share a **Public Link** to your archive.

---

## 📹 Walkthrough

[![Watch the Loom walkthrough](https://img.shields.io/badge/Watch%20on%20Loom-5D41F9?style=for-the-badge&logo=loom&logoColor=white)](https://www.loom.com/playlists/c77ad96f-473a-4460-ab14-0e2a18b13076/view)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 + custom design tokens |
| **Typography** | Inter Tight · Fraunces · JetBrains Mono (via `next/font`) |
| **Animation** | Framer Motion 12 |
| **Database** | PostgreSQL (via [Prisma](https://prisma.io) ORM) |
| **Validation** | [Zod](https://zod.dev) v4 |
| **Date Utilities** | date-fns + date-fns-tz |
| **Icons** | Lucide React |
| **Email** | Nodemailer |
| **Code Quality** | ESLint · Prettier · Husky · lint-staged |

---

## Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Browser Client                      │
│  localStorage (active folio list, transient state)       │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP / Server Actions
┌───────────────────────▼─────────────────────────────────┐
│                   Next.js App Router                     │
│                                                          │
│  Pages (RSC)          Server Actions        REST API     │
│  /                    actions.ts            /api/v1/     │
│  /[slug]              (CRUD, streak)        folios/:id   │
│  /desk                                                   │
│  /edit                                                   │
│  /archive                                                │
│  /community                                              │
│  /editions                                               │
│  /entries                                                │
│  /manifesto                                              │
└───────────────────────┬─────────────────────────────────┘
                        │ Prisma Client
┌───────────────────────▼─────────────────────────────────┐
│                     PostgreSQL                           │
│                                                          │
│  Goal  ──── LogEntry                                     │
│   │              │                                       │
│  GoalPatina  LogEntryPatina   ArchiveAutomation          │
└─────────────────────────────────────────────────────────┘
```

### Data Model

```
Goal
 ├── id           (UUID)
 ├── publicSlug   (unique — drives public URL)
 ├── title / description / category
 ├── status       (ACTIVE | ARCHIVED)
 ├── isPublic     (Boolean)
 ├── currentStreak / longestStreak
 ├── lastLogDateText
 ├── LogEntry[]          ── one-to-many journal entries
 ├── GoalPatina?         ── read-count + patina score
 └── ArchiveAutomation?  ── hashed API key for CLI access
```

### Patina Scoring System

Every goal and log entry accumulates a **Patina Score** (0–1) — a compound metric that rewards longevity and genuine engagement, not vanity metrics:

```
score = (timeFactor × 0.4) + (interactionFactor × 0.6)

timeFactor        = eased progress over 365 days (ease-out quadratic)
interactionFactor = log-scaled read count, capped at 100 reads
```

Raw API keys for CLI automation are **never stored** — only their SHA-256 hash is persisted alongside a safe display prefix (e.g. `pa_live_4f9a`).

---

## Project Structure

```
tracker/
├── prisma/
│   └── schema.prisma          # Database models & relations
├── src/
│   ├── app/
│   │   ├── [slug]/            # Public folio view
│   │   ├── api/v1/folios/     # REST API (CLI / programmatic access)
│   │   ├── actions.ts         # Next.js Server Actions (CRUD, streaks)
│   │   ├── archive/           # Archive management
│   │   ├── community/         # Community pinboard
│   │   ├── desk/              # Private workspace dashboard
│   │   ├── edit/              # Folio editor
│   │   ├── editions/          # Editions view
│   │   ├── entries/           # Log entries manuscript
│   │   └── manifesto/         # Manifesto page
│   ├── components/
│   │   ├── ui/                # Stateless design system primitives
│   │   ├── transitions/       # Ink transition provider (page transitions)
│   │   ├── providers/         # React context providers
│   │   └── *.tsx              # Feature components (ArchiveClient, CommandLineAccess, …)
│   ├── lib/
│   │   ├── patina/engine.ts   # Patina scoring algorithm
│   │   ├── time/              # Timezone-aware date helpers
│   │   ├── prisma.ts          # Singleton Prisma client
│   │   ├── env.ts             # Validated environment variables
│   │   └── utils.ts           # Shared utilities
│   ├── data/                  # Static data / seed references
│   ├── hooks/                 # Custom React hooks
│   └── styles/                # Global CSS & design tokens
├── seed.ts                    # Database seed script
└── next.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- PostgreSQL database (e.g. [Supabase](https://supabase.com) free tier)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Fill in DATABASE_URL and DIRECT_URL in .env

# 3. Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# 4. (Optional) Seed sample data
npx ts-node seed.ts

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Code Quality

This repository enforces strict quality gates via Husky pre-commit hooks and GitHub Actions:

```bash
npm run lint       # ESLint
npm run format     # Prettier
npm run typecheck  # TypeScript strict mode
```

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **No authentication** | Zero friction is a core principle — anyone with the URL can log to their tracker |
| **Public slugs** | Human-readable, shareable URLs instead of opaque UUIDs |
| **Server Actions over API routes** | Colocation of data mutations with UI; avoids boilerplate for internal operations |
| **Hashed API keys** | CLI access keys are never stored in plaintext — SHA-256 hash only |
| **Patina score** | Rewards genuine, sustained effort over time rather than engagement spikes |

---

## License

ISC
