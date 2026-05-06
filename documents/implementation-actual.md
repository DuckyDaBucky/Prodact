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
- A Gemini-backed product insight service with deterministic fallback recommendations for demo reliability.

## Development Environments

- Development:
  Local laptops running `npm run dev` against a shared or personal Neon branch.
- Testing:
  Manual smoke testing through `/login`, `/internal-signup`, and the protected app routes, plus `npm run lint` and `npm run build`.
- Production:
  Vercel-hosted MVP demo backed by Neon Postgres and server-side Gemini API calls when `GEMINI_API_KEY` is configured.

## Configuration Management

- Version control is Git with a documented `main`, `develop`, and `feature/*` branching model.
- Drizzle migrations are committed so every teammate can apply the same schema locally.
- The build and integration process is currently manual:
  `npm install`, `npm run db:migrate`, `npm run db:seed`, `npm run check`.
- Environment variables are managed locally through `.env.local` or `.env`.

## Coding & Integration Plan

- Protected product features continue to live under `src/app/(app)` so they inherit the shared session gate and layout.
- The Target dataset is loaded through `scripts/seed-target-products.ts`, which downloads the CSV sample, normalizes it, and upserts into Drizzle-managed tables.
- The Gemini insight service lives in `src/lib/gemini.ts` and sends selected seeded product fields plus derived signals to Gemini.
- The recommendation service lives in `src/lib/recommendations.ts` and combines category similarity, pricing proximity, ratings, and dataset-provided recommendation hints.
- The API layer exposes recommendations through `src/app/api/recommendations/[productId]/route.ts`.
- The UI surface for this feature is the updated `src/app/(app)/product-analysis/page.tsx`, which reads seeded products and renders explainable recommendations for a selected SKU.

## Final Demo Service Mapping

- Web Scraper Service:
  `scripts/seed-target-products.ts` is the reliable scraping and ingestion MVP. It downloads the public Target product dataset, parses CSV rows, normalizes product attributes, and upserts batches into Postgres. It avoids brittle live page scraping while still proving repeatable external-data ingestion.
- Database Service:
  `src/db/schema.ts`, Drizzle migrations, and `src/db/index.ts` define and connect the Neon Postgres data layer. The `target_product` table stores imported product records, while `recommendation_run` stores generated AI Recommendation results for traceability.
- Authentication Service:
  `src/lib/auth.ts`, `src/lib/session.ts`, `/login`, and `/internal-signup` implement employee ID authentication with Better Auth. The protected `(app)` layout requires a valid session before users can access dashboard, Product Analysis, and other internal routes.
- AI Recommendation Service:
  `src/lib/gemini.ts` processes selected products with Gemini when the key is configured. `src/lib/recommendations.ts` implements the `heuristic-v1` provider for ranked related products and fallback evidence.
- Notification Service:
  `/alerts` uses `src/lib/demo-data.ts` to derive product, restock, pricing, and data-quality notifications from seeded Target rows without adding schema risk.
- Demo Evidence:
  `/dashboard` includes final demo service cards, `/search` demonstrates professor-facing product lookup with Gemini insight, and `/product-analysis` demonstrates Database, Gemini, recommendation persistence, and explainable fallback behavior.

## Test Cases for Demo Evidence

- Web Scraper: run `npm run db:seed` and verify the console reports processed, inserted, updated, skipped, and elapsed counts.
- Database: run `npm run db:migrate`, then confirm Product Analysis can read seeded records from `target_product`.
- Authentication: create a demo account through `/internal-signup`, log out, log back in through `/login`, and confirm protected routes redirect unauthenticated users.
- AI Recommendation: open `/search` or `/product-analysis`, select a product, confirm Gemini or fallback insight appears, confirm recommendation cards show scores and reasons, and call `GET /api/recommendations/[productId]?limit=5` for JSON output.
