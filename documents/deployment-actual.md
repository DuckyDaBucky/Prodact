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
- Load the Target sample data with `npm run db:seed`.
- Run verification with `npm run check`.
- Start the application and demo the protected routes.

## System Accessibility

- Users access the application through the Next.js web app, typically on `http://localhost:3000`.
- Login happens at `/login`.
- Demo account setup is available through `/internal-signup`.
- Protected feature pages, including the seeded Product Analysis route, are available only after authentication.
