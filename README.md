# Prodact Internal Tool Boilerplate

Prodact is a minimal internal-tool starter for the Group 10 PA4 prototype. This repo is intentionally focused on authentication, routing, layout, and handoff structure so teammates can build feature pages without reworking the app foundation.

## Current Scope

- Employee ID login using Better Auth
- Hidden signup route for school-project account creation
- Neon + Drizzle setup with committed schema and migrations
- Protected internal app shell
- Placeholder routes for future inventory, pricing, reports, and analytics work
- Target-style branding component with a swappable logo asset

Out of scope for this phase:

- AI analytics and forecasting
- External system integrations
- Real executive/business dashboards
- Production-grade RBAC and approval workflows

## Stack

- Next.js App Router
- TypeScript
- Better Auth
- Neon Postgres
- Drizzle ORM + Drizzle Kit
- Tailwind CSS v4

## Environment Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in your Neon connection string and auth values.
3. Install dependencies:

```bash
npm install
```

4. Generate migrations if the schema changes:

```bash
npm run db:generate
```

5. Apply migrations to Neon:

```bash
npm run db:migrate
```

6. Start the app:

```bash
npm run dev
```

The app will run at `http://localhost:3000`.

## Required Environment Variables

- `DATABASE_URL`: Neon Postgres connection string
- `BETTER_AUTH_SECRET`: long random secret for Better Auth
- `BETTER_AUTH_URL`: server base URL, usually `http://localhost:3000`
- `NEXT_PUBLIC_APP_URL`: client-facing app URL, usually `http://localhost:3000`

## Auth Flow

- Public login page: `/login`
- Hidden signup page: `/internal-signup`
- Protected pages:
  - `/dashboard`
  - `/inventory`
  - `/pricing`
  - `/product-analysis`
  - `/alerts`
  - `/reports`
  - `/settings`

The signup route is intentionally not linked in the UI. This keeps the visible experience aligned with an internal Target-style tool while still allowing demo account creation for the class project.

## How Accounts Work

- Users log in with `employeeId + password`
- Better Auth handles password hashing and sessions
- Each user also stores a default `role`
- The current signup flow creates accounts as `employee` by default

If you need an executive or admin-style account for demos, update the user's role directly in the database for now. Full role-management UI is intentionally deferred.

## Project Structure

- `src/app`: routes, layouts, auth entrypoints, and protected pages
- `src/components`: shared UI pieces such as branding, forms, and layout chrome
- `src/lib`: auth client/server setup and session helpers
- `src/db`: Drizzle database connection and generated schema
- `drizzle.config.ts`: migration configuration

## How Teammates Should Build On This

- Add new protected feature routes inside `src/app/(app)/...`
- Reuse the shared layout and branding components instead of rebuilding nav/header UI
- Add feature-specific database tables in `src/db/schema.ts`
- Run `npm run db:generate` after schema edits
- Keep auth/session checks centralized in the shared layout and session helper
- Wire new APIs through App Router route handlers or server actions as needed

## Logo Asset

The current logo file is a placeholder asset stored at `public/branding/target-mark.svg`.

If your team obtains the official asset, replace that file and keep the same filename so no code changes are needed.

## Suggested Team Workflow

- `main`: stable demo-ready branch
- `develop`: shared integration branch
- `feature/<name>`: short-lived feature branches
- Open a pull request before merging into `develop`
- Run `npm run check` before handing off work

## Quick Demo Flow

1. Visit `/internal-signup` directly to create a test user.
2. Log in at `/login` with the employee ID and password you created.
3. Navigate through the protected placeholder pages.
4. Build real features page by page on top of the existing shell.
