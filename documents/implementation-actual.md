# Implementation Plan (Actual Codebase)

## Development Approach

- The current repo fits an Agile-lite workflow for a 4-person class project.
- Work can be split into short feature branches off `develop`, reviewed in pull requests, and merged into `main` when the team is preparing a demo.
- The README already suggests practical ownership boundaries: auth/layout owner, data/backend owner, and feature page owners.
- A reasonable sprint cadence for this repo is 1 to 2 weeks, with each sprint ending in a working demo of one protected route or one backend capability.

## Technology Stack

- `Next.js 16` with the App Router for route-level layouts, protected pages, and API handlers in one codebase.
- `React 19` for the UI layer and interactive page components.
- `TypeScript` to keep route handlers, database models, and shared helpers consistent.
- `Better Auth` for employee ID login, session handling, and protected routes.
- `Neon Postgres` as the hosted relational database.
- `Drizzle ORM` and `drizzle-kit` for schema definition, typed queries, and SQL migrations.
- `Tailwind CSS v4` for consistent styling in the internal tool shell.
- `Lucide React` for lightweight icons.
- `csv-parse` for importing the Target product sample into the database.
- A heuristic recommendation service for explainable demo recommendations without requiring an external LLM key.

## Development Environments

- Development:
  Local laptops running `npm run dev` against a shared or personal Neon branch.
- Testing:
  Manual smoke testing through `/login`, `/internal-signup`, and the protected app routes, plus `npm run lint` and `npm run build`.
- Production:
  Not fully established yet. The repo is still positioned as a demo-ready school project rather than a deployed production system.

## Configuration Management

- Version control is Git with a documented `main`, `develop`, and `feature/*` branching model.
- Drizzle migrations are committed so every teammate can apply the same schema locally.
- The build and integration process is currently manual:
  `npm install`, `npm run db:migrate`, `npm run db:seed`, `npm run check`.
- Environment variables are managed locally through `.env.local` or `.env`.

## Coding & Integration Plan

- Protected product features continue to live under `src/app/(app)` so they inherit the shared session gate and layout.
- The Target dataset is loaded through `scripts/seed-target-products.ts`, which downloads the CSV sample, normalizes it, and upserts into Drizzle-managed tables.
- The recommendation service lives in `src/lib/recommendations.ts` and combines category similarity, pricing proximity, ratings, and dataset-provided recommendation hints.
- The API layer exposes recommendations through `src/app/api/recommendations/[productId]/route.ts`.
- The UI surface for this feature is the updated `src/app/(app)/product-analysis/page.tsx`, which reads seeded products and renders explainable recommendations for a selected SKU.
