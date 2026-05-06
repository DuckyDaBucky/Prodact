# Prodact Internal Tool Boilerplate

Prodact is the Group 10 final demo application for a Target-style internal product intelligence tool. This repository is intentionally scoped as a clean foundation, not a full analytics product. The goal of this codebase is to give the team a working shell with authentication, route protection, database wiring, branding, and feature pages backed by seeded product data.

## What This Repo Already Does

- Supports employee ID login with Better Auth
- Provides a hidden signup route for school-project demo accounts
- Uses Neon Postgres with Drizzle ORM and committed migrations
- Seeds Target sample product data into Neon with a repeatable Web Scraper Service script
- Protects internal pages behind session checks
- Includes a branded internal app shell with sidebar and logout
- Shows final demo service cards on the dashboard
- Exposes Search and Product Analysis pages with Gemini-backed product insights
- Uses deterministic fallback analysis when Gemini is not configured or unavailable
- Uses seeded Target rows to drive inventory, notifications, store, competitor, and layout demo surfaces
- Documents how teammates should extend the project safely

## What This Repo Does Not Do Yet

- No real POS, inventory, ERP, or competitor API integrations
- No deep role-based access control beyond storing a `role`
- No admin UI for account management
- No live enterprise inventory, POS, or competitor data feeds yet

This is deliberate. The repo is meant to remove setup friction first.

## Final Demo Services

- Web Scraper Service:
  `scripts/seed-target-products.ts` downloads the Target product CSV, parses and normalizes rows, and upserts products into Postgres with repeatable console output.
- Database Service:
  Drizzle and Neon store auth data, direct messages, Target product records, and recommendation run history.
- Authentication Service:
  Better Auth supports employee ID login, hidden demo signup, session cookies, and protected internal routes.
- AI Recommendation Service:
  `src/lib/gemini.ts` calls Gemini for selected product analysis when `GEMINI_API_KEY` is configured. `src/lib/recommendations.ts` still ranks related products with explainable heuristic scoring and exposes results through `/product-analysis` plus `/api/recommendations/[productId]`.
- Notification Service:
  `/alerts` derives product, restock, pricing, and data-quality notifications from seeded Target rows without requiring a new schema.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Better Auth
- Neon Postgres
- Drizzle ORM
- Drizzle Kit
- csv-parse
- Tailwind CSS v4
- Lucide icons

## High-Level Architecture

The app is organized around three layers:

1. Auth and session layer
   - Better Auth handles credential validation, password hashing, sessions, and auth route handlers.
   - Users authenticate with `employeeId + password`.
   - Internally, signup still creates a hidden synthetic email because Better Auth's email/password flow is being used under the hood.

2. Database layer
   - Neon hosts the Postgres database.
   - Drizzle defines the schema and generates migrations.
   - Better Auth's required tables are committed in the app schema and migration files.

3. App shell layer
   - Public routes are limited to login and the hidden signup path.
   - All internal pages sit behind the protected `(app)` layout.
   - Future teams can add real feature logic route by route without reworking auth or navigation.

## Current Route Map

### Public routes

- `/login`
  - Main employee login page
- `/internal-signup`
  - Hidden route used only for creating demo accounts during the class project

### Protected routes

- `/dashboard`
  - Includes final demo service cards for Web Scraper, Database, Authentication, and AI Recommendation
- `/search`
  - Searches seeded Target products and runs Gemini-backed product insight for the selected result
- `/inventory`
  - Shows seeded-product restock planning with derived inventory signals
- `/pricing`
- `/product-analysis`
  - Seeded Target product analysis, ranked recommendations, stored run evidence, and Gemini insight
- `/alerts`
  - Product, restock, pricing, and data-quality notifications derived from Target rows
- `/reports`
- `/settings`

The protected pages are demo-ready MVP surfaces. Pages that do not use live enterprise integrations state that their values are seeded or derived for the class prototype.

## Authentication Design

### Visible user experience

- Users are expected to log in with an employee ID and password
- The UI does not expose a public signup button
- The tool looks and behaves like an internal application

### Hidden project behavior

- The route `/internal-signup` is available for class-project setup
- Anyone with the direct route can create a demo account
- New accounts default to the `employee` role

### Why this approach was chosen

- It preserves the internal-tool feel expected by the project concept
- It avoids implementing a full employee provisioning system for a school project
- It gives the team a fast path for creating test accounts

### Current account fields

- `id`
- `name`
- `email`
- `username`
- `displayUsername`
- `employeeId`
- `role`
- auth/session timestamps and related Better Auth fields

### Important note

Better Auth is configured so the user-facing identity is the employee ID. The hidden email field exists to support the auth library's email/password flow internally. Teammates should continue treating `employeeId` as the real login identity in the app.

## Database and Schema

The committed schema currently includes the Better Auth core tables:

- `user`
- `session`
- `account`
- `verification`
- `target_product`
- `recommendation_run`

The generated Drizzle schema lives in:

- `src/db/schema.ts`

The initial migration lives in:

- `drizzle/0000_black_vision.sql`

### Current user-specific fields that matter to the project

- `employee_id`
- `role`
- `username`

### Database connection behavior

- `src/db/index.ts` connects to Neon using `@neondatabase/serverless`
- the code normalizes `sslmode=require` to `sslmode=verify-full` so the current runtime is quieter and aligned with newer driver expectations

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

Required variables:

- `DATABASE_URL`
  - Neon connection string
  - prefer `sslmode=verify-full`
- `BETTER_AUTH_SECRET`
  - long random secret used by Better Auth
- `BETTER_AUTH_URL`
  - server URL, usually `http://localhost:3000`
- `NEXT_PUBLIC_APP_URL`
  - client-facing URL, usually `http://localhost:3000`
- `GEMINI_API_KEY`
  - Google AI Studio API key used by the server-only Gemini insight service
- `GEMINI_MODEL`
  - optional model override, defaults to `gemini-2.5-flash`

On Vercel, set the same variables in Project Settings. `BETTER_AUTH_URL` and
`NEXT_PUBLIC_APP_URL` should be the deployed URL or custom domain. The app can
fall back to Vercel's generated `VERCEL_URL`, but setting explicit URLs is safer
for the final demo. Never commit real API keys.

Example:

```env
DATABASE_URL="postgresql://YOUR_NEON_USER:YOUR_NEON_PASSWORD@YOUR_NEON_HOST/prodact?sslmode=verify-full"
BETTER_AUTH_SECRET="replace-with-a-long-random-secret-at-least-32-characters"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GEMINI_API_KEY="replace-with-your-google-ai-studio-key"
GEMINI_MODEL="gemini-2.5-flash"
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create your local env file

```bash
copy .env.example .env.local
```

Then add your real Neon credentials and auth values.

### 3. Apply the database migration

```bash
npm run db:migrate
```

### 4. Seed the Target sample dataset

```bash
npm run db:seed
```

This downloads the public Target sample CSV from GitHub and upserts the rows into the `target_product` table.

Verify the seeded demo data and recommendation service:

```bash
npm run db:verify
```

If you change the schema later, generate a new migration first:

```bash
npm run db:generate
```

### 5. Start the app

```bash
npm run dev
```

### 6. Open the app

- main login page: `http://localhost:3000/login`
- hidden signup page: `http://localhost:3000/internal-signup`

If port `3000` is already taken, Next.js may choose another port such as `3001`.

## Recommended First-Time Smoke Test

After setup, verify the following flow:

1. Open `/internal-signup`
2. Create a demo user with an employee ID and password
3. Confirm you are redirected into the protected app
4. Log out
5. Go to `/login`
6. Log back in with the same employee ID and password
7. Visit multiple protected routes
8. Search a seeded product on `/search` and confirm the AI insight panel says `Processed by Gemini` or `Fallback AI insight`

If that flow works, the basic auth shell is healthy.

## Project Structure

### App routes

- `src/app`
  - App Router structure
  - public routes
  - protected routes
  - auth API route

### Shared components

- `src/components`
  - branding
  - auth forms
  - layout pieces
  - placeholder page shell

### Auth and helpers

- `src/lib/auth.ts`
  - Better Auth server configuration
- `src/lib/auth-client.ts`
  - Better Auth client instance
- `src/lib/session.ts`
  - server-side session retrieval and protection helpers
- `src/lib/navigation.ts`
  - internal route definitions for the sidebar

### Database

- `src/db/index.ts`
  - Neon + Drizzle connection
- `src/db/schema.ts`
  - auth tables plus Target product and recommendation tables
- `drizzle.config.ts`
  - migration config
- `drizzle/`
  - generated SQL migrations
- `scripts/seed-target-products.ts`
  - downloads and seeds the Target sample CSV

### Documents

- `documents/implementation-actual.md`
- `documents/implementation-ideal.md`
- `documents/deployment-actual.md`
- `documents/deployment-ideal.md`

### Static assets

- `public/branding/target-mark.svg`
  - placeholder Target-style mark used in the branding lockup

## Important Files to Understand First

If a teammate is joining the project and wants the shortest path to understanding the codebase, start here:

1. `src/lib/auth.ts`
2. `src/lib/session.ts`
3. `src/app/(app)/layout.tsx`
4. `src/components/app-sidebar.tsx`
5. `src/db/schema.ts`
6. `src/lib/gemini.ts`
7. `src/lib/recommendations.ts`
8. `README.md`

## How To Extend the App Safely

### Adding a new internal page

1. Create a new route under `src/app/(app)/...`
2. Add it to `src/lib/navigation.ts` if it should appear in the sidebar
3. Reuse the existing protected layout rather than creating a second app shell

### Adding new database tables

1. Update `src/db/schema.ts`
2. Run `npm run db:generate`
3. Review the generated SQL
4. Run `npm run db:migrate`

### Adding backend logic

Use one of these patterns:

- App Router route handlers
- server actions
- shared helpers inside `src/lib`

Keep auth logic centralized. Do not duplicate credential or session checks inside every page.

### Adding role-based restrictions later

The current `role` field is stored but not deeply enforced. When the team is ready:

- add route-level role guards in the protected layout or route-specific helpers
- avoid scattering role checks directly inside many unrelated components
- define a small permission model first before coding

## Suggested Ownership Split for Teammates

This repo is designed so work can be divided without much conflict:

- Auth/layout owner
  - shared shell
  - sidebar/header
  - session protection
- Data/backend owner
  - Drizzle schema
  - route handlers
  - future integrations
- Feature page owners
  - dashboard
  - inventory
  - pricing
  - product analysis
  - alerts/reports/settings

Try to keep shared components stable and move feature-specific logic into the route that owns it.

## Branch Workflow

Recommended branch structure:

- `main`
  - stable demo-ready branch
- `develop`
  - integration branch for team work
- `feature/<name>`
  - short-lived feature branch

Recommended workflow:

1. branch from `develop`
2. make focused changes
3. run checks locally
4. open a PR
5. merge into `develop`
6. merge `develop` into `main` when preparing the demo

## Available Scripts

- `npm run dev`
  - start Next.js in development mode
- `npm run build`
  - create a production build
- `npm run start`
  - run the production build locally
- `npm run lint`
  - run ESLint
- `npm run db:generate`
  - generate a new Drizzle migration after schema edits
- `npm run db:migrate`
  - apply migrations to the configured database
- `npm run db:seed`
  - run the Web Scraper Service to download, normalize, and seed the Target sample dataset into Neon
- `npm run db:verify`
  - confirm the seeded Target products can be read and used by the AI Recommendation Service
- `npm run db:studio`
  - open Drizzle Studio
- `npm run check`
  - run lint and build together

## Vercel Deployment

This repo includes `vercel.json` so Vercel uses `npm ci` and `npm run build`.

Before deploying, configure these Vercel environment variables for Production and Preview:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`

Recommended deployment flow:

```bash
npm run check
npm run db:migrate
npm run db:seed
npm run db:verify
```

Then push `main` to GitHub and let Vercel deploy from Git integration, or deploy with the Vercel CLI:

```bash
vercel
vercel --prod
```

After deployment, verify `/login`, `/internal-signup`, `/dashboard`, `/search`, and `/product-analysis`.
Confirm the Search or Product Analysis insight panel says `Processed by Gemini` when the key is configured.

## Documents

The root `documents/` folder contains paired writeups for the current codebase and the ideal future state:

- `implementation-actual.md`
- `implementation-ideal.md`
- `deployment-actual.md`
- `deployment-ideal.md`

## Branding Notes

The app uses a reusable `Target logo + Prodact` lockup across auth screens and the internal layout.

Current branding asset:

- `public/branding/target-mark.svg`

If the team receives an official asset later, replace this file and keep the same path so components do not need to change.

## Known Limitations

- Signup is hidden but not access-controlled
- No email verification
- No password reset flow
- No real employee directory or admin provisioning
- No fine-grained authorization yet
- Feature pages use demo-derived signals rather than live enterprise integrations
- Gemini depends on the configured Google AI Studio key and falls back when unavailable

These are acceptable tradeoffs for the current class-project milestone.

## Troubleshooting

### Signup returns 500

Most likely cause:

- the database migrations were not applied

Fix:

```bash
npm run db:migrate
```

### Login or signup fails after env changes

Try:

1. stop the dev server
2. restart `npm run dev`

### Port 3000 is already in use

Next.js may switch to `3001` automatically. Check the terminal output and use that port in the browser.

### SSL warning from Postgres connection

Use `sslmode=verify-full` in `DATABASE_URL`. The project already normalizes older `sslmode=require` values, but the preferred env value is still `verify-full`.

### CSS warning about `-moz-osx-font-smoothing`

That warning is not coming from this repo's app code. It is a browser/dev stylesheet warning and does not affect the Prodact auth flow.

## Practical Next Steps for the Team

Good next implementation targets are:

1. Add real dashboard cards to `/dashboard`
2. Build inventory data tables on `/inventory`
3. Build pricing comparison UI on `/pricing`
4. Add route handlers for seeded or mock business data
5. Add requirement-to-page mapping back into the SED and presentation

## Quick Summary

This repository already gives the team:

- working auth
- working route protection
- working Neon/Drizzle setup
- committed schema and migration files
- branded internal UI shell
- clear extension points

That means future work should focus on implementing business features, not rebuilding infrastructure.
