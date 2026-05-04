# Deployment Plan (Actual Codebase)

## Deployment Strategy

- The current repository is not set up for full production deployment automation.
- Releases are effectively demo releases: the team stabilizes work on `develop`, merges into `main`, and validates the app manually.
- The architecture is still optimized for classroom delivery rather than continuous public release.

## Environment Setup

- The main runtime today is each developer's local machine.
- The application runs with `npm run dev` or a local production check using `npm run build` and `npm run start`.
- Data is backed by Neon Postgres using the configured `DATABASE_URL`.
- Environment values are stored locally in `.env.local` or `.env`.

## Release Process

- Pull the latest code from the shared branch.
- Install dependencies with `npm install`.
- Apply schema changes with `npm run db:migrate`.
- Load the Target sample data through the Web Scraper Service with `npm run db:seed`.
- Run verification with `npm run check`.
- Start the application and demo `/dashboard`, `/login`, `/internal-signup`, and `/product-analysis`.

## System Accessibility

- Users access the application through the Next.js web app, typically on `http://localhost:3000`.
- Login happens at `/login`.
- Demo account setup is available through `/internal-signup`.
- Protected feature pages, including the seeded Product Analysis route, are available only after authentication.

## PA4 MVP Verification

- Web Scraper Service:
  `npm run db:seed` downloads or imports the Target dataset, normalizes rows, and reports processed, inserted, updated, skipped, and elapsed counts.
- Database Service:
  `npm run db:migrate` applies the Drizzle schema, and the seeded `target_product` plus `recommendation_run` tables support the Product Analysis demo.
- Authentication Service:
  `/internal-signup` creates a demo employee account, `/login` authenticates with employee ID and password, and the protected app layout blocks unauthenticated access.
- AI Recommendation Service:
  `/product-analysis` reads seeded products, renders ranked recommendations with explainable reasons, and `GET /api/recommendations/[productId]?limit=5` returns recommendation JSON.

## Environment Blockers

- If Neon is unreachable from a local laptop, database migration and seed verification should be rerun from a machine or network with valid `DATABASE_URL` access.
- The app can still be linted and built locally without mutating production data.
