# Precision Archive

The Precision Archive is a zero-friction, auth-less tracking utility built on absolute performance and objective truth.

## Architecture Overview

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Persistence:** PostgreSQL (via Prisma)
- **Client State:** Local Grid (`localStorage`)
- **Validation:** Zod

## Folder Structure

The repository is strictly separated by responsibility:

- `src/app/`: Next.js file-system routing (Origin, Console, Signal).
- `src/components/ui/`: Pure, stateless design system primitives (Buttons, Inputs).
- `src/lib/`: Shared utilities, environment validation, and constants.
- `src/styles/`: Global CSS and Tailwind variables.
- `prisma/`: Database schema definitions.

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your database strings.

   ```bash
   cp .env.example .env
   ```

3. **Database Setup**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Code Quality

This repository is governed by strict linting and formatting rules enforced by Husky and GitHub Actions. All code must pass:

- `npm run lint` (ESLint)
- `npm run format` (Prettier)
- `npm run typecheck` (TypeScript)
