# Prodact Internal Tool Boilerplate

Prodact is the Group 10 PA4 starter application for a Target-style internal product intelligence tool. This repository is intentionally scoped as a clean foundation, not a full analytics product. The goal of this codebase is to give the team a working shell with authentication, route protection, database wiring, branding, and placeholder feature pages so later work can focus on the actual business features.

## What This Repo Already Does

- Supports employee ID login with Better Auth
- Provides a hidden signup route for school-project demo accounts
- Uses Neon Postgres with Drizzle ORM and committed migrations
- Protects internal pages behind session checks
- Includes a branded internal app shell with sidebar and logout
- Exposes empty placeholder pages for future feature work
- Documents how teammates should extend the project safely

## What This Repo Does Not Do Yet

- No AI, forecasting, sentiment analysis, or advanced recommendation logic
- No real POS, inventory, ERP, or competitor API integrations
- No deep role-based access control beyond storing a `role`
- No production deployment automation yet
- No admin UI for account management
- No final business dashboards yet

This is deliberate. The repo is meant to remove setup friction first.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Better Auth
- Neon Postgres
- Drizzle ORM
- Drizzle Kit
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
- `/inventory`
- `/pricing`
- `/product-analysis`
- `/alerts`
- `/reports`
- `/settings`

These protected pages are intentionally placeholders. They are meant to be built out by teammates later.

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

Example:

```env
DATABASE_URL="postgresql://YOUR_NEON_USER:YOUR_NEON_PASSWORD@YOUR_NEON_HOST/prodact?sslmode=verify-full"
BETTER_AUTH_SECRET="replace-with-a-long-random-secret-at-least-32-characters"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
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

If you change the schema later, generate a new migration first:

```bash
npm run db:generate
```

### 4. Start the app

```bash
npm run dev
```

### 5. Open the app

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
  - generated auth schema
- `drizzle.config.ts`
  - migration config
- `drizzle/`
  - generated SQL migrations

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
6. `README.md`

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
- `npm run db:studio`
  - open Drizzle Studio
- `npm run check`
  - run lint and build together

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
- Feature pages are placeholders only
- No analytics engine yet

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
